import React from 'react';
import { Token } from '../types';
import { Plus } from 'lucide-react';

interface TokenCardProps {
  token: Token;
  isSelected: boolean;
  onSelect: (token: Token) => void;
}

const TokenCard: React.FC<TokenCardProps> = ({ token, isSelected, onSelect }) => {
  const isZeroBalance = token.balance === 0;

  return (
    <div
      onClick={() => isZeroBalance && onSelect(token)}
      className={`
        relative bg-[#1E1E1E] border border-[#333] rounded-lg p-4 
        transition-all duration-300 cursor-pointer
        ${isZeroBalance 
          ? 'hover:border-[#14F195] hover:shadow-lg hover:shadow-[#14F195]/20 hover:scale-105' 
          : 'opacity-50 cursor-not-allowed'
        }
        ${isSelected ? 'border-[#14F195] shadow-lg shadow-[#14F195]/30' : ''}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2A2A2A] rounded-full flex items-center justify-center">
            <img src={token.logoURI} alt={token.symbol} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{token.name}</h3>
            <p className="text-sm text-gray-400">{token.symbol}</p>
          </div>
        </div>
        {isZeroBalance && (
          <div className={`
            w-8 h-8 rounded-full border-2 flex items-center justify-center
            transition-all duration-300
            ${isSelected 
              ? 'border-[#14F195] bg-[#14F195] text-black' 
              : 'border-gray-500 hover:border-[#14F195]'
            }
          `}>
            <Plus size={16} />
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Balance:</span>
        <span className={`font-medium ${isZeroBalance ? 'text-red-400' : 'text-white'}`}>
          {token.balance}
        </span>
      </div>
      
      {isZeroBalance && (
        <div className="absolute top-2 right-2">
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            DEAD
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenCard;