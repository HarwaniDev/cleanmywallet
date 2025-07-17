export interface Token {
  name: string;
  symbol: string;
  balance: number;
  logoURI: string;
  mintAddress: string;
}

export interface NFT {
  name: string;
  symbol: string;
  balance: number;
  image: string;
  mintAddress: string;
}

export interface DustItem {
  name: string;
  type: 'token' | 'nft';
  logo: string;
  mintAddress: string;
  image?: string
}

export type TabType = 'Tokens' | 'NFTs' | 'Cleanup';