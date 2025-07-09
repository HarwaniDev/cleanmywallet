import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import TokenCard from './components/TokenCard';
import NFTCard from './components/NFTCard';
import CleanupCart from './components/CleanupCart';
import { TabType, Token, NFT, DustItem } from './types';
import { mockTokens, mockNFTs } from './data/mockData';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Tokens');
  const [selectedItems, setSelectedItems] = useState<DustItem[]>([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleTokenSelect = useCallback((token: Token) => {
    const dustItem: DustItem = {
      name: token.symbol,
      type: 'token',
      logo: token.logoURI
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
      logo: nft.image
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

  const handleConnectWallet = useCallback(() => {
    // Simulate wallet connection
    if (!isWalletConnected) {
      setIsWalletConnected(true);
      // Simulate connection delay
      setTimeout(() => {
        alert('🎉 Wallet connected successfully!');
      }, 500);
    } else {
      setIsWalletConnected(false);
      alert('Wallet disconnected');
    }
  }, [isWalletConnected]);

  const handleGoToCleanup = useCallback(() => {
    setActiveTab('Cleanup');
  }, []);

  const handleCleanup = useCallback(() => {
    // Simulate cleanup animation
    const button = document.querySelector('button:last-child');
    if (button) {
      button.classList.add('animate-pulse');
      setTimeout(() => {
        button.classList.remove('animate-pulse');
        alert(`🎉 Successfully cleaned up ${selectedItems.length} items and reclaimed SOL!`);
        setSelectedItems([]);
      }, 2000);
    }
  }, [selectedItems.length]);

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

  const estimatedSol = (selectedItems.length * 0.002).toFixed(4);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Tokens':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockTokens.map((token, index) => (
              <TokenCard
                key={`${token.symbol}-${index}`}
                token={token}
                isSelected={isTokenSelected(token)}
                onSelect={handleTokenSelect}
              />
            ))}
          </div>
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
              estimatedSol={estimatedSol}
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
        <Header 
          onConnectWallet={handleConnectWallet}
          isWalletConnected={isWalletConnected}
        />
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

export default App;