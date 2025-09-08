// src/components/VideoModal/VideoModalTabs.tsx
import { useState } from "react";

interface VideoModalTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  children: React.ReactNode;
}

export const VideoModalTabs = ({ activeTab, onTabChange, children }: VideoModalTabsProps) => {
  const tabs = ['Overview', 'Lessons', 'Practice', 'Community'];

  return (
    <div>
      {/* Tabs Navigation */}
      <div className="border-b border-zinc-800 mb-8">
        <div className="flex gap-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab.toLowerCase())}
              className={`pb-4 px-1 text-lg font-semibold transition-all relative whitespace-nowrap ${
                activeTab === tab.toLowerCase() ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500 rounded-t" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="pb-12">
        {children}
      </div>
    </div>
  );
};
