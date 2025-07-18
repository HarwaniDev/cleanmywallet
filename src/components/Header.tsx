import React from 'react';
import { Trash2 } from 'lucide-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const Header: React.FC = () => {
  return (
    <header className="mb-8">
      {/* Connect Wallet Button */}
      <div className="flex justify-end mb-4">
        <div className='border border-[#444] hover:border-[#14F195] hover:text-[#14F195] rounded'>
          <WalletMultiButton style={{ backgroundColor: "#1A1A1A" }} />
        </div>

      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4">
          <Trash2 className="text-[#14F195] w-8 h-8 sm:w-10 sm:h-10" />
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
            Clean My Wallet
          </h1>
        </div>
        <div className="max-w-2xl mx-auto px-4 py-5 bg-[#23272b] border border-[#333] rounded-lg shadow flex flex-col items-start gap-3">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#14F195]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
            <span className="text-white font-semibold text-base sm:text-lg">How does it work?</span>
          </div>
          <ul className="text-gray-300 text-left list-disc list-inside space-y-2 text-base sm:text-lg">
            <li>Your coins and NFTs are stored in token accounts linked to your wallet.</li>
            <li>Each token account requires a deposit to activate, paid by you or the sender of the token.</li>
            <li>If you have paid a deposit but are no longer holding the token, you may clean up the account and have your deposit returned to you.</li>
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;