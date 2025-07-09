import React from 'react';
import { Trash2, Wallet } from 'lucide-react';

interface HeaderProps {
  onConnectWallet: () => void;
  isWalletConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ onConnectWallet, isWalletConnected }) => {
  return (
    <header className="mb-8">
      {/* Connect Wallet Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onConnectWallet}
          className={`
            flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base
            ${isWalletConnected 
              ? 'bg-[#14F195] text-black hover:bg-[#12D082]' 
              : 'bg-[#1A1A1A] text-white border border-[#444] hover:border-[#14F195] hover:text-[#14F195]'
            }
          `}
        >
          <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden xs:inline">
            {isWalletConnected ? 'Connected' : 'Connect Wallet'}
          </span>
          <span className="xs:hidden">
            {isWalletConnected ? 'Connected' : 'Connect'}
          </span>
        </button>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
          <Trash2 className="text-[#14F195] w-8 h-8 sm:w-10 sm:h-10" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Solana Cleanup Hero
          </h1>
        </div>
        <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto px-4">
          Reclaim your SOL by clearing out worthless tokens and NFTs
        </p>
      </div>
    </header>
  );
};

export default Header;