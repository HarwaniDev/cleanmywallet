import { PublicKey } from "@solana/web3.js";
import axios from "axios";

export async function fetchTokenAccounts(walletAddress: PublicKey) {
    const response = await axios.post("https://api.mainnet-beta.solana.com", {
        "jsonrpc": "2.0",
        "id": 1,
        "method": "getTokenAccountsByOwner",
        "params": [
            walletAddress.toBase58(),
            {
                "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"  // SPL Token Program ID
            },
            {
                "encoding": "jsonParsed"
            }
        ]
    }
    )
    return response.data.result.value;
}
