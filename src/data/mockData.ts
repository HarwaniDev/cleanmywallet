import { Token, NFT } from '../types';

export const mockTokens: Token[] = [
  { name: "Rugged Coin", symbol: "RUG", balance: 0, logoURI: "rug.png" },
  { name: "Dead Token", symbol: "DEAD", balance: 0, logoURI: "dead.png" },
  { name: "Scam Coin", symbol: "SCAM", balance: 0, logoURI: "scam.png" },
  { name: "Real Token", symbol: "REAL", balance: 156.34, logoURI: "real.png" },
  { name: "Solana", symbol: "SOL", balance: 5.67, logoURI: "sol.png" },
  { name: "USDC", symbol: "USDC", balance: 1250.89, logoURI: "usdc.png" },
  { name: "Worthless", symbol: "WORTH", balance: 0, logoURI: "worth.png" },
  { name: "Rug Pull", symbol: "RUGPULL", balance: 0, logoURI: "rugpull.png" }
];

export const mockNFTs: NFT[] = [
  { name: "Dead Ape #1234", collection: "Rug Apes", balance: 0, image: "ape1.png" },
  { name: "Scam Punk #567", collection: "Fake Punks", balance: 0, image: "punk1.png" },
  { name: "Failed Art #890", collection: "Bad Art", balance: 0, image: "art1.png" },
  { name: "Cool Ape #123", collection: "Cool Apes", balance: 1, image: "cool1.png" },
  { name: "Real Punk #456", collection: "Real Punks", balance: 1, image: "punk2.png" },
  { name: "Amazing Art #789", collection: "Amazing Collection", balance: 1, image: "art2.png" },
  { name: "Worthless NFT #111", collection: "Worthless Collection", balance: 0, image: "worthless1.png" },
  { name: "Dead Project #222", collection: "Dead Projects", balance: 0, image: "dead1.png" },
  { name: "Rug Collection #333", collection: "Rugged Dreams", balance: 0, image: "rug1.png" },
  { name: "Scam Art #444", collection: "Scam Gallery", balance: 0, image: "scam1.png" }
];