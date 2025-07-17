import React from 'react';
import { NFT } from '../types';
import { Plus, Image } from 'lucide-react';

interface NFTCardProps {
  nft: NFT;
  isSelected: boolean;
  onSelect: (nft: NFT) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, isSelected, onSelect }) => {
  const isZeroBalance = nft.balance === 0;

  return (
    <div
      onClick={() => isZeroBalance && onSelect(nft)}
      className={`
        relative bg-[#1E1E1E] border border-[#444] rounded-lg p-3 
        transition-all duration-300 cursor-pointer
        ${isZeroBalance 
          ? 'hover:border-[#14F195] hover:shadow-lg hover:shadow-[#14F195]/20 hover:scale-105' 
          : 'opacity-50 cursor-not-allowed'
        }
        ${isSelected ? 'border-[#14F195] shadow-lg shadow-[#14F195]/30' : ''}
      `}
    >
      <div className="aspect-square bg-[#2A2A2A] rounded-lg mb-3 flex items-center justify-center">
        {/* <Image className="text-[#14F195]" size={32} /> */}
        <img src={nft.image} alt={nft.symbol} />
      </div>
      
      <div className="space-y-1">
        <h3 className="font-semibold text-white text-sm truncate">{nft.name}</h3>
        <p className="text-xs text-gray-400 truncate">{nft.symbol}</p>
        <p className="text-xs text-gray-400 truncate">balance: {nft.balance}</p>
      </div>
      
      {isZeroBalance && (
        <>
          <div className="absolute top-2 right-2">
            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              DEAD
            </div>
          </div>
          <div className={`
            absolute bottom-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center
            transition-all duration-300
            ${isSelected 
              ? 'border-[#14F195] bg-[#14F195] text-black' 
              : 'border-gray-500 hover:border-[#14F195]'
            }
          `}>
            <Plus size={12} />
          </div>
        </>
      )}
    </div>
  );
};

export default NFTCard;