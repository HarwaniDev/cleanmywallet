export interface Token {
  name: string;
  symbol: string;
  balance: number;
  logoURI: string;
}

export interface NFT {
  name: string;
  collection: string;
  balance: number;
  image: string;
}

export interface DustItem {
  name: string;
  type: 'token' | 'nft';
  logo: string;
}

export type TabType = 'Tokens' | 'NFTs' | 'Cleanup';