import express from "express";
import cors from "cors";
import { createCloseAtaInstruction, fetchTokenAccounts } from "./helpers";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

const app = express();
const connection = new Connection(clusterApiUrl("mainnet-beta"));
app.use(express.json());
app.use(cors());

app.post("/fetchTokens", async (req, res) => {
    const { walletAddress } = req.body;
    try {
        const tokens = await fetchTokenAccounts(walletAddress);
        return res.json({
            tokens
        }).status(200);
    } catch (error) {
        console.log(error);
        return res.json({
            error: "Error fetching token accounts: " + error
        }).status(500);
    }

})

app.post("/redeemSOL", async (req, res) => {
    const { ataOwner, mintAddresses } = req.body;
    const pubKeyMintAddresses = [];
    for(let mint of mintAddresses) {
        pubKeyMintAddresses.push(new PublicKey(mint));
    }
    

    try {
        const serializedTx = await createCloseAtaInstruction(connection, new PublicKey(ataOwner), pubKeyMintAddresses);
        return res.json({
            serializedTx
        }).status(200);
    } catch (error) {
        console.log(error);
        return res.json({
            error: "Error fetching transaction: " + error
        }).status(500)
    }
})
app.listen(3001);