import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/fetchTokens", async (req, res) => {
    const { walletAddress } = req.body;
    try {
        const tokens = await fetchTokenAccounts(walletAddress);
        console.log(tokens);
        return res.json({
            response: tokens
        }).status(200);
    } catch (error) {
        console.log(error);
        return res.json({
            error: "Error fetching token accounts: " + error
        }).status(400);
    }

})

async function fetchTokenAccounts(walletAddress: string) {
    try {
        const tokens = await axios.post("https://api.mainnet-beta.solana.com", {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTokenAccountsByOwner",
            "params": [
                walletAddress,
                {
                    "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
                },
                {
                    "encoding": "jsonParsed"
                }
            ]
        }
        )
        const response = [];
        for (let token of tokens.data.result.value) {
            const mintAddress = token.account.data.parsed.info.mint;
            const data = await getTokenInfo(mintAddress);
            const tokenWithBalance = {
                ...data,
                balance: token.account.data.parsed.info.tokenAmount.uiAmount
            };
            response.push(tokenWithBalance);
        }
        return response;
    } catch (error) {
        throw new Error("Error in fetchTokenAccounts: " + error);
    }
}

async function getTokenInfo(mintAddress: string) {
    try {
        
        const response = await axios.post(`https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`, {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getAsset",
            "params": {
                "id": mintAddress
            }
        }
        )
        return {
            name: response.data.result.content.metadata.name,
            symbol: response.data.result.token_info.symbol,
            logoURI: response.data.result.content.links.image
        }
    } catch (error) {
        throw new Error("Error in getTokenInfo: " + error);
    }
}

app.listen(3001);