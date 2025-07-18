import axios from "axios";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { createCloseAccountInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
export async function fetchTokenAccounts(walletAddress) {
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
        });
        const tokensOwnedByUser = [];
        const NFTsOwnedByUser = [];
        for (let token of tokens.data.result.value) {
            const mintAddress = token.account.data.parsed.info.mint;
            if (token.account.data.parsed.info.tokenAmount.decimals !== 0) {
                //get token info
                const data = await getTokenInfo(mintAddress);
                const tokenWithBalanceAndMint = {
                    ...data,
                    balance: token.account.data.parsed.info.tokenAmount.uiAmount,
                    mintAddress: mintAddress
                };
                tokensOwnedByUser.push(tokenWithBalanceAndMint);
            }
            else {
                // get nft info
                const data = await getNFTInfo(mintAddress);
                const tokenWithBalanceAndMint = {
                    ...data,
                    balance: token.account.data.parsed.info.tokenAmount.uiAmount,
                    mintAddress: mintAddress
                };
                NFTsOwnedByUser.push(tokenWithBalanceAndMint);
            }
        }
        return { tokensOwnedByUser, NFTsOwnedByUser };
    }
    catch (error) {
        throw new Error("Error in fetchTokenAccounts: " + error);
    }
}
export async function getTokenInfo(mintAddress) {
    try {
        const response = await axios.post(`https://devnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`, {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getAsset",
            "params": {
                "id": mintAddress
            }
        });
        return {
            name: response.data.result.content.metadata.name,
            symbol: response.data.result.token_info.symbol,
            logoURI: response.data.result.content.links.image
        };
    }
    catch (error) {
        throw new Error("Error in getTokenInfo: " + error);
    }
}
export async function getNFTInfo(mintAddress) {
    try {
        const response = await axios.post(`https://mainnet.helius-rpc.com/?api-key=${process.env.HELIUS_API_KEY}`, {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getAsset",
            "params": {
                "id": mintAddress
            }
        });
        return {
            name: response.data.result.content.metadata.name,
            symbol: response.data.result.content.metadata.symbol,
            image: response.data.result.content.files[0].uri,
        };
    }
    catch (error) {
        throw new Error("Error in getNFTInfo: " + error);
    }
}
export async function createCloseAtaInstruction(connection, ataOwner, mintAddresses) {
    const tx = new Transaction();
    for (const mint of mintAddresses) {
        const ata = await getAssociatedTokenAddress(mint, ataOwner);
        // Skip if ATA does not exist
        const accountInfo = await connection.getAccountInfo(ata);
        if (!accountInfo)
            continue;
        const parsedInfo = await connection.getParsedAccountInfo(ata);
        const data = parsedInfo.value?.data;
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
    const serializedTx = tx.serialize({ requireAllSignatures: false }).toString("base64");
    return serializedTx;
}
