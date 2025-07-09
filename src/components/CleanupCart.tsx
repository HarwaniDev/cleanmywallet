import React from 'react';
import { DustItem } from '../types';
import { Trash2, X, Coins, Image } from 'lucide-react';

interface CleanupCartProps {
  items: DustItem[];
  onRemoveItem: (item: DustItem) => void;
  onCleanup: () => void;
  estimatedSol: string;
}

const CleanupCart: React.FC<CleanupCartProps> = ({ 
  items, 
  onRemoveItem, 
  onCleanup, 
  estimatedSol 
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#1A1A1A] border border-dashed border-[#555] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="text-[#14F195]" size={24} />
          <h2 className="text-xl font-bold text-white">Dustbin Cart</h2>
        </div>
        
        <p className="text-gray-400 mb-4">
          Selected dead tokens/NFTs for cleanup
        </p>
        
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Trash2 size={48} className="mx-auto mb-4 opacity-50" />
            <p>No items selected for cleanup</p>
            <p className="text-sm mt-2">Click on dead tokens or NFTs to add them here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div 
                key={`${item.type}-${item.name}-${index}`}
                className="bg-[#2A2A2A] rounded-lg p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#1E1E1E] rounded-full flex items-center justify-center">
                    {item.type === 'token' ? (
                      <Coins className="text-[#14F195]" size={16} />
                    ) : (
                      <Image className="text-[#14F195]" size={16} />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">{item.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{item.type}</p>
                  </div>
                </div>
                
                <button
                  onClick={() => onRemoveItem(item)}
                  className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-red-400/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-[#14F195] font-bold text-lg">
              Estimated reclaim: {estimatedSol} SOL
            </p>
          </div>
          
          <button
            onClick={onCleanup}
            className="w-full bg-[#14F195] text-black font-bold py-4 px-6 rounded-lg 
                     hover:bg-[#12D082] transition-all duration-300 
                     hover:shadow-lg hover:shadow-[#14F195]/30 
                     active:scale-95"
          >
            🚀 Clean Up & Reclaim SOL
          </button>
        </div>
      )}
    </div>
  );
};

export default CleanupCart;