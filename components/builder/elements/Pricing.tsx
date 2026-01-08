import React from 'react';
import { PricingProps } from '@/types';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PricingElementProps {
  props: PricingProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

export const PricingElement = React.memo(
  ({ props, isSelected, isHovered, onSelect, onHover }: PricingElementProps) => {
    const {
      title,
      subtitle,
      plans,
      layout,
      backgroundImage,
      backgroundOpacity = 70,
      bgColor = '#000000',
      enablePaymentIntegration = false
    } = props;

    const baseClasses = `relative transition-all ${
      isSelected ? 'ring-4 ring-blue-500' : ''
    } ${isHovered ? 'ring-2 ring-blue-300' : ''}`;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.();
    };

    const handleMouseEnter = () => onHover?.(true);
    const handleMouseLeave = () => onHover?.(false);

    return (
      <section
        className={`${baseClasses} py-20 px-4 bg-gray-50 cursor-pointer overflow-hidden`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Image */}
        {backgroundImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${backgroundImage}")` }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: bgColor,
                opacity: backgroundOpacity / 100,
              }}
            />
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{title}</h2>
            {subtitle && (
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
            )}
          </div>

          {/* Pricing Cards */}
          {layout === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {plans.map((plan, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col ${
                    plan.highlighted
                      ? 'ring-2 ring-blue-500 transform scale-105'
                      : ''
                  }`}
                >
                  {plan.highlighted && (
                    <div className="bg-blue-500 text-white text-sm font-semibold px-3 py-1 rounded-full self-start mb-4">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.currency} {plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">/ {plan.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    className="w-full"
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Pricing Table */}
          {layout === 'table' && (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Plan
                    </th>
                    {plans.map((plan, index) => (
                      <th
                        key={index}
                        className={`px-6 py-4 text-center text-sm font-semibold ${
                          plan.highlighted
                            ? 'bg-blue-50 text-blue-900'
                            : 'text-gray-900'
                        }`}
                      >
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      Price
                    </td>
                    {plans.map((plan, index) => (
                      <td
                        key={index}
                        className={`px-6 py-4 text-center ${
                          plan.highlighted ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="text-2xl font-bold text-gray-900">
                          {plan.currency} {plan.price}
                        </div>
                        <div className="text-sm text-gray-600">/ {plan.period}</div>
                      </td>
                    ))}
                  </tr>
                  {/* Features rows - showing first 5 features */}
                  {Array.from({
                    length: Math.max(...plans.map((p) => p.features.length)),
                  }).map((_, featureIndex) => (
                    <tr key={featureIndex}>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {plans[0]?.features[featureIndex] || ''}
                      </td>
                      {plans.map((plan, planIndex) => (
                        <td
                          key={planIndex}
                          className={`px-6 py-4 text-center ${
                            plan.highlighted ? 'bg-blue-50' : ''
                          }`}
                        >
                          {plan.features[featureIndex] && (
                            <Check className="w-5 h-5 text-green-500 mx-auto" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td className="px-6 py-4"></td>
                    {plans.map((plan, index) => (
                      <td
                        key={index}
                        className={`px-6 py-4 text-center ${
                          plan.highlighted ? 'bg-blue-50' : ''
                        }`}
                      >
                        <Button
                          size="sm"
                          variant={plan.highlighted ? 'default' : 'outline'}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {plan.buttonText}
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Payment Integration Indicator (Builder Only) */}
          {enablePaymentIntegration && (
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
              <p className="text-sm text-blue-900 font-medium text-center">
                💳 LeanX Payment Integration Enabled
              </p>
              <p className="text-xs text-blue-700 text-center mt-1">
                On published pages, these buttons will process secure payments via LeanX Gateway
              </p>
            </div>
          )}
        </div>
      </section>
    );
  }
);

PricingElement.displayName = 'PricingElement';
