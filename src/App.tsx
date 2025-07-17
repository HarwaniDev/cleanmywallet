import { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import TokenCard from './components/TokenCard';
import NFTCard from './components/NFTCard';
import CleanupCart from './components/CleanupCart';
import { TabType, Token, NFT, DustItem } from './types';
import { mockNFTs } from './data/mockData';
import { ConnectionProvider, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl, Connection, Transaction } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import '@solana/wallet-adapter-react-ui/styles.css';
import axios from 'axios';

function AppContent() {
  const wallet = useWallet();
  const connection = new Connection(clusterApiUrl("devnet"));
  const [activeTab, setActiveTab] = useState<TabType>('Tokens');
  const [selectedItems, setSelectedItems] = useState<DustItem[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tx, setTx] = useState("");
  const [shouldSign, setShouldSign] = useState(false);
  const [loading, setLoading] = useState(false);
  // fetch tokens owned by wallet
  useEffect(() => {
    if (!wallet.publicKey) {
      return;
    }
    async function fetchTokens() {
      try {
        setLoading(true);
        const response = await axios.post("http://localhost:3001/fetchTokens", {
          walletAddress: wallet.publicKey
        })
        setTokens(response.data.tokens);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    fetchTokens();
    setSelectedItems([]);
  }, [wallet.publicKey]);

  //get serialized tx from backend
  useEffect(() => {
    if (!wallet.publicKey) {
      return;
    }
    async function getSerializedTx() {
      
      const mintAddresses = [];
      for (let item of selectedItems) {
        mintAddresses.push(item.mintAddress);
      }

      const response = await axios.post("http://localhost:3001/redeemSOL", {
        ataOwner: wallet.publicKey,
        mintAddresses: mintAddresses
      })

      setTx(response.data.serializedTx);
    }

    if (selectedItems.length > 0) {
      getSerializedTx();
    }
  }, [selectedItems])

  const handleTokenSelect = useCallback((token: Token) => {
    const dustItem: DustItem = {
      name: token.symbol,
      type: 'token',
      logo: token.logoURI,
      mintAddress: token.mintAddress
    };

    setSelectedItems(prev => {
      const exists = prev.find(item =>
        item.name === dustItem.name && item.type === dustItem.type
      );

      if (exists) {
        return prev.filter(item =>
          !(item.name === dustItem.name && item.type === dustItem.type)
        );
      }

      return [...prev, dustItem];
    });
  }, []);

  const handleNFTSelect = useCallback((nft: NFT) => {
    const dustItem: DustItem = {
      name: nft.name,
      type: 'nft',
      logo: nft.image,
      mintAddress: nft.mintAddress
    };

    setSelectedItems(prev => {
      const exists = prev.find(item =>
        item.name === dustItem.name && item.type === dustItem.type
      );

      if (exists) {
        return prev.filter(item =>
          !(item.name === dustItem.name && item.type === dustItem.type)
        );
      }

      return [...prev, dustItem];
    });
  }, []);

  const handleRemoveItem = useCallback((itemToRemove: DustItem) => {
    setSelectedItems(prev => prev.filter(item =>
      !(item.name === itemToRemove.name && item.type === itemToRemove.type)
    ));
  }, []);

  const handleGoToCleanup = useCallback(() => {
    setActiveTab('Cleanup');
  }, []);

  const handleCleanup = useCallback(() => {
    setShouldSign(true);
  }, []);

  useEffect(() => {
    async function signTx() {
      if (!tx) {
        console.error("No transaction to sign");
        setShouldSign(false);
        return;
      }
      if (wallet.signTransaction) {
        try {
          const buffer = Buffer.from(tx, "base64");
          const transaction = Transaction.from(buffer);
          const signedTx = await wallet.signTransaction(transaction);
          const txid = await connection.sendRawTransaction(signedTx.serialize());
          await connection.confirmTransaction(txid, "confirmed");
          setSelectedItems([]);
        } catch (error) {
          console.error("something went wrong: ", error);
        }
      } else {
        console.error("wallet.signTransaction is undefined");
      }
      setShouldSign(false);
    }

    if (shouldSign && tx) {
      signTx();
    }
  }, [shouldSign, tx]);

  const isTokenSelected = useCallback((token: Token) => {
    return selectedItems.some(item =>
      item.name === token.symbol && item.type === 'token'
    );
  }, [selectedItems]);

  const isNFTSelected = useCallback((nft: NFT) => {
    return selectedItems.some(item =>
      item.name === nft.name && item.type === 'nft'
    );
  }, [selectedItems]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Tokens':
        return (
          loading ? (
            <div className="text-center text-lg py-8">fetching tokens...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tokens && tokens.map((token, index) => (
                <TokenCard
                  key={`${token.symbol}-${index}`}
                  token={token}
                  isSelected={isTokenSelected(token)}
                  onSelect={handleTokenSelect}
                />
              ))}
            </div>
          )
        );
      case 'NFTs':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {mockNFTs.map((nft, index) => (
              <NFTCard
                key={`${nft.name}-${index}`}
                nft={nft}
                isSelected={isNFTSelected(nft)}
                onSelect={handleNFTSelect}
              />
            ))}
          </div>
        );
      case 'Cleanup':
        return (
          <div className="max-w-2xl mx-auto">
            <CleanupCart
              items={selectedItems}
              onRemoveItem={handleRemoveItem}
              onCleanup={handleCleanup}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
      <div className="container mx-auto px-4 py-8">
        <Header />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="animate-fadeIn">
          {renderTabContent()}
        </main>
        {/* Selection indicator with Go to Cleanup button */}
        {selectedItems.length > 0 && activeTab !== 'Cleanup' && (
          <div className="fixed bottom-6 right-6 bg-[#1A1A1A] border border-[#14F195] rounded-lg p-4 shadow-lg shadow-[#14F195]/20">
            <div className="flex items-center gap-4">
              <div className="text-[#14F195] font-medium">
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
              </div>
              <button
                onClick={handleGoToCleanup}
                className="bg-[#14F195] text-black px-4 py-2 rounded-lg font-medium 
                   hover:bg-[#12D082] transition-all duration-300 
                   hover:shadow-lg hover:shadow-[#14F195]/30 
                   active:scale-95"
              >
                Go to Cleanup →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new UnsafeBurnerWalletAdapter(),
    ],
    [network]
  );
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <AppContent />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;