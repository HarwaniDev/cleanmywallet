import React from 'react';
import { TabType } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: TabType[] = ['Tokens', 'NFTs', 'Cleanup'];

  return (
    <nav className="flex justify-center mb-8">
      <div className="flex bg-[#1A1A1A] rounded-full p-2 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              activeTab === tab
                ? 'bg-[#9945FF] text-white shadow-lg shadow-[#9945FF]/25'
                : 'text-gray-400 hover:text-white hover:bg-[#2A2A2A]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;