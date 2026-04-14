import React, { useState } from 'react';

interface TabItem {
  title: string;
  content: string;
}

interface ProductDataTabsWidgetProps {
  tabs?: TabItem[];
  layout?: 'tabs' | 'accordion';
}

export default function ProductDataTabsWidget({ 
  tabs = [
    { title: 'Description', content: 'Detailed product description goes here. This area contains full specifications and marketing copy.' },
    { title: 'Additional Information', content: 'Weight: 0.5kg\nDimensions: 20 x 15 x 5 cm\nColor: Black, Silver' },
    { title: 'Reviews (12)', content: 'Customer reviews will be displayed here.' },
  ],
  layout = 'tabs' 
}: ProductDataTabsWidgetProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (layout === 'accordion') {
    return (
      <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
        {tabs.map((tab, index) => (
          <div key={index}>
            <button
              className="w-full px-4 py-3 text-left font-medium bg-gray-50 hover:bg-gray-100 flex justify-between items-center"
              onClick={() => setActiveTab(activeTab === index ? -1 : index)}
            >
              {tab.title}
              <span className="text-gray-500">{activeTab === index ? '−' : '+'}</span>
            </button>
            {activeTab === index && (
              <div className="p-4 text-gray-600 text-sm whitespace-pre-line">
                {tab.content}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-4">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === index 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="p-4 bg-gray-50 rounded-lg text-gray-600 text-sm whitespace-pre-line">
        {tabs[activeTab].content}
      </div>
    </div>
  );
}
