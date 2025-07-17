import axios from "axios";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createCloseAccountInstruction, getAssociatedTokenAddress } from "@solana/spl-token";

export async function fetchTokenAccounts(walletAddress: string) {
    try {
        const tokens = await axios.post("https://api.devnet.solana.com", {
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
                balance: token.account.data.parsed.info.tokenAmount.uiAmount,
                mintAddress: token.account.data.parsed.info.mint
            };
            response.push(tokenWithBalance);
        }
        return response;
    } catch (error) {
        throw new Error("Error in fetchTokenAccounts: " + error);
    }
}

export async function getTokenInfo(mintAddress: string) {
    try {

        const response = await axios.post(`https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`, {
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

export async function createCloseAtaInstruction(connection: Connection, ataOwner: PublicKey, mintAddresses: PublicKey[]) {
    const tx = new Transaction();

    for (const mint of mintAddresses) {
        const ata = await getAssociatedTokenAddress(mint, ataOwner);

        // Skip if ATA does not exist
        const accountInfo = await connection.getAccountInfo(ata);
        if (!accountInfo) continue;

        const parsedInfo = await connection.getParsedAccountInfo(ata);
        const data = parsedInfo.value?.data as any;
        const tokenAmount = data?.parsed?.info?.tokenAmount?.uiAmount;

        // Only add close instruction if balance is 0
        if (tokenAmount === 0) {
            const closeIx = createCloseAccountInstruction(ata, ataOwner, ataOwner);
            tx.add(closeIx);
        }
    }

    if (tx.instructions.length === 0) {
        throw new Error("No zero-balance ATAs found to close.");
    }

    tx.feePayer = ataOwner;
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    const serializedTx = tx.serialize({requireAllSignatures: false}).toString("base64");
    return serializedTx;
}