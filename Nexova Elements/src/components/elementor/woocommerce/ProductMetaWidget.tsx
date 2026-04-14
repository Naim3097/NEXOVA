import React from 'react';

interface MetaItem {
  label: string;
  value: string;
}

interface ProductMetaWidgetProps {
  items?: MetaItem[];
  align?: 'left' | 'center' | 'right';
  layout?: 'inline' | 'table' | 'stacked';
}

export default function ProductMetaWidget({ 
  items = [
    { label: 'SKU:', value: 'WH-1000XM4' },
    { label: 'Category:', value: 'Electronics, Audio' },
    { label: 'Tags:', value: 'Wireless, Noise Cancelling' },
  ],
  align = 'left', 
  layout = 'inline' 
}: ProductMetaWidgetProps) {
  return (
    <div 
      className={`text-sm text-gray-600 ${layout === 'stacked' ? 'flex flex-col gap-2' : layout === 'table' ? '' : 'flex flex-wrap gap-4'}`}
      style={{ 
        textAlign: align,
        justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'
      }}
    >
      {layout === 'table' ? (
        <table className="w-full">
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-gray-100 last:border-0">
                <td className="py-2 font-medium w-24">{item.label}</td>
                <td className="py-2">{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        items.map((item, i) => (
          <div key={i} className={layout === 'inline' ? 'flex gap-1' : ''}>
            <span className="font-medium text-gray-900">{item.label}</span>
            <span>{item.value}</span>
          </div>
        ))
      )}
    </div>
  );
}
