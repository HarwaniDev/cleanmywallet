import React from 'react';
import { Trash2 } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header: React.FC = () => {
  return (
    <header className="mb-8">
      {/* Connect Wallet Button */}
      <div className="flex justify-end mb-4">
        <div className='border border-[#444] hover:border-[#14F195] hover:text-[#14F195] rounded'>
          <WalletMultiButton style={{backgroundColor: "#1A1A1A"}} />
        </div>

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