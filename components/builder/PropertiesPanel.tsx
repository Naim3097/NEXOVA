'use client';

import React, { useState } from 'react';
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import {
  selectedElementAtom,
  updateElementAtom,
  deleteElementAtom,
  duplicateElementAtom,
  currentProjectAtom,
  rightSidebarOpenAtom,
  elementsAtom,
} from '@/store/builder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/ui/image-upload';
import { Trash2, Copy, Plus, ChevronDown, ChevronRight, X } from 'lucide-react';
import ProductSelector from '@/components/builder/ProductSelector';

// Array Item Editor Component
interface ArrayItemEditorProps {
  item: any;
  index: number;
  schema: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select';
    options?: { value: string; label: string }[];
  }[];
  onUpdate: (index: number, updatedItem: any) => void;
  onRemove: (index: number) => void;
}

const ArrayItemEditor: React.FC<ArrayItemEditorProps> = ({
  item,
  index,
  schema,
  onUpdate,
  onRemove,
}) => {
  const [isExpanded, setIsExpanded] = useState(index === 0);

  const handleFieldChange = (key: string, value: any) => {
    onUpdate(index, { ...item, [key]: value });
  };

  return (
    <div className="border border-gray-200 rounded-lg mb-3">
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-500" />
          )}
          <span className="text-sm font-medium text-gray-700">
            Item {index + 1}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(index);
          }}
          className="text-red-500 hover:text-red-700 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 pt-0 space-y-3 border-t border-gray-200">
          {schema.map((field) => (
            <div key={field.key}>
              <Label className="text-xs">{field.label}</Label>
              {field.type === 'textarea' ? (
                <textarea
                  value={item[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                  rows={3}
                />
              ) : field.type === 'select' ? (
                <select
                  value={item[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  type={field.type}
                  value={item[field.key] || ''}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                  className="mt-1"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Array Editor Component
interface ArrayEditorProps {
  title: string;
  items: any[];
  schema: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select';
    options?: { value: string; label: string }[];
  }[];
  defaultItem: any;
  onChange: (items: any[]) => void;
}

const ArrayEditor: React.FC<ArrayEditorProps> = ({
  title,
  items,
  schema,
  defaultItem,
  onChange,
}) => {
  const handleAddItem = () => {
    onChange([...items, { ...defaultItem }]);
  };

  const handleUpdateItem = (index: number, updatedItem: any) => {
    const newItems = [...items];
    newItems[index] = updatedItem;
    onChange(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <Label className="text-sm font-semibold">{title}</Label>
        <Button
          size="sm"
          variant="outline"
          onClick={handleAddItem}
          className="h-7 text-xs"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="text-xs text-gray-500 text-center py-4">
            No items. Click "Add" to create one.
          </p>
        ) : (
          items.map((item, index) => (
            <ArrayItemEditor
              key={index}
              item={item}
              index={index}
              schema={schema}
              onUpdate={handleUpdateItem}
              onRemove={handleRemoveItem}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Icon options for Features section
const iconOptions = [
  { value: 'check-circle', label: '✓ Check Circle' },
  { value: 'star', label: '★ Star' },
  { value: 'zap', label: '⚡ Lightning Bolt' },
  { value: 'shield', label: '🛡️ Shield' },
  { value: 'heart', label: '♥ Heart' },
  { value: 'award', label: '🏆 Award' },
  { value: 'sparkles', label: '✨ Sparkles' },
  { value: 'rocket', label: '🚀 Rocket' },
  { value: 'target', label: '🎯 Target' },
  { value: 'trending-up', label: '📈 Trending Up' },
  { value: 'clock', label: '⏰ Clock' },
  { value: 'users', label: '👥 Users' },
  { value: 'globe', label: '🌐 Globe' },
  { value: 'lock', label: '🔒 Lock' },
  { value: 'settings', label: '⚙️ Settings' },
  { value: 'dollar-sign', label: '💵 Dollar Sign' },
  { value: 'gift', label: '🎁 Gift' },
  { value: 'thumbs-up', label: '👍 Thumbs Up' },
  { value: 'lightbulb', label: '💡 Light Bulb' },
  { value: 'smartphone', label: '📱 Smartphone' },
];

export const PropertiesPanel = () => {
  const selectedElement = useAtomValue(selectedElementAtom);
  const currentProject = useAtomValue(currentProjectAtom);
  const [isOpen, setIsOpen] = useAtom(rightSidebarOpenAtom);
  const updateElement = useSetAtom(updateElementAtom);
  const deleteElement = useSetAtom(deleteElementAtom);
  const duplicateElement = useSetAtom(duplicateElementAtom);
  const allElements = useAtomValue(elementsAtom);

  if (!isOpen && !selectedElement) {
    return null;
  }

  if (!selectedElement) {
    return (
      <div className="w-80 bg-white border-l border-gray-200 flex items-center justify-center p-8 md:relative absolute md:z-0 z-20 right-0 top-0 shadow-xl md:shadow-none">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Element Selected
          </h3>
          <p className="text-sm text-gray-600">
            Click on an element in the canvas to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    updateElement({
      id: selectedElement.id,
      props: {
        ...selectedElement.props,
        [key]: value,
      },
    });
  };

  // Handle multiple prop changes at once to avoid stale state issues
  const handleMultiPropChange = (changes: Record<string, any>) => {
    updateElement({
      id: selectedElement.id,
      props: {
        ...selectedElement.props,
        ...changes,
      },
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this element?')) {
      deleteElement(selectedElement.id);
    }
  };

  const handleDuplicate = () => {
    duplicateElement(selectedElement.id);
  };

  const renderPropsEditor = () => {
    const { type, props } = selectedElement;

    // Common props for all elements
    const commonSection = (
      <div className="space-y-4 pb-6 border-b border-gray-200">
        <div>
          <Label className="text-xs font-semibold text-gray-500 uppercase">
            Element Type
          </Label>
          <p className="mt-1 text-sm font-medium text-gray-900 capitalize">
            {type}
          </p>
        </div>
      </div>
    );

    switch (type) {
      case 'hero':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div>
                <Label htmlFor="variant">Variant</Label>
                <select
                  id="variant"
                  value={props.variant || 'centered'}
                  onChange={(e) => handlePropChange('variant', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="centered">Centered</option>
                  <option value="image_left">Image Left</option>
                  <option value="image_bg">Image Background</option>
                </select>
              </div>

              <div>
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={props.headline || ''}
                  onChange={(e) => handlePropChange('headline', e.target.value)}
                  placeholder="Enter headline"
                />
              </div>

              <div>
                <Label htmlFor="subheadline">Subheadline</Label>
                <Input
                  id="subheadline"
                  value={props.subheadline || ''}
                  onChange={(e) =>
                    handlePropChange('subheadline', e.target.value)
                  }
                  placeholder="Enter subheadline"
                />
              </div>

              {/* CTA Button Toggle */}
              <div className="flex items-center justify-between py-2">
                <Label htmlFor="showCtaButton" className="cursor-pointer">
                  Show CTA Button
                </Label>
                <button
                  id="showCtaButton"
                  type="button"
                  role="switch"
                  aria-checked={props.showCtaButton !== false}
                  onClick={() =>
                    handlePropChange(
                      'showCtaButton',
                      props.showCtaButton === false ? true : false
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    props.showCtaButton !== false
                      ? 'bg-blue-600'
                      : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      props.showCtaButton !== false
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {props.showCtaButton !== false && (
                <div>
                  <Label htmlFor="ctaText">Button Text</Label>
                  <Input
                    id="ctaText"
                    value={props.ctaText || ''}
                    onChange={(e) =>
                      handlePropChange('ctaText', e.target.value)
                    }
                    placeholder="Enter button text"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="bgColor"
                    type="color"
                    value={props.bgColor || '#f9fafb'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.bgColor || '#f9fafb'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    placeholder="#f9fafb"
                    className="flex-1"
                  />
                </div>
              </div>

              {currentProject && (
                <div>
                  <Label>
                    {props.variant === 'centered'
                      ? 'Hero Icon/Image (optional)'
                      : props.variant === 'image_bg'
                        ? 'Background Image'
                        : 'Hero Image'}
                  </Label>
                  <ImageUpload
                    value={props.image || ''}
                    onChange={(url) => handlePropChange('image', url)}
                    userId={currentProject.user_id}
                    maxSizeMB={5}
                  />
                  {props.variant === 'centered' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Optional small icon displayed above headline
                    </p>
                  )}
                  {props.variant === 'image_bg' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Full-width background image with overlay
                    </p>
                  )}
                </div>
              )}

              {/* Image Opacity Control - Only for image_bg variant */}
              {props.variant === 'image_bg' && (
                <div>
                  <Label htmlFor="imageOpacity">
                    Overlay Opacity ({props.imageOpacity || 70}%)
                  </Label>
                  <input
                    id="imageOpacity"
                    type="range"
                    min="0"
                    max="100"
                    value={props.imageOpacity || 70}
                    onChange={(e) =>
                      handlePropChange('imageOpacity', parseInt(e.target.value))
                    }
                    className="w-full mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Adjust the darkness of the overlay on the background image
                  </p>
                </div>
              )}

              {/* Text Styling Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Text Styling
                </h4>

                {/* Headline Color */}
                <div className="mb-4">
                  <Label htmlFor="headlineColor">Headline Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="headlineColor"
                      type="color"
                      value={props.headlineColor || '#111827'}
                      onChange={(e) =>
                        handlePropChange('headlineColor', e.target.value)
                      }
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={props.headlineColor || '#111827'}
                      onChange={(e) =>
                        handlePropChange('headlineColor', e.target.value)
                      }
                      placeholder="#111827"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Headline Size */}
                <div className="mb-4">
                  <Label htmlFor="headlineSize">Headline Size</Label>
                  <select
                    id="headlineSize"
                    value={props.headlineSize || '5xl'}
                    onChange={(e) =>
                      handlePropChange('headlineSize', e.target.value)
                    }
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  >
                    <option value="3xl">Small (3xl)</option>
                    <option value="4xl">Medium (4xl)</option>
                    <option value="5xl">Large (5xl)</option>
                    <option value="6xl">Extra Large (6xl)</option>
                    <option value="7xl">Huge (7xl)</option>
                  </select>
                </div>

                {/* Subheadline Color */}
                <div className="mb-4">
                  <Label htmlFor="subheadlineColor">Subheadline Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="subheadlineColor"
                      type="color"
                      value={props.subheadlineColor || '#4b5563'}
                      onChange={(e) =>
                        handlePropChange('subheadlineColor', e.target.value)
                      }
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={props.subheadlineColor || '#4b5563'}
                      onChange={(e) =>
                        handlePropChange('subheadlineColor', e.target.value)
                      }
                      placeholder="#4b5563"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Subheadline Size */}
                <div>
                  <Label htmlFor="subheadlineSize">Subheadline Size</Label>
                  <select
                    id="subheadlineSize"
                    value={props.subheadlineSize || 'xl'}
                    onChange={(e) =>
                      handlePropChange('subheadlineSize', e.target.value)
                    }
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                  >
                    <option value="base">Small (base)</option>
                    <option value="lg">Medium (lg)</option>
                    <option value="xl">Large (xl)</option>
                    <option value="2xl">Extra Large (2xl)</option>
                    <option value="3xl">Huge (3xl)</option>
                  </select>
                </div>
              </div>

              {/* Button Styling Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Button Styling
                </h4>

                {/* Button Background Color */}
                <div className="mb-4">
                  <Label htmlFor="buttonBgColor">Button Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="buttonBgColor"
                      type="color"
                      value={props.buttonBgColor || '#2563eb'}
                      onChange={(e) =>
                        handlePropChange('buttonBgColor', e.target.value)
                      }
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={props.buttonBgColor || '#2563eb'}
                      onChange={(e) =>
                        handlePropChange('buttonBgColor', e.target.value)
                      }
                      placeholder="#2563eb"
                      className="flex-1"
                    />
                  </div>
                </div>

                {/* Button Text Color */}
                <div>
                  <Label htmlFor="buttonTextColor">Button Text Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="buttonTextColor"
                      type="color"
                      value={props.buttonTextColor || '#ffffff'}
                      onChange={(e) =>
                        handlePropChange('buttonTextColor', e.target.value)
                      }
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={props.buttonTextColor || '#ffffff'}
                      onChange={(e) =>
                        handlePropChange('buttonTextColor', e.target.value)
                      }
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'features':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div>
                <Label htmlFor="variant">Variant</Label>
                <select
                  id="variant"
                  value={props.variant || 'grid'}
                  onChange={(e) => handlePropChange('variant', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="grid">Grid</option>
                  <option value="list">List</option>
                  <option value="alternating">Alternating</option>
                </select>
              </div>

              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={props.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  placeholder="Enter title"
                />
              </div>

              <ArrayEditor
                title="Features"
                items={props.features || []}
                schema={[
                  {
                    key: 'icon',
                    label: 'Icon',
                    type: 'select',
                    options: iconOptions,
                  },
                  { key: 'title', label: 'Feature Title', type: 'text' },
                  {
                    key: 'description',
                    label: 'Description',
                    type: 'textarea',
                  },
                ]}
                defaultItem={{
                  icon: 'check-circle',
                  title: 'New Feature',
                  description: 'Describe this feature',
                }}
                onChange={(features) => handlePropChange('features', features)}
              />

              {/* Background Image Section */}
              {currentProject && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Background Image
                  </h4>
                  <Label>Background Image (optional)</Label>
                  <ImageUpload
                    value={props.backgroundImage || ''}
                    onChange={(url) => handlePropChange('backgroundImage', url)}
                    userId={currentProject.user_id}
                    maxSizeMB={5}
                  />
                  {props.backgroundImage && (
                    <>
                      <div className="mt-4">
                        <Label htmlFor="backgroundOpacity">
                          Overlay Opacity ({props.backgroundOpacity || 70}%)
                        </Label>
                        <input
                          id="backgroundOpacity"
                          type="range"
                          min="0"
                          max="100"
                          value={props.backgroundOpacity || 70}
                          onChange={(e) =>
                            handlePropChange(
                              'backgroundOpacity',
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full mt-2"
                        />
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="bgColor">Overlay Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="bgColor"
                            type="color"
                            value={props.bgColor || '#000000'}
                            onChange={(e) =>
                              handlePropChange('bgColor', e.target.value)
                            }
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={props.bgColor || '#000000'}
                            onChange={(e) =>
                              handlePropChange('bgColor', e.target.value)
                            }
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        );

      case 'testimonials':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div>
                <Label htmlFor="variant">Variant</Label>
                <select
                  id="variant"
                  value={props.variant || 'grid'}
                  onChange={(e) => handlePropChange('variant', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="grid">Grid</option>
                  <option value="slider">Slider</option>
                  <option value="masonry">Masonry</option>
                </select>
              </div>

              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={props.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  placeholder="Enter title"
                />
              </div>

              <ArrayEditor
                title="Testimonials"
                items={props.testimonials || []}
                schema={[
                  { key: 'name', label: 'Name', type: 'text' },
                  { key: 'role', label: 'Role/Title', type: 'text' },
                  { key: 'quote', label: 'Quote', type: 'textarea' },
                  { key: 'rating', label: 'Rating (1-5)', type: 'number' },
                ]}
                defaultItem={{
                  name: 'Customer Name',
                  role: 'Position, Company',
                  quote: 'This is an amazing product!',
                  rating: 5,
                  avatar: '',
                }}
                onChange={(testimonials) =>
                  handlePropChange('testimonials', testimonials)
                }
              />

              {/* Background Image Section */}
              {currentProject && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Background Image
                  </h4>
                  <Label>Background Image (optional)</Label>
                  <ImageUpload
                    value={props.backgroundImage || ''}
                    onChange={(url) => handlePropChange('backgroundImage', url)}
                    userId={currentProject.user_id}
                    maxSizeMB={5}
                  />
                  {props.backgroundImage && (
                    <>
                      <div className="mt-4">
                        <Label htmlFor="backgroundOpacity">
                          Overlay Opacity ({props.backgroundOpacity || 70}%)
                        </Label>
                        <input
                          id="backgroundOpacity"
                          type="range"
                          min="0"
                          max="100"
                          value={props.backgroundOpacity || 70}
                          onChange={(e) =>
                            handlePropChange(
                              'backgroundOpacity',
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full mt-2"
                        />
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="bgColor">Overlay Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="bgColor"
                            type="color"
                            value={props.bgColor || '#000000'}
                            onChange={(e) =>
                              handlePropChange('bgColor', e.target.value)
                            }
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={props.bgColor || '#000000'}
                            onChange={(e) =>
                              handlePropChange('bgColor', e.target.value)
                            }
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        );

      case 'faq':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div>
                <Label htmlFor="variant">Variant</Label>
                <select
                  id="variant"
                  value={props.variant || 'single_column'}
                  onChange={(e) => handlePropChange('variant', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="single_column">Single Column</option>
                  <option value="two_column">Two Columns</option>
                </select>
              </div>

              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={props.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  placeholder="Enter title"
                />
              </div>

              <ArrayEditor
                title="FAQ Questions"
                items={props.questions || []}
                schema={[
                  { key: 'question', label: 'Question', type: 'text' },
                  { key: 'answer', label: 'Answer', type: 'textarea' },
                ]}
                defaultItem={{
                  question: 'Your question here?',
                  answer: 'The answer to your question.',
                }}
                onChange={(questions) =>
                  handlePropChange('questions', questions)
                }
              />

              {/* Background Image Section */}
              {currentProject && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Background Image
                  </h4>
                  <Label>Background Image (optional)</Label>
                  <ImageUpload
                    value={props.backgroundImage || ''}
                    onChange={(url) => handlePropChange('backgroundImage', url)}
                    userId={currentProject.user_id}
                    maxSizeMB={5}
                  />
                  {props.backgroundImage && (
                    <>
                      <div className="mt-4">
                        <Label htmlFor="backgroundOpacity">
                          Overlay Opacity ({props.backgroundOpacity || 70}%)
                        </Label>
                        <input
                          id="backgroundOpacity"
                          type="range"
                          min="0"
                          max="100"
                          value={props.backgroundOpacity || 70}
                          onChange={(e) =>
                            handlePropChange(
                              'backgroundOpacity',
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full mt-2"
                        />
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="bgColor">Overlay Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="bgColor"
                            type="color"
                            value={props.bgColor || '#000000'}
                            onChange={(e) =>
                              handlePropChange('bgColor', e.target.value)
                            }
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={props.bgColor || '#000000'}
                            onChange={(e) =>
                              handlePropChange('bgColor', e.target.value)
                            }
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        );

      case 'cta':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div>
                <Label htmlFor="variant">Variant</Label>
                <select
                  id="variant"
                  value={props.variant || 'centered'}
                  onChange={(e) => handlePropChange('variant', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="centered">Centered</option>
                  <option value="split">Split</option>
                  <option value="banner">Banner</option>
                </select>
              </div>

              <div>
                <Label htmlFor="headline">Headline</Label>
                <Input
                  id="headline"
                  value={props.headline || ''}
                  onChange={(e) => handlePropChange('headline', e.target.value)}
                  placeholder="Enter headline"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={props.description || ''}
                  onChange={(e) =>
                    handlePropChange('description', e.target.value)
                  }
                  placeholder="Enter description"
                />
              </div>

              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={props.buttonText || ''}
                  onChange={(e) =>
                    handlePropChange('buttonText', e.target.value)
                  }
                  placeholder="Enter button text"
                />
              </div>

              {/* Button Customization Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Button Customization
                </h4>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="buttonLinkType">Button Link Type</Label>
                    <select
                      id="buttonLinkType"
                      value={props.buttonLinkType || 'section'}
                      onChange={(e) => {
                        handlePropChange('buttonLinkType', e.target.value);
                        // Reset buttonUrl when switching types
                        if (e.target.value === 'section') {
                          handlePropChange('buttonUrl', '#');
                        } else {
                          handlePropChange('buttonUrl', 'https://');
                        }
                      }}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="section">Scroll to Section</option>
                      <option value="external">External Link</option>
                    </select>
                  </div>

                  {(props.buttonLinkType || 'section') === 'section' ? (
                    <div>
                      <Label htmlFor="buttonUrl">Scroll to Section</Label>
                      <select
                        id="buttonUrl"
                        value={props.buttonUrl || '#'}
                        onChange={(e) =>
                          handlePropChange('buttonUrl', e.target.value)
                        }
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="#">Top of Page</option>
                        <option value="#booking">Booking Form</option>
                        <option value="#services">Services / Features</option>
                        <option value="#testimonials">Testimonials</option>
                        <option value="#faq">FAQ</option>
                        <option value="#pricing">Pricing</option>
                        <option value="#contact">Contact / Lead Form</option>
                        {allElements
                          .filter(
                            (el) =>
                              el.type !== 'announcement_bar' &&
                              el.type !== 'navigation'
                          )
                          .map((el) => (
                            <option
                              key={el.id}
                              value={`#${el.type}-${el.order}`}
                            >
                              {el.type.charAt(0).toUpperCase() +
                                el.type.slice(1).replace('_', ' ')}{' '}
                              (Position {el.order + 1})
                            </option>
                          ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Select a section to scroll to when clicked
                      </p>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="buttonUrl">External URL</Label>
                      <Input
                        id="buttonUrl"
                        value={props.buttonUrl || 'https://'}
                        onChange={(e) =>
                          handlePropChange('buttonUrl', e.target.value)
                        }
                        placeholder="https://example.com"
                        className="mt-1"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter the full URL including https://
                      </p>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="buttonColor">Button Background Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="buttonColor"
                        type="color"
                        value={props.buttonColor || '#ffffff'}
                        onChange={(e) =>
                          handlePropChange('buttonColor', e.target.value)
                        }
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        value={props.buttonColor || '#ffffff'}
                        onChange={(e) =>
                          handlePropChange('buttonColor', e.target.value)
                        }
                        placeholder="#ffffff"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="buttonTextColor">Button Text Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="buttonTextColor"
                        type="color"
                        value={props.buttonTextColor || '#111827'}
                        onChange={(e) =>
                          handlePropChange('buttonTextColor', e.target.value)
                        }
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        value={props.buttonTextColor || '#111827'}
                        onChange={(e) =>
                          handlePropChange('buttonTextColor', e.target.value)
                        }
                        placeholder="#111827"
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="buttonSize">Button Size</Label>
                    <select
                      id="buttonSize"
                      value={props.buttonSize || 'lg'}
                      onChange={(e) =>
                        handlePropChange('buttonSize', e.target.value)
                      }
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="sm">Small</option>
                      <option value="md">Medium</option>
                      <option value="lg">Large</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="buttonFontSize">Button Font Size</Label>
                    <select
                      id="buttonFontSize"
                      value={props.buttonFontSize || '1.125rem'}
                      onChange={(e) =>
                        handlePropChange('buttonFontSize', e.target.value)
                      }
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                    >
                      <option value="0.875rem">Small (14px)</option>
                      <option value="1rem">Normal (16px)</option>
                      <option value="1.125rem">Medium (18px)</option>
                      <option value="1.25rem">Large (20px)</option>
                      <option value="1.5rem">Extra Large (24px)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Background Color/Gradient Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">
                  Background Style
                </h4>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bgType">Background Type</Label>
                    <select
                      id="bgType"
                      value={props.bgType || 'gradient'}
                      onChange={(e) => {
                        handlePropChange('bgType', e.target.value);
                        // Set default values based on type
                        if (e.target.value === 'solid') {
                          handlePropChange(
                            'bgColor',
                            props.bgColor || '#667eea'
                          );
                        } else {
                          handlePropChange(
                            'bgGradient',
                            props.bgGradient ||
                              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                          );
                        }
                      }}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="gradient">Gradient</option>
                      <option value="solid">Solid Color</option>
                    </select>
                  </div>

                  {(props.bgType || 'gradient') === 'solid' ? (
                    <div>
                      <Label htmlFor="bgColor">Background Color</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="bgColor"
                          type="color"
                          value={props.bgColor || '#667eea'}
                          onChange={(e) =>
                            handlePropChange('bgColor', e.target.value)
                          }
                          className="w-20 h-10 p-1"
                        />
                        <Input
                          value={props.bgColor || '#667eea'}
                          onChange={(e) =>
                            handlePropChange('bgColor', e.target.value)
                          }
                          placeholder="#667eea"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <Label>Gradient Colors</Label>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              Start Color
                            </p>
                            <div className="flex gap-1">
                              <Input
                                type="color"
                                value={props.gradientStart || '#667eea'}
                                onChange={(e) => {
                                  const newStart = e.target.value;
                                  const endColor =
                                    props.gradientEnd || '#764ba2';
                                  const direction =
                                    props.gradientDirection || '135deg';
                                  handleMultiPropChange({
                                    gradientStart: newStart,
                                    bgGradient: `linear-gradient(${direction}, ${newStart} 0%, ${endColor} 100%)`,
                                  });
                                }}
                                className="w-10 h-8 p-1"
                              />
                              <Input
                                value={props.gradientStart || '#667eea'}
                                onChange={(e) => {
                                  const newStart = e.target.value;
                                  const endColor =
                                    props.gradientEnd || '#764ba2';
                                  const direction =
                                    props.gradientDirection || '135deg';
                                  handleMultiPropChange({
                                    gradientStart: newStart,
                                    bgGradient: `linear-gradient(${direction}, ${newStart} 0%, ${endColor} 100%)`,
                                  });
                                }}
                                className="flex-1 text-xs"
                                placeholder="#667eea"
                              />
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              End Color
                            </p>
                            <div className="flex gap-1">
                              <Input
                                type="color"
                                value={props.gradientEnd || '#764ba2'}
                                onChange={(e) => {
                                  const startColor =
                                    props.gradientStart || '#667eea';
                                  const newEnd = e.target.value;
                                  const direction =
                                    props.gradientDirection || '135deg';
                                  handleMultiPropChange({
                                    gradientEnd: newEnd,
                                    bgGradient: `linear-gradient(${direction}, ${startColor} 0%, ${newEnd} 100%)`,
                                  });
                                }}
                                className="w-10 h-8 p-1"
                              />
                              <Input
                                value={props.gradientEnd || '#764ba2'}
                                onChange={(e) => {
                                  const startColor =
                                    props.gradientStart || '#667eea';
                                  const newEnd = e.target.value;
                                  const direction =
                                    props.gradientDirection || '135deg';
                                  handleMultiPropChange({
                                    gradientEnd: newEnd,
                                    bgGradient: `linear-gradient(${direction}, ${startColor} 0%, ${newEnd} 100%)`,
                                  });
                                }}
                                className="flex-1 text-xs"
                                placeholder="#764ba2"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="gradientDirection">
                          Gradient Direction
                        </Label>
                        <select
                          id="gradientDirection"
                          value={props.gradientDirection || '135deg'}
                          onChange={(e) => {
                            const newDirection = e.target.value;
                            const startColor = props.gradientStart || '#667eea';
                            const endColor = props.gradientEnd || '#764ba2';
                            handleMultiPropChange({
                              gradientDirection: newDirection,
                              bgGradient: `linear-gradient(${newDirection}, ${startColor} 0%, ${endColor} 100%)`,
                            });
                          }}
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="to right">Left to Right</option>
                          <option value="to left">Right to Left</option>
                          <option value="to bottom">Top to Bottom</option>
                          <option value="to top">Bottom to Top</option>
                          <option value="135deg">
                            Diagonal (Top-Left to Bottom-Right)
                          </option>
                          <option value="45deg">
                            Diagonal (Bottom-Left to Top-Right)
                          </option>
                          <option value="225deg">
                            Diagonal (Bottom-Right to Top-Left)
                          </option>
                          <option value="315deg">
                            Diagonal (Top-Right to Bottom-Left)
                          </option>
                        </select>
                      </div>

                      {/* Preset Gradients */}
                      <div>
                        <Label>Preset Gradients</Label>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {[
                            {
                              start: '#667eea',
                              end: '#764ba2',
                              name: 'Purple',
                            },
                            { start: '#f093fb', end: '#f5576c', name: 'Pink' },
                            { start: '#4facfe', end: '#00f2fe', name: 'Blue' },
                            { start: '#43e97b', end: '#38f9d7', name: 'Green' },
                            {
                              start: '#fa709a',
                              end: '#fee140',
                              name: 'Sunset',
                            },
                            { start: '#30cfd0', end: '#330867', name: 'Ocean' },
                            { start: '#ff9a9e', end: '#fecfef', name: 'Peach' },
                            { start: '#a8edea', end: '#fed6e3', name: 'Soft' },
                          ].map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className="h-8 rounded border-2 border-transparent hover:border-gray-400 transition-colors"
                              style={{
                                background: `linear-gradient(135deg, ${preset.start} 0%, ${preset.end} 100%)`,
                              }}
                              title={preset.name}
                              onClick={() => {
                                const direction =
                                  props.gradientDirection || '135deg';
                                handleMultiPropChange({
                                  gradientStart: preset.start,
                                  gradientEnd: preset.end,
                                  bgGradient: `linear-gradient(${direction}, ${preset.start} 0%, ${preset.end} 100%)`,
                                });
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Background Image Section */}
              {currentProject && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Background Image (Optional)
                  </h4>
                  <p className="text-xs text-gray-500 mb-2">
                    Adding an image will overlay your background color/gradient
                  </p>
                  <ImageUpload
                    value={props.backgroundImage || ''}
                    onChange={(url) => handlePropChange('backgroundImage', url)}
                    userId={currentProject.user_id}
                    maxSizeMB={5}
                  />
                  {props.backgroundImage && (
                    <div className="mt-4">
                      <Label htmlFor="backgroundOpacity">
                        Overlay Opacity ({props.backgroundOpacity || 70}%)
                      </Label>
                      <input
                        id="backgroundOpacity"
                        type="range"
                        min="0"
                        max="100"
                        value={props.backgroundOpacity || 70}
                        onChange={(e) =>
                          handlePropChange(
                            'backgroundOpacity',
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        CTA sections use a black overlay by default
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        );

      case 'announcement_bar':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  value={props.message || ''}
                  onChange={(e) => handlePropChange('message', e.target.value)}
                  placeholder="Limited Time Offer - 25% Off All Products!"
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showCountdown"
                  checked={props.showCountdown || false}
                  onChange={(e) =>
                    handlePropChange('showCountdown', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="showCountdown" className="cursor-pointer">
                  Show Countdown Timer
                </Label>
              </div>

              {props.showCountdown && (
                <>
                  <div>
                    <Label htmlFor="countdownLabel">Countdown Label</Label>
                    <Input
                      id="countdownLabel"
                      value={props.countdownLabel || ''}
                      onChange={(e) =>
                        handlePropChange('countdownLabel', e.target.value)
                      }
                      placeholder="Ends in:"
                    />
                  </div>
                  <div>
                    <Label htmlFor="countdownEndDate">End Date</Label>
                    <Input
                      id="countdownEndDate"
                      type="date"
                      value={
                        props.countdownEndDate
                          ? new Date(props.countdownEndDate)
                              .toISOString()
                              .slice(0, 10)
                          : ''
                      }
                      onChange={(e) => {
                        const currentDate = props.countdownEndDate
                          ? new Date(props.countdownEndDate)
                          : new Date();
                        const [year, month, day] = e.target.value
                          .split('-')
                          .map(Number);
                        currentDate.setFullYear(year, month - 1, day);
                        handlePropChange(
                          'countdownEndDate',
                          currentDate.toISOString()
                        );
                      }}
                    />
                  </div>
                  <div>
                    <Label htmlFor="countdownEndTime">End Time</Label>
                    <Input
                      id="countdownEndTime"
                      type="time"
                      value={
                        props.countdownEndDate
                          ? new Date(props.countdownEndDate)
                              .toTimeString()
                              .slice(0, 5)
                          : ''
                      }
                      onChange={(e) => {
                        const currentDate = props.countdownEndDate
                          ? new Date(props.countdownEndDate)
                          : new Date();
                        const [hours, minutes] = e.target.value
                          .split(':')
                          .map(Number);
                        currentDate.setHours(hours, minutes, 0, 0);
                        handlePropChange(
                          'countdownEndDate',
                          currentDate.toISOString()
                        );
                      }}
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="bgColor"
                    type="color"
                    value={props.bgColor || '#ef4444'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.bgColor || '#ef4444'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    placeholder="#ef4444"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="textColor"
                    type="color"
                    value={props.textColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('textColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.textColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('textColor', e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isSticky"
                  checked={props.isSticky || false}
                  onChange={(e) =>
                    handlePropChange('isSticky', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="isSticky" className="cursor-pointer">
                  Sticky (stays at top when scrolling)
                </Label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showCloseButton"
                  checked={props.showCloseButton || false}
                  onChange={(e) =>
                    handlePropChange('showCloseButton', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="showCloseButton" className="cursor-pointer">
                  Show Close Button
                </Label>
              </div>
            </div>
          </>
        );

      case 'navigation':
        // Generate section options from all elements
        const sectionOptions = allElements
          .filter(
            (el) => el.type !== 'navigation' && el.type !== 'announcement_bar'
          )
          .map((el, index) => ({
            value: `#${el.type}-${el.order}`,
            label: `${el.type.charAt(0).toUpperCase() + el.type.slice(1).replace('_', ' ')} (Position ${el.order + 1})`,
          }));

        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div>
                <Label htmlFor="logoText">Brand Name</Label>
                <Input
                  id="logoText"
                  value={props.logoText || ''}
                  onChange={(e) => handlePropChange('logoText', e.target.value)}
                  placeholder="Your Brand"
                />
              </div>

              <div>
                <Label htmlFor="layout">Layout</Label>
                <select
                  id="layout"
                  value={props.layout || 'split'}
                  onChange={(e) => handlePropChange('layout', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="left">Left Aligned</option>
                  <option value="center">Center Aligned</option>
                  <option value="split">Split (Logo left, Menu center)</option>
                </select>
              </div>

              {/* Custom Menu Items Editor with Section Dropdown */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-semibold">Menu Items</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const newMenuItem = {
                        label: 'New Item',
                        url: sectionOptions[0]?.value || '#',
                      };
                      handlePropChange('menuItems', [
                        ...(props.menuItems || []),
                        newMenuItem,
                      ]);
                    }}
                    className="h-7 text-xs"
                    disabled={(props.menuItems?.length || 0) >= 3}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>
                {(props.menuItems?.length || 0) >= 3 && (
                  <p className="text-xs text-amber-600 mb-2">
                    Maximum 3 menu items allowed
                  </p>
                )}

                <div className="space-y-2">
                  {!props.menuItems || props.menuItems.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">
                      No menu items. Click "Add" to create one.
                    </p>
                  ) : (
                    props.menuItems.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Item {index + 1}
                          </span>
                          <button
                            onClick={() => {
                              const newMenuItems = props.menuItems.filter(
                                (_: any, i: number) => i !== index
                              );
                              handlePropChange('menuItems', newMenuItems);
                            }}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <Label className="text-xs">Label</Label>
                            <Input
                              value={item.label || ''}
                              onChange={(e) => {
                                const newMenuItems = [...props.menuItems];
                                newMenuItems[index] = {
                                  ...item,
                                  label: e.target.value,
                                };
                                handlePropChange('menuItems', newMenuItems);
                              }}
                              placeholder="Menu Label"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label className="text-xs">Link to Section</Label>
                            <select
                              value={item.url || '#'}
                              onChange={(e) => {
                                const newMenuItems = [...props.menuItems];
                                newMenuItems[index] = {
                                  ...item,
                                  url: e.target.value,
                                };
                                handlePropChange('menuItems', newMenuItems);
                              }}
                              className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="#">Top of Page</option>
                              {sectionOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="showCTA"
                    checked={props.ctaButton?.text ? true : false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handlePropChange('ctaButton', {
                          text: 'Get Started',
                          url: '#',
                        });
                      } else {
                        handlePropChange('ctaButton', null);
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <Label
                    htmlFor="showCTA"
                    className="cursor-pointer font-semibold"
                  >
                    Show CTA Button
                  </Label>
                </div>

                {props.ctaButton && (
                  <>
                    <div className="mb-3">
                      <Label htmlFor="ctaText">CTA Text</Label>
                      <Input
                        id="ctaText"
                        value={props.ctaButton.text || ''}
                        onChange={(e) =>
                          handlePropChange('ctaButton', {
                            ...props.ctaButton,
                            text: e.target.value,
                          })
                        }
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ctaUrl">Link to Section</Label>
                      <select
                        id="ctaUrl"
                        value={props.ctaButton.url || '#'}
                        onChange={(e) =>
                          handlePropChange('ctaButton', {
                            ...props.ctaButton,
                            url: e.target.value,
                          })
                        }
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="#">Top of Page</option>
                        {sectionOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="bgColor"
                    type="color"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="textColor"
                    type="color"
                    value={props.textColor || '#111827'}
                    onChange={(e) =>
                      handlePropChange('textColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.textColor || '#111827'}
                    onChange={(e) =>
                      handlePropChange('textColor', e.target.value)
                    }
                    placeholder="#111827"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isSticky"
                  checked={props.isSticky || false}
                  onChange={(e) =>
                    handlePropChange('isSticky', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="isSticky" className="cursor-pointer">
                  Sticky Navigation
                </Label>
              </div>
            </div>
          </>
        );

      case 'pricing':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={props.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  placeholder="Choose Your Plan"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={props.subtitle || ''}
                  onChange={(e) => handlePropChange('subtitle', e.target.value)}
                  placeholder="Select the perfect plan for your needs"
                />
              </div>

              <div>
                <Label htmlFor="layout">Layout</Label>
                <select
                  id="layout"
                  value={props.layout || 'cards'}
                  onChange={(e) => handlePropChange('layout', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="cards">Cards</option>
                  <option value="table">Table</option>
                </select>
              </div>

              {/* Payment Integration Toggle */}
              <div className="border border-gray-200 rounded-md p-3 bg-blue-50">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enablePaymentIntegration"
                    checked={props.enablePaymentIntegration || false}
                    onChange={(e) =>
                      handlePropChange(
                        'enablePaymentIntegration',
                        e.target.checked
                      )
                    }
                    className="w-4 h-4"
                  />
                  <Label
                    htmlFor="enablePaymentIntegration"
                    className="cursor-pointer font-semibold"
                  >
                    Enable LeanX Payment Gateway
                  </Label>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  When enabled, plan buttons will process payments via LeanX
                  instead of redirecting to URLs
                </p>
              </div>

              {/* Product Selector for Pricing Plans */}
              {currentProject && (
                <div className="border border-gray-300 rounded-md p-3 bg-blue-50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Add from Inventory
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Select products from your inventory to create pricing plans
                    or{' '}
                    <a
                      href="/dashboard/products"
                      target="_blank"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      manage products
                    </a>
                  </p>
                  <ProductSelector
                    onSelect={(product) => {
                      const newPlans = [
                        ...(props.plans || []),
                        {
                          name: product.name,
                          price: product.base_price.toString(),
                          currency: product.currency,
                          description: product.description || '',
                          features: product.description
                            ? product.description
                                .split('\n')
                                .filter((f: string) => f.trim())
                            : [],
                          buttonText: 'Buy Now',
                          buttonUrl: '#',
                          highlighted: false,
                          enablePayment:
                            props.enablePaymentIntegration || false,
                          productId: product.id,
                          priceNumeric: product.base_price,
                          stock: product.stock,
                        },
                      ];
                      handlePropChange('plans', newPlans);
                    }}
                  />
                </div>
              )}

              {/* Plans List (Read-only with remove option) */}
              {(props.plans || []).length > 0 && (
                <div className="border border-gray-300 rounded-md p-3 mt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Added Products/Plans
                  </h4>
                  <div className="space-y-3">
                    {(props.plans || []).map((plan: any, planIndex: number) => (
                      <div
                        key={planIndex}
                        className="border border-gray-200 rounded-md p-3 bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-semibold text-gray-900">
                            {plan.name}
                          </h5>
                          <button
                            type="button"
                            onClick={() => {
                              const newPlans = (props.plans || []).filter(
                                (_: any, i: number) => i !== planIndex
                              );
                              handlePropChange('plans', newPlans);
                            }}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <p>
                            <strong>Price:</strong> {plan.currency || 'RM'}{' '}
                            {plan.price || plan.priceNumeric}
                          </p>
                          {plan.description && (
                            <p>
                              <strong>Description:</strong> {plan.description}
                            </p>
                          )}
                          {plan.features && plan.features.length > 0 && (
                            <div>
                              <strong>Features:</strong>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {plan.features.map(
                                  (feature: string, idx: number) => (
                                    <li key={idx}>{feature}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    To edit product details, go to the{' '}
                    <a
                      href="/dashboard/products"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Products page
                    </a>
                  </p>
                </div>
              )}

              {/* Background Image Section */}
              {currentProject && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Background Image
                  </h4>
                  <Label>Background Image (optional)</Label>
                  <ImageUpload
                    value={props.backgroundImage || ''}
                    onChange={(url) => handlePropChange('backgroundImage', url)}
                    userId={currentProject.user_id}
                    maxSizeMB={5}
                  />
                  {props.backgroundImage && (
                    <>
                      <div className="mt-4">
                        <Label htmlFor="backgroundOpacity">
                          Overlay Opacity ({props.backgroundOpacity || 70}%)
                        </Label>
                        <input
                          id="backgroundOpacity"
                          type="range"
                          min="0"
                          max="100"
                          value={props.backgroundOpacity || 70}
                          onChange={(e) =>
                            handlePropChange(
                              'backgroundOpacity',
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full mt-2"
                        />
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="bgColor">Overlay Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="bgColor"
                            type="color"
                            value={props.bgColor || '#000000'}
                            onChange={(e) =>
                              handlePropChange('bgColor', e.target.value)
                            }
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={props.bgColor || '#000000'}
                            onChange={(e) =>
                              handlePropChange('bgColor', e.target.value)
                            }
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Bump Offer Section - Only available with payment integration and 2+ plans */}
              {props.enablePaymentIntegration && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="font-semibold text-sm text-gray-700 mb-2">
                    Bump Offer (Upsell)
                  </div>

                  {(props.plans || []).length < 2 ? (
                    <div className="p-3 bg-gray-100 border border-gray-200 rounded-md">
                      <p className="text-sm text-gray-600">
                        Add at least 2 plans to enable bump offer functionality.
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Current plans: {(props.plans || []).length}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="enableBumpOffer-pricing"
                          checked={props.enableBumpOffer || false}
                          onChange={(e) => {
                            handlePropChange(
                              'enableBumpOffer',
                              e.target.checked
                            );
                            if (!e.target.checked) {
                              handlePropChange('bumpOfferPlanIndex', null);
                              handlePropChange('bumpOfferDiscount', 0);
                              handlePropChange('bumpOfferDescription', '');
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <Label
                          htmlFor="enableBumpOffer-pricing"
                          className="cursor-pointer"
                        >
                          Enable Bump Offer
                        </Label>
                      </div>

                      {props.enableBumpOffer && (
                        <div className="space-y-3 border border-yellow-200 rounded-md p-3 bg-yellow-50 mt-3">
                          <div>
                            <Label htmlFor="bumpOfferPlanIndex">
                              Select Bump Offer Plan
                            </Label>
                            <select
                              id="bumpOfferPlanIndex"
                              value={props.bumpOfferPlanIndex ?? ''}
                              onChange={(e) =>
                                handlePropChange(
                                  'bumpOfferPlanIndex',
                                  e.target.value === ''
                                    ? null
                                    : parseInt(e.target.value)
                                )
                              }
                              className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="">-- Select a plan --</option>
                              {(props.plans || []).map(
                                (plan: any, idx: number) => (
                                  <option key={idx} value={idx}>
                                    {plan.name} - {plan.currency || 'RM'}{' '}
                                    {plan.price || plan.priceNumeric}
                                  </option>
                                )
                              )}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                              This plan will be offered as an upsell before
                              checkout
                            </p>
                          </div>

                          <div>
                            <Label htmlFor="bumpOfferDiscount-pricing">
                              Discount % (optional)
                            </Label>
                            <Input
                              id="bumpOfferDiscount-pricing"
                              type="number"
                              min="0"
                              max="100"
                              value={props.bumpOfferDiscount || 0}
                              onChange={(e) =>
                                handlePropChange(
                                  'bumpOfferDiscount',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="0"
                            />
                            {props.bumpOfferPlanIndex !== null &&
                              props.bumpOfferPlanIndex !== undefined &&
                              props.bumpOfferDiscount > 0 && (
                                <p className="text-xs text-green-600 mt-1">
                                  Discounted price:{' '}
                                  {(props.plans || [])[props.bumpOfferPlanIndex]
                                    ?.currency || 'RM'}{' '}
                                  {(
                                    (parseFloat(
                                      (props.plans || [])[
                                        props.bumpOfferPlanIndex
                                      ]?.price
                                    ) ||
                                      (props.plans || [])[
                                        props.bumpOfferPlanIndex
                                      ]?.priceNumeric ||
                                      0) *
                                    (1 - (props.bumpOfferDiscount || 0) / 100)
                                  ).toFixed(2)}
                                </p>
                              )}
                          </div>

                          <div>
                            <Label htmlFor="bumpOfferDescription-pricing">
                              Offer Description
                            </Label>
                            <textarea
                              id="bumpOfferDescription-pricing"
                              value={props.bumpOfferDescription || ''}
                              onChange={(e) =>
                                handlePropChange(
                                  'bumpOfferDescription',
                                  e.target.value
                                )
                              }
                              placeholder="Get this exclusive offer at a special price!"
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                              rows={2}
                            />
                          </div>

                          <div className="p-2 bg-white border border-yellow-300 rounded text-xs text-gray-600">
                            <strong>How it works:</strong> When customer clicks
                            a plan button, the bump offer modal appears. If
                            accepted, the bump offer plan is added to their
                            order. If skipped, they proceed to checkout
                            normally.
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        );

      case 'footer':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div>
                <Label htmlFor="logoText">Brand Name</Label>
                <Input
                  id="logoText"
                  value={props.logoText || ''}
                  onChange={(e) => handlePropChange('logoText', e.target.value)}
                  placeholder="Your Brand"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={props.description || ''}
                  onChange={(e) =>
                    handlePropChange('description', e.target.value)
                  }
                  placeholder="Building amazing products that make a difference."
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="copyright">Copyright Text</Label>
                <Input
                  id="copyright"
                  value={props.copyright || ''}
                  onChange={(e) =>
                    handlePropChange('copyright', e.target.value)
                  }
                  placeholder="© 2024 Your Company. All rights reserved."
                />
              </div>

              <ArrayEditor
                title="Link Columns"
                items={props.columns || []}
                schema={[{ key: 'title', label: 'Column Title', type: 'text' }]}
                defaultItem={{
                  title: 'New Column',
                  links: [
                    { label: 'Link 1', url: '#' },
                    { label: 'Link 2', url: '#' },
                  ],
                }}
                onChange={(columns) => handlePropChange('columns', columns)}
              />

              <ArrayEditor
                title="Social Media Links"
                items={props.socialLinks || []}
                schema={[
                  { key: 'platform', label: 'Platform', type: 'text' },
                  { key: 'url', label: 'URL', type: 'text' },
                ]}
                defaultItem={{
                  platform: 'facebook',
                  url: '#',
                }}
                onChange={(socialLinks) =>
                  handlePropChange('socialLinks', socialLinks)
                }
              />

              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="bgColor"
                    type="color"
                    value={props.bgColor || '#1f2937'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.bgColor || '#1f2937'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    placeholder="#1f2937"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="textColor">Text Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="textColor"
                    type="color"
                    value={props.textColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('textColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.textColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('textColor', e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Background Image Section */}
              {currentProject && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Background Image
                  </h4>
                  <Label>Background Image (optional)</Label>
                  <ImageUpload
                    value={props.backgroundImage || ''}
                    onChange={(url) => handlePropChange('backgroundImage', url)}
                    userId={currentProject.user_id}
                    maxSizeMB={5}
                  />
                  {props.backgroundImage && (
                    <>
                      <div className="mt-4">
                        <Label htmlFor="backgroundOpacity">
                          Overlay Opacity ({props.backgroundOpacity || 70}%)
                        </Label>
                        <input
                          id="backgroundOpacity"
                          type="range"
                          min="0"
                          max="100"
                          value={props.backgroundOpacity || 70}
                          onChange={(e) =>
                            handlePropChange(
                              'backgroundOpacity',
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full mt-2"
                        />
                      </div>
                      <div className="mt-4">
                        <Label htmlFor="bgColor">Overlay Color</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="bgColor"
                            type="color"
                            value={props.bgColor || '#000000'}
                            onChange={(e) =>
                              handlePropChange('bgColor', e.target.value)
                            }
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={props.bgColor || '#000000'}
                            onChange={(e) =>
                              handlePropChange('bgColor', e.target.value)
                            }
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        );

      case 'payment_button':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div className="font-semibold text-sm text-gray-700 mb-2">
                Products
              </div>

              {/* Product Selector from Database */}
              {currentProject && (
                <div className="border border-gray-300 rounded-md p-3 bg-blue-50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Add from Inventory
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Select products from your inventory or{' '}
                    <a
                      href="/dashboard/products"
                      target="_blank"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      manage products
                    </a>
                  </p>
                  <ProductSelector
                    onSelect={(product) => {
                      const newProducts = [
                        ...(props.products || []),
                        {
                          id: product.id,
                          name: product.name,
                          description: product.description || '',
                          price: product.base_price,
                          currency: product.currency,
                          image: product.image_url || '',
                          stock: product.stock,
                          featured: false,
                        },
                      ];
                      handlePropChange('products', newProducts);
                    }}
                  />
                </div>
              )}

              {/* Products List (Read-only with remove option) */}
              {currentProject && (props.products || []).length > 0 && (
                <div className="border border-gray-300 rounded-md p-3 mt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Added Products
                  </h4>
                  <div className="space-y-2">
                    {(props.products || []).map(
                      (product: any, index: number) => (
                        <div
                          key={product.id || index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {product.image && (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {product.currency || 'RM'}{' '}
                                {typeof product.price === 'number'
                                  ? product.price.toFixed(2)
                                  : product.price}
                                {product.stock !== undefined &&
                                  ` • Stock: ${product.stock}`}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newProducts = (props.products || []).filter(
                                (_: any, i: number) => i !== index
                              );
                              handlePropChange('products', newProducts);
                            }}
                            className="text-xs text-red-600 hover:text-red-800 ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    To edit product details, go to the{' '}
                    <a
                      href="/dashboard/products"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Products page
                    </a>
                  </p>
                </div>
              )}

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Button Styling
              </div>

              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={props.buttonText || ''}
                  onChange={(e) =>
                    handlePropChange('buttonText', e.target.value)
                  }
                  placeholder="Pay Now"
                />
              </div>

              <div>
                <Label htmlFor="buttonColor">Button Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="buttonColor"
                    type="color"
                    value={props.buttonColor || '#3b82f6'}
                    onChange={(e) =>
                      handlePropChange('buttonColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.buttonColor || '#3b82f6'}
                    onChange={(e) =>
                      handlePropChange('buttonColor', e.target.value)
                    }
                    placeholder="#3b82f6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="buttonSize">Button Size</Label>
                <select
                  id="buttonSize"
                  value={props.buttonSize || 'md'}
                  onChange={(e) =>
                    handlePropChange('buttonSize', e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>

              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="bgColor"
                    type="color"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Bump Offer (Upsell)
              </div>

              {(props.products || []).length < 2 ? (
                <div className="p-3 bg-gray-100 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-600">
                    Add at least 2 products to enable bump offer functionality.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Current products: {(props.products || []).length}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enableBumpOffer"
                      checked={props.enableBumpOffer || false}
                      onChange={(e) => {
                        handlePropChange('enableBumpOffer', e.target.checked);
                        if (!e.target.checked) {
                          handlePropChange('bumpOfferProductId', null);
                          handlePropChange('bumpOfferDiscount', 0);
                          handlePropChange('bumpOfferDescription', '');
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="enableBumpOffer" className="cursor-pointer">
                      Enable Bump Offer
                    </Label>
                  </div>

                  {props.enableBumpOffer && (
                    <div className="space-y-3 border border-yellow-200 rounded-md p-3 bg-yellow-50 mt-3">
                      <div>
                        <Label htmlFor="bumpOfferProductId">
                          Select Bump Offer Product
                        </Label>
                        <select
                          id="bumpOfferProductId"
                          value={props.bumpOfferProductId || ''}
                          onChange={(e) =>
                            handlePropChange(
                              'bumpOfferProductId',
                              e.target.value
                            )
                          }
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">-- Select a product --</option>
                          {(props.products || []).map((product: any) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - RM {product.price?.toFixed(2)}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          This product will be offered as an upsell before
                          checkout
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="bumpOfferDiscount">
                          Discount % (optional)
                        </Label>
                        <Input
                          id="bumpOfferDiscount"
                          type="number"
                          min="0"
                          max="100"
                          value={props.bumpOfferDiscount || 0}
                          onChange={(e) =>
                            handlePropChange(
                              'bumpOfferDiscount',
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                        />
                        {props.bumpOfferProductId &&
                          props.bumpOfferDiscount > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              Discounted price: RM{' '}
                              {(
                                ((props.products || []).find(
                                  (p: any) => p.id === props.bumpOfferProductId
                                )?.price || 0) *
                                (1 - (props.bumpOfferDiscount || 0) / 100)
                              ).toFixed(2)}
                            </p>
                          )}
                      </div>

                      <div>
                        <Label htmlFor="bumpOfferDescription">
                          Offer Description
                        </Label>
                        <textarea
                          id="bumpOfferDescription"
                          value={props.bumpOfferDescription || ''}
                          onChange={(e) =>
                            handlePropChange(
                              'bumpOfferDescription',
                              e.target.value
                            )
                          }
                          placeholder="Get this exclusive offer at a special price!"
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          rows={2}
                        />
                      </div>

                      <div className="p-2 bg-white border border-yellow-300 rounded text-xs text-gray-600">
                        <strong>How it works:</strong> When customer clicks Pay,
                        the bump offer modal appears. If accepted, the product
                        is added to their order. If skipped, they proceed to
                        checkout normally.
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Messages
              </div>

              <div>
                <Label htmlFor="successMessage">Success Message</Label>
                <Input
                  id="successMessage"
                  value={props.successMessage || ''}
                  onChange={(e) =>
                    handlePropChange('successMessage', e.target.value)
                  }
                  placeholder="Payment successful!"
                />
              </div>

              <div>
                <Label htmlFor="failureMessage">Failure Message</Label>
                <Input
                  id="failureMessage"
                  value={props.failureMessage || ''}
                  onChange={(e) =>
                    handlePropChange('failureMessage', e.target.value)
                  }
                  placeholder="Payment failed. Please try again."
                />
              </div>
            </div>
          </>
        );

      case 'lead_form':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div className="font-semibold text-sm text-gray-700 mb-2">
                Form Content
              </div>

              <div>
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  value={props.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  placeholder="Get In Touch"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={props.description || ''}
                  onChange={(e) =>
                    handlePropChange('description', e.target.value)
                  }
                  placeholder="Fill out the form below and we'll get back to you soon."
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                />
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Field Labels
              </div>

              <div>
                <Label htmlFor="nameLabel">Name Field Label</Label>
                <Input
                  id="nameLabel"
                  value={props.nameLabel || ''}
                  onChange={(e) =>
                    handlePropChange('nameLabel', e.target.value)
                  }
                  placeholder="Your Name"
                />
              </div>

              <div>
                <Label htmlFor="emailLabel">Email Field Label</Label>
                <Input
                  id="emailLabel"
                  value={props.emailLabel || ''}
                  onChange={(e) =>
                    handlePropChange('emailLabel', e.target.value)
                  }
                  placeholder="Email Address"
                />
              </div>

              <div>
                <Label htmlFor="phoneLabel">Phone Field Label</Label>
                <Input
                  id="phoneLabel"
                  value={props.phoneLabel || ''}
                  onChange={(e) =>
                    handlePropChange('phoneLabel', e.target.value)
                  }
                  placeholder="Phone Number (optional)"
                />
              </div>

              <div>
                <Label htmlFor="messageLabel">Message Field Label</Label>
                <Input
                  id="messageLabel"
                  value={props.messageLabel || ''}
                  onChange={(e) =>
                    handlePropChange('messageLabel', e.target.value)
                  }
                  placeholder="Message (optional)"
                />
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Field Configuration
              </div>

              <div className="space-y-3 border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showPhone" className="cursor-pointer">
                    Show Phone Field
                  </Label>
                  <input
                    type="checkbox"
                    id="showPhone"
                    checked={props.fields?.showPhone ?? true}
                    onChange={(e) =>
                      handlePropChange('fields', {
                        ...props.fields,
                        showPhone: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                </div>

                {props.fields?.showPhone && (
                  <div className="flex items-center justify-between pl-4">
                    <Label
                      htmlFor="phoneRequired"
                      className="cursor-pointer text-sm"
                    >
                      Phone Required
                    </Label>
                    <input
                      type="checkbox"
                      id="phoneRequired"
                      checked={props.fields?.phoneRequired ?? false}
                      onChange={(e) =>
                        handlePropChange('fields', {
                          ...props.fields,
                          phoneRequired: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="showMessage" className="cursor-pointer">
                    Show Message Field
                  </Label>
                  <input
                    type="checkbox"
                    id="showMessage"
                    checked={props.fields?.showMessage ?? true}
                    onChange={(e) =>
                      handlePropChange('fields', {
                        ...props.fields,
                        showMessage: e.target.checked,
                      })
                    }
                    className="w-4 h-4"
                  />
                </div>

                {props.fields?.showMessage && (
                  <div className="flex items-center justify-between pl-4">
                    <Label
                      htmlFor="messageRequired"
                      className="cursor-pointer text-sm"
                    >
                      Message Required
                    </Label>
                    <input
                      type="checkbox"
                      id="messageRequired"
                      checked={props.fields?.messageRequired ?? false}
                      onChange={(e) =>
                        handlePropChange('fields', {
                          ...props.fields,
                          messageRequired: e.target.checked,
                        })
                      }
                      className="w-4 h-4"
                    />
                  </div>
                )}
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Submit Button
              </div>

              <div>
                <Label htmlFor="submitButtonText">Button Text</Label>
                <Input
                  id="submitButtonText"
                  value={props.submitButtonText || ''}
                  onChange={(e) =>
                    handlePropChange('submitButtonText', e.target.value)
                  }
                  placeholder="Submit"
                />
              </div>

              <div>
                <Label htmlFor="submitButtonColor">Button Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="submitButtonColor"
                    type="color"
                    value={props.submitButtonColor || '#2563eb'}
                    onChange={(e) =>
                      handlePropChange('submitButtonColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.submitButtonColor || '#2563eb'}
                    onChange={(e) =>
                      handlePropChange('submitButtonColor', e.target.value)
                    }
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="successMessage">Success Message</Label>
                <Input
                  id="successMessage"
                  value={props.successMessage || ''}
                  onChange={(e) =>
                    handlePropChange('successMessage', e.target.value)
                  }
                  placeholder="Thank you! We'll be in touch soon."
                />
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Google Sheets Integration
              </div>

              <div className="space-y-3 border border-gray-200 rounded-md p-3 bg-blue-50">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="google_sheets_enabled"
                    className="cursor-pointer"
                  >
                    Enable Google Sheets
                  </Label>
                  <input
                    type="checkbox"
                    id="google_sheets_enabled"
                    checked={props.google_sheets_enabled ?? false}
                    onChange={(e) =>
                      handlePropChange(
                        'google_sheets_enabled',
                        e.target.checked
                      )
                    }
                    className="w-4 h-4"
                  />
                </div>

                {props.google_sheets_enabled && (
                  <div>
                    <Label htmlFor="google_sheets_url">
                      Google Sheets URL or ID
                    </Label>
                    <Input
                      id="google_sheets_url"
                      value={props.google_sheets_url || ''}
                      onChange={(e) =>
                        handlePropChange('google_sheets_url', e.target.value)
                      }
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Share your Google Sheet with:{' '}
                      {process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL ||
                        'service account email not configured'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="bgColor-leadform">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="bgColor-leadform"
                    type="color"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 'whatsapp_button':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div className="font-semibold text-sm text-gray-700 mb-2">
                WhatsApp Configuration
              </div>

              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={props.phoneNumber || ''}
                  onChange={(e) =>
                    handlePropChange('phoneNumber', e.target.value)
                  }
                  placeholder="60123456789"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Include country code (e.g., 60 for Malaysia)
                </p>
              </div>

              <div>
                <Label htmlFor="message">Pre-filled Message</Label>
                <textarea
                  id="message"
                  value={props.message || ''}
                  onChange={(e) => handlePropChange('message', e.target.value)}
                  placeholder="Hi! I'm interested in your product."
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Message that will be pre-filled when chat opens (optional)
                </p>
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Button Style
              </div>

              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={props.buttonText || ''}
                  onChange={(e) =>
                    handlePropChange('buttonText', e.target.value)
                  }
                  placeholder="Chat on WhatsApp"
                />
              </div>

              <div>
                <Label htmlFor="buttonColor">Button Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="buttonColor"
                    type="color"
                    value={props.buttonColor || '#25D366'}
                    onChange={(e) =>
                      handlePropChange('buttonColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.buttonColor || '#25D366'}
                    onChange={(e) =>
                      handlePropChange('buttonColor', e.target.value)
                    }
                    placeholder="#25D366"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="buttonSize">Button Size</Label>
                <select
                  id="buttonSize"
                  value={props.buttonSize || 'md'}
                  onChange={(e) =>
                    handlePropChange('buttonSize', e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                </select>
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Button Position
              </div>

              <div>
                <Label htmlFor="position">Position Type</Label>
                <select
                  id="position"
                  value={props.position || 'fixed'}
                  onChange={(e) => handlePropChange('position', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="fixed">Fixed (Floating)</option>
                  <option value="inline">Inline</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Fixed: Button floats on the page. Inline: Button appears in
                  the content flow.
                </p>
              </div>

              {props.position === 'fixed' && (
                <div>
                  <Label htmlFor="fixedPosition">Fixed Position</Label>
                  <select
                    id="fixedPosition"
                    value={props.fixedPosition || 'bottom-right'}
                    onChange={(e) =>
                      handlePropChange('fixedPosition', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                  </select>
                </div>
              )}

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Icon & Tooltip
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showIcon" className="cursor-pointer">
                  Show Icon
                </Label>
                <input
                  type="checkbox"
                  id="showIcon"
                  checked={props.showIcon ?? true}
                  onChange={(e) =>
                    handlePropChange('showIcon', e.target.checked)
                  }
                  className="w-4 h-4"
                />
              </div>

              {props.showIcon && (
                <div>
                  <Label htmlFor="customIcon">Custom Icon URL (optional)</Label>
                  <Input
                    id="customIcon"
                    value={props.customIcon || ''}
                    onChange={(e) =>
                      handlePropChange('customIcon', e.target.value)
                    }
                    placeholder="https://example.com/icon.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave blank to use default WhatsApp icon
                  </p>
                </div>
              )}

              {props.position === 'fixed' && (
                <div>
                  <Label htmlFor="tooltipText">Tooltip Text</Label>
                  <Input
                    id="tooltipText"
                    value={props.tooltipText || ''}
                    onChange={(e) =>
                      handlePropChange('tooltipText', e.target.value)
                    }
                    placeholder="Need help? Chat with us!"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Shows on hover for fixed buttons
                  </p>
                </div>
              )}

              {props.position === 'inline' && (
                <>
                  <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                    Headline
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="showHeadline" className="cursor-pointer">
                      Show Headline
                    </Label>
                    <input
                      type="checkbox"
                      id="showHeadline"
                      checked={props.showHeadline ?? true}
                      onChange={(e) =>
                        handlePropChange('showHeadline', e.target.checked)
                      }
                      className="w-4 h-4"
                    />
                  </div>

                  {props.showHeadline && (
                    <>
                      <div>
                        <Label htmlFor="headlineText">Headline Text</Label>
                        <Input
                          id="headlineText"
                          value={props.headlineText || ''}
                          onChange={(e) =>
                            handlePropChange('headlineText', e.target.value)
                          }
                          placeholder="Want to know more about this product?"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Text displayed above the button
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="headlineColor">Headline Color</Label>
                        <div className="flex gap-2">
                          <Input
                            id="headlineColor"
                            type="color"
                            value={props.headlineColor || '#1f2937'}
                            onChange={(e) =>
                              handlePropChange('headlineColor', e.target.value)
                            }
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            type="text"
                            value={props.headlineColor || '#1f2937'}
                            onChange={(e) =>
                              handlePropChange('headlineColor', e.target.value)
                            }
                            placeholder="#1f2937"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </>
        );

      case 'booking_form':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div className="font-semibold text-sm text-gray-700 mb-2">
                Booking Form Header
              </div>

              <div>
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  value={props.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  placeholder="Book an Appointment"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={props.description || ''}
                  onChange={(e) =>
                    handlePropChange('description', e.target.value)
                  }
                  placeholder="Select your preferred date and time slot"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                />
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Service Details
              </div>

              <div>
                <Label htmlFor="serviceName">Service Name</Label>
                <Input
                  id="serviceName"
                  value={props.serviceName || ''}
                  onChange={(e) =>
                    handlePropChange('serviceName', e.target.value)
                  }
                  placeholder="Consultation"
                />
              </div>

              <div>
                <Label htmlFor="servicePrice">Service Price</Label>
                <Input
                  id="servicePrice"
                  type="number"
                  value={props.servicePrice || 0}
                  onChange={(e) =>
                    handlePropChange(
                      'servicePrice',
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Set to 0 for free services
                </p>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={props.duration || 60}
                  onChange={(e) =>
                    handlePropChange('duration', parseInt(e.target.value) || 60)
                  }
                  placeholder="60"
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  value={props.currency || 'MYR'}
                  onChange={(e) => handlePropChange('currency', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="MYR">MYR (RM)</option>
                  <option value="SGD">SGD ($)</option>
                  <option value="USD">USD ($)</option>
                  <option value="IDR">IDR (Rp)</option>
                </select>
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Time Slots Configuration
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={props.startTime || '09:00'}
                    onChange={(e) =>
                      handlePropChange('startTime', e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={props.endTime || '18:00'}
                    onChange={(e) =>
                      handlePropChange('endTime', e.target.value)
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="slotDuration">Slot Duration (minutes)</Label>
                <select
                  id="slotDuration"
                  value={props.slotDuration || 60}
                  onChange={(e) =>
                    handlePropChange('slotDuration', parseInt(e.target.value))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Available Days
              </div>
              <div className="space-y-2 border border-gray-200 rounded-md p-3 bg-gray-50">
                {[
                  'Sunday',
                  'Monday',
                  'Tuesday',
                  'Wednesday',
                  'Thursday',
                  'Friday',
                  'Saturday',
                ].map((day, index) => (
                  <div key={day} className="flex items-center justify-between">
                    <Label htmlFor={`day-${index}`} className="cursor-pointer">
                      {day}
                    </Label>
                    <input
                      type="checkbox"
                      id={`day-${index}`}
                      checked={(
                        props.availableDays || [1, 2, 3, 4, 5]
                      ).includes(index)}
                      onChange={(e) => {
                        const currentDays = props.availableDays || [
                          1, 2, 3, 4, 5,
                        ];
                        if (e.target.checked) {
                          handlePropChange(
                            'availableDays',
                            [...currentDays, index].sort()
                          );
                        } else {
                          handlePropChange(
                            'availableDays',
                            currentDays.filter((d: number) => d !== index)
                          );
                        }
                      }}
                      className="w-4 h-4"
                    />
                  </div>
                ))}
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Customer Fields
              </div>

              <div className="space-y-3 border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showName" className="cursor-pointer">
                    Show Name Field
                  </Label>
                  <input
                    type="checkbox"
                    id="showName"
                    checked={props.showName ?? true}
                    onChange={(e) =>
                      handlePropChange('showName', e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                </div>

                {props.showName && (
                  <div className="pl-4">
                    <Label htmlFor="nameLabel" className="text-xs">
                      Name Label
                    </Label>
                    <Input
                      id="nameLabel"
                      value={props.nameLabel || ''}
                      onChange={(e) =>
                        handlePropChange('nameLabel', e.target.value)
                      }
                      placeholder="Full Name"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="showPhone" className="cursor-pointer">
                    Show Phone Field
                  </Label>
                  <input
                    type="checkbox"
                    id="showPhone"
                    checked={props.showPhone ?? true}
                    onChange={(e) =>
                      handlePropChange('showPhone', e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                </div>

                {props.showPhone && (
                  <div className="pl-4">
                    <Label htmlFor="phoneLabel" className="text-xs">
                      Phone Label
                    </Label>
                    <Input
                      id="phoneLabel"
                      value={props.phoneLabel || ''}
                      onChange={(e) =>
                        handlePropChange('phoneLabel', e.target.value)
                      }
                      placeholder="Phone Number"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="showEmail" className="cursor-pointer">
                    Show Email Field
                  </Label>
                  <input
                    type="checkbox"
                    id="showEmail"
                    checked={props.showEmail ?? true}
                    onChange={(e) =>
                      handlePropChange('showEmail', e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                </div>

                {props.showEmail && (
                  <div className="pl-4">
                    <Label htmlFor="emailLabel" className="text-xs">
                      Email Label
                    </Label>
                    <Input
                      id="emailLabel"
                      value={props.emailLabel || ''}
                      onChange={(e) =>
                        handlePropChange('emailLabel', e.target.value)
                      }
                      placeholder="Email"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Label htmlFor="showRemark" className="cursor-pointer">
                    Show Remarks/Notes Field
                  </Label>
                  <input
                    type="checkbox"
                    id="showRemark"
                    checked={props.showRemark ?? true}
                    onChange={(e) =>
                      handlePropChange('showRemark', e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                </div>

                {props.showRemark && (
                  <div className="pl-4 space-y-2">
                    <div>
                      <Label htmlFor="remarkLabel" className="text-xs">
                        Remark Label
                      </Label>
                      <Input
                        id="remarkLabel"
                        value={props.remarkLabel || ''}
                        onChange={(e) =>
                          handlePropChange('remarkLabel', e.target.value)
                        }
                        placeholder="Notes / Remarks"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="remarkRequired"
                        className="text-xs cursor-pointer"
                      >
                        Required
                      </Label>
                      <input
                        type="checkbox"
                        id="remarkRequired"
                        checked={props.remarkRequired ?? false}
                        onChange={(e) =>
                          handlePropChange('remarkRequired', e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="defaultCountryCode">Default Country Code</Label>
                <select
                  id="defaultCountryCode"
                  value={props.defaultCountryCode || 'MY'}
                  onChange={(e) =>
                    handlePropChange('defaultCountryCode', e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="MY">🇲🇾 Malaysia (+60)</option>
                  <option value="SG">🇸🇬 Singapore (+65)</option>
                  <option value="ID">🇮🇩 Indonesia (+62)</option>
                  <option value="TH">🇹🇭 Thailand (+66)</option>
                  <option value="PH">🇵🇭 Philippines (+63)</option>
                  <option value="VN">🇻🇳 Vietnam (+84)</option>
                  <option value="US">🇺🇸 United States (+1)</option>
                  <option value="GB">🇬🇧 United Kingdom (+44)</option>
                </select>
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Submit Button
              </div>

              <div>
                <Label htmlFor="submitButtonText">Button Text</Label>
                <Input
                  id="submitButtonText"
                  value={props.submitButtonText || ''}
                  onChange={(e) =>
                    handlePropChange('submitButtonText', e.target.value)
                  }
                  placeholder="Confirm Booking"
                />
              </div>

              <div>
                <Label htmlFor="submitButtonColor">Button Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="submitButtonColor"
                    type="color"
                    value={props.submitButtonColor || '#2563eb'}
                    onChange={(e) =>
                      handlePropChange('submitButtonColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.submitButtonColor || '#2563eb'}
                    onChange={(e) =>
                      handlePropChange('submitButtonColor', e.target.value)
                    }
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="requirePayment" className="cursor-pointer">
                  Require Payment
                </Label>
                <input
                  type="checkbox"
                  id="requirePayment"
                  checked={props.requirePayment ?? false}
                  onChange={(e) =>
                    handlePropChange('requirePayment', e.target.checked)
                  }
                  className="w-4 h-4"
                />
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Google Sheets Integration
              </div>

              <div className="space-y-3 border border-gray-200 rounded-md p-3 bg-blue-50">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="google_sheets_enabled"
                    className="cursor-pointer"
                  >
                    Enable Google Sheets
                  </Label>
                  <input
                    type="checkbox"
                    id="google_sheets_enabled"
                    checked={props.google_sheets_enabled ?? false}
                    onChange={(e) =>
                      handlePropChange(
                        'google_sheets_enabled',
                        e.target.checked
                      )
                    }
                    className="w-4 h-4"
                  />
                </div>

                {props.google_sheets_enabled && (
                  <div>
                    <Label htmlFor="google_sheets_url">
                      Google Sheets URL or ID
                    </Label>
                    <Input
                      id="google_sheets_url"
                      value={props.google_sheets_url || ''}
                      onChange={(e) =>
                        handlePropChange('google_sheets_url', e.target.value)
                      }
                      placeholder="https://docs.google.com/spreadsheets/d/..."
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Connect your Google account in Integrations to enable this
                      feature.
                    </p>
                  </div>
                )}
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Footer Links
              </div>

              <div>
                <Label htmlFor="termsUrl">Terms & Conditions URL</Label>
                <Input
                  id="termsUrl"
                  value={props.termsUrl || ''}
                  onChange={(e) => handlePropChange('termsUrl', e.target.value)}
                  placeholder="#"
                />
              </div>

              <div>
                <Label htmlFor="policyUrl">Privacy Policy URL</Label>
                <Input
                  id="policyUrl"
                  value={props.policyUrl || ''}
                  onChange={(e) =>
                    handlePropChange('policyUrl', e.target.value)
                  }
                  placeholder="#"
                />
              </div>

              <div>
                <Label htmlFor="bgColor-booking">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="bgColor-booking"
                    type="color"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 'form_with_payment':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div className="font-semibold text-sm text-gray-700 mb-2">
                Form Header
              </div>

              <div>
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  value={props.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  placeholder="Order Form"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <textarea
                  id="description"
                  value={props.description || ''}
                  onChange={(e) =>
                    handlePropChange('description', e.target.value)
                  }
                  placeholder="Fill in the form to complete your order"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  rows={2}
                />
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Customer Fields
              </div>

              <div className="space-y-3 border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="flex items-center justify-between">
                  <Label htmlFor="showName" className="cursor-pointer">
                    Show Name Field
                  </Label>
                  <input
                    type="checkbox"
                    id="showName"
                    checked={props.showName ?? true}
                    onChange={(e) =>
                      handlePropChange('showName', e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                </div>

                {props.showName && (
                  <>
                    <div className="pl-4">
                      <Label htmlFor="nameLabel" className="text-xs">
                        Name Label
                      </Label>
                      <Input
                        id="nameLabel"
                        value={props.nameLabel || ''}
                        onChange={(e) =>
                          handlePropChange('nameLabel', e.target.value)
                        }
                        placeholder="Name"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <Label
                        htmlFor="nameRequired"
                        className="cursor-pointer text-sm"
                      >
                        Name Required
                      </Label>
                      <input
                        type="checkbox"
                        id="nameRequired"
                        checked={props.nameRequired ?? true}
                        onChange={(e) =>
                          handlePropChange('nameRequired', e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <Label htmlFor="showMobile" className="cursor-pointer">
                    Show Mobile Field
                  </Label>
                  <input
                    type="checkbox"
                    id="showMobile"
                    checked={props.showMobile ?? true}
                    onChange={(e) =>
                      handlePropChange('showMobile', e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                </div>

                {props.showMobile && (
                  <>
                    <div className="pl-4">
                      <Label htmlFor="mobileLabel" className="text-xs">
                        Mobile Label
                      </Label>
                      <Input
                        id="mobileLabel"
                        value={props.mobileLabel || ''}
                        onChange={(e) =>
                          handlePropChange('mobileLabel', e.target.value)
                        }
                        placeholder="Mobile Number"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <Label
                        htmlFor="mobileRequired"
                        className="cursor-pointer text-sm"
                      >
                        Mobile Required
                      </Label>
                      <input
                        type="checkbox"
                        id="mobileRequired"
                        checked={props.mobileRequired ?? true}
                        onChange={(e) =>
                          handlePropChange('mobileRequired', e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="pl-4">
                      <Label htmlFor="defaultCountryCode" className="text-xs">
                        Default Country
                      </Label>
                      <select
                        id="defaultCountryCode"
                        value={props.defaultCountryCode || 'MY'}
                        onChange={(e) =>
                          handlePropChange('defaultCountryCode', e.target.value)
                        }
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="MY">Malaysia (+60)</option>
                        <option value="SG">Singapore (+65)</option>
                        <option value="ID">Indonesia (+62)</option>
                        <option value="TH">Thailand (+66)</option>
                        <option value="PH">Philippines (+63)</option>
                        <option value="VN">Vietnam (+84)</option>
                        <option value="US">USA (+1)</option>
                        <option value="GB">UK (+44)</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                  <Label htmlFor="showEmail" className="cursor-pointer">
                    Show Email Field
                  </Label>
                  <input
                    type="checkbox"
                    id="showEmail"
                    checked={props.showEmail ?? true}
                    onChange={(e) =>
                      handlePropChange('showEmail', e.target.checked)
                    }
                    className="w-4 h-4"
                  />
                </div>

                {props.showEmail && (
                  <>
                    <div className="pl-4">
                      <Label htmlFor="emailLabel" className="text-xs">
                        Email Label
                      </Label>
                      <Input
                        id="emailLabel"
                        value={props.emailLabel || ''}
                        onChange={(e) =>
                          handlePropChange('emailLabel', e.target.value)
                        }
                        placeholder="Email"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <Label
                        htmlFor="emailRequired"
                        className="cursor-pointer text-sm"
                      >
                        Email Required
                      </Label>
                      <input
                        type="checkbox"
                        id="emailRequired"
                        checked={props.emailRequired ?? true}
                        onChange={(e) =>
                          handlePropChange('emailRequired', e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Products
              </div>

              {/* Product Selector from Database (same as Payment Button) */}
              {currentProject && (
                <div className="border border-gray-300 rounded-md p-3 bg-blue-50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Add from Inventory
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Select products from your inventory or{' '}
                    <a
                      href="/dashboard/products"
                      target="_blank"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      manage products
                    </a>
                  </p>
                  <ProductSelector
                    enableBulkSelect={true}
                    onSelect={(product) => {
                      const newProducts = [
                        ...(props.products || []),
                        {
                          id: product.id,
                          name: product.name,
                          description: product.description || '',
                          price: product.base_price,
                          currency: product.currency,
                          image: product.image_url || '',
                          stock: product.stock,
                          featured: false,
                          variations: product.variations || [],
                        },
                      ];
                      handlePropChange('products', newProducts);
                    }}
                    onBulkSelect={(products) => {
                      const newProducts = [
                        ...(props.products || []),
                        ...products.map((product) => ({
                          id: product.id,
                          name: product.name,
                          description: product.description || '',
                          price: product.base_price,
                          currency: product.currency,
                          image: product.image_url || '',
                          stock: product.stock,
                          featured: false,
                          variations: product.variations || [],
                        })),
                      ];
                      handlePropChange('products', newProducts);
                    }}
                  />
                </div>
              )}

              {/* Products List (Read-only with remove option) */}
              {currentProject && (props.products || []).length > 0 && (
                <div className="border border-gray-300 rounded-md p-3 mt-3">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Added Products ({(props.products || []).length})
                    </h4>
                    {(props.products || []).length > 1 && (
                      <button
                        type="button"
                        onClick={() => handlePropChange('products', [])}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {(props.products || []).map(
                      (product: any, index: number) => {
                        const hasVariations =
                          product.variations && product.variations.length > 0;
                        return (
                          <div
                            key={product.id || index}
                            className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                          >
                            <div className="flex items-center gap-2 flex-1">
                              {product.image && (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-8 h-8 object-cover rounded"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {product.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {product.currency || 'RM'}{' '}
                                  {typeof product.price === 'number'
                                    ? product.price.toFixed(2)
                                    : product.price}
                                  {product.stock !== undefined &&
                                    ` • Stock: ${product.stock}`}
                                </p>
                                {hasVariations && (
                                  <p className="text-xs text-blue-600">
                                    {product.variations[0].options.length}{' '}
                                    {product.variations[0].name.toLowerCase()}{' '}
                                    variants
                                    {product.variations[0].options.some(
                                      (o: any) => o.priceAdjustment > 0
                                    ) && ' (with price tiers)'}
                                  </p>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newProducts = (
                                  props.products || []
                                ).filter((_: any, i: number) => i !== index);
                                handlePropChange('products', newProducts);
                              }}
                              className="text-xs text-red-600 hover:text-red-800 ml-2"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      }
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    To edit product details, go to the{' '}
                    <a
                      href="/dashboard/products"
                      target="_blank"
                      className="text-blue-600 hover:underline"
                    >
                      Products page
                    </a>
                  </p>
                </div>
              )}

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Submit Button
              </div>

              <div>
                <Label htmlFor="submitButtonText">Button Text</Label>
                <Input
                  id="submitButtonText"
                  value={props.submitButtonText || ''}
                  onChange={(e) =>
                    handlePropChange('submitButtonText', e.target.value)
                  }
                  placeholder="Complete Payment"
                />
              </div>

              <div>
                <Label htmlFor="submitButtonColor">Button Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="submitButtonColor"
                    type="color"
                    value={props.submitButtonColor || '#ef4444'}
                    onChange={(e) =>
                      handlePropChange('submitButtonColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.submitButtonColor || '#ef4444'}
                    onChange={(e) =>
                      handlePropChange('submitButtonColor', e.target.value)
                    }
                    placeholder="#ef4444"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Bump Offer Section - Only available with 2+ products */}
              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Bump Offer (Upsell)
              </div>

              {(props.products || []).length < 2 ? (
                <div className="p-3 bg-gray-100 border border-gray-200 rounded-md">
                  <p className="text-sm text-gray-600">
                    Add at least 2 products to enable bump offer functionality.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Current products: {(props.products || []).length}
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enableBumpOffer-form"
                      checked={props.enableBumpOffer || false}
                      onChange={(e) => {
                        handlePropChange('enableBumpOffer', e.target.checked);
                        if (!e.target.checked) {
                          handlePropChange('bumpOfferProductId', null);
                          handlePropChange('bumpOfferDiscount', 0);
                          handlePropChange('bumpOfferDescription', '');
                        }
                      }}
                      className="w-4 h-4"
                    />
                    <Label
                      htmlFor="enableBumpOffer-form"
                      className="cursor-pointer"
                    >
                      Enable Bump Offer
                    </Label>
                  </div>

                  {props.enableBumpOffer && (
                    <div className="space-y-3 border border-yellow-200 rounded-md p-3 bg-yellow-50 mt-3">
                      <div>
                        <Label htmlFor="bumpOfferProductId">
                          Select Bump Offer Product
                        </Label>
                        <select
                          id="bumpOfferProductId"
                          value={props.bumpOfferProductId || ''}
                          onChange={(e) =>
                            handlePropChange(
                              'bumpOfferProductId',
                              e.target.value
                            )
                          }
                          className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="">-- Select a product --</option>
                          {(props.products || []).map((product: any) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - RM {product.price?.toFixed(2)}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                          This product will be offered as an upsell before
                          checkout
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="bumpOfferDiscount-form">
                          Discount % (optional)
                        </Label>
                        <Input
                          id="bumpOfferDiscount-form"
                          type="number"
                          min="0"
                          max="100"
                          value={props.bumpOfferDiscount || 0}
                          onChange={(e) =>
                            handlePropChange(
                              'bumpOfferDiscount',
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                        />
                        {props.bumpOfferProductId &&
                          props.bumpOfferDiscount > 0 && (
                            <p className="text-xs text-green-600 mt-1">
                              Discounted price: RM{' '}
                              {(
                                ((props.products || []).find(
                                  (p: any) => p.id === props.bumpOfferProductId
                                )?.price || 0) *
                                (1 - (props.bumpOfferDiscount || 0) / 100)
                              ).toFixed(2)}
                            </p>
                          )}
                      </div>

                      <div>
                        <Label htmlFor="bumpOfferDescription-form">
                          Offer Description
                        </Label>
                        <textarea
                          id="bumpOfferDescription-form"
                          value={props.bumpOfferDescription || ''}
                          onChange={(e) =>
                            handlePropChange(
                              'bumpOfferDescription',
                              e.target.value
                            )
                          }
                          placeholder="Get this exclusive offer at a special price!"
                          className="w-full p-2 border border-gray-300 rounded-md text-sm"
                          rows={2}
                        />
                      </div>

                      <div className="p-2 bg-white border border-yellow-300 rounded text-xs text-gray-600">
                        <strong>How it works:</strong> When customer clicks Pay,
                        the bump offer modal appears. If accepted, the product
                        is added to their order. If skipped, they proceed to
                        checkout normally.
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Footer Links
              </div>

              <div>
                <Label htmlFor="termsUrl">Terms & Conditions URL</Label>
                <Input
                  id="termsUrl"
                  value={props.termsUrl || ''}
                  onChange={(e) => handlePropChange('termsUrl', e.target.value)}
                  placeholder="#terms"
                />
              </div>

              <div>
                <Label htmlFor="policyUrl">Policy URL</Label>
                <Input
                  id="policyUrl"
                  value={props.policyUrl || ''}
                  onChange={(e) =>
                    handlePropChange('policyUrl', e.target.value)
                  }
                  placeholder="#policy"
                />
              </div>

              <div>
                <Label htmlFor="contactUrl">Contact Us URL</Label>
                <Input
                  id="contactUrl"
                  value={props.contactUrl || ''}
                  onChange={(e) =>
                    handlePropChange('contactUrl', e.target.value)
                  }
                  placeholder="#contact"
                />
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Company Info
              </div>

              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={props.companyName || ''}
                  onChange={(e) =>
                    handlePropChange('companyName', e.target.value)
                  }
                  placeholder="Your Company Name"
                />
              </div>

              <div>
                <Label htmlFor="companyRegistration">
                  Company Registration
                </Label>
                <Input
                  id="companyRegistration"
                  value={props.companyRegistration || ''}
                  onChange={(e) =>
                    handlePropChange('companyRegistration', e.target.value)
                  }
                  placeholder="Company Registration Number"
                />
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Styling
              </div>

              <div>
                <Label htmlFor="bgColor-form-payment">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="bgColor-form-payment"
                    type="color"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </>
        );

      case 'product_carousel':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div className="font-semibold text-sm text-gray-700 mb-2">
                Header
              </div>

              <div>
                <Label htmlFor="title-carousel">Title</Label>
                <Input
                  id="title-carousel"
                  value={props.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  placeholder="Our Products"
                />
              </div>

              <div>
                <Label htmlFor="subtitle-carousel">Subtitle (optional)</Label>
                <Input
                  id="subtitle-carousel"
                  value={props.subtitle || ''}
                  onChange={(e) => handlePropChange('subtitle', e.target.value)}
                  placeholder="Check out our latest collection"
                />
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Layout
              </div>

              <div>
                <Label htmlFor="layout-carousel">Layout Style</Label>
                <select
                  id="layout-carousel"
                  value={props.layout || 'grid'}
                  onChange={(e) => handlePropChange('layout', e.target.value)}
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="grid">Grid</option>
                  <option value="carousel">Carousel</option>
                </select>
              </div>

              <div>
                <Label htmlFor="columns-carousel">Columns</Label>
                <select
                  id="columns-carousel"
                  value={props.columns || 3}
                  onChange={(e) =>
                    handlePropChange('columns', parseInt(e.target.value))
                  }
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value={2}>2 Columns</option>
                  <option value={3}>3 Columns</option>
                  <option value={4}>4 Columns</option>
                </select>
              </div>

              <div>
                <Label htmlFor="cardStyle-carousel">Card Style</Label>
                <select
                  id="cardStyle-carousel"
                  value={props.cardStyle || 'shadow'}
                  onChange={(e) =>
                    handlePropChange('cardStyle', e.target.value)
                  }
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                >
                  <option value="minimal">Minimal</option>
                  <option value="bordered">Bordered</option>
                  <option value="shadow">Shadow</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showPrice-carousel"
                  checked={props.showPrice ?? true}
                  onChange={(e) =>
                    handlePropChange('showPrice', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <Label htmlFor="showPrice-carousel" className="cursor-pointer">
                  Show Price
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showDescription-carousel"
                  checked={props.showDescription ?? true}
                  onChange={(e) =>
                    handlePropChange('showDescription', e.target.checked)
                  }
                  className="w-4 h-4"
                />
                <Label
                  htmlFor="showDescription-carousel"
                  className="cursor-pointer"
                >
                  Show Description
                </Label>
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Products
              </div>

              {/* Product Selector from Database */}
              {currentProject && (
                <div className="border border-gray-300 rounded-md p-3 bg-blue-50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Add from Inventory
                  </h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Select products from your inventory or{' '}
                    <a
                      href="/dashboard/products"
                      target="_blank"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      manage products
                    </a>
                  </p>
                  <ProductSelector
                    onSelect={(product) => {
                      const newProducts = [
                        ...(props.products || []),
                        {
                          id: product.id,
                          code: product.code,
                          name: product.name,
                          description: product.description || '',
                          base_price: product.base_price,
                          currency: product.currency,
                          image_url: product.image_url || '',
                          status: product.status,
                          variations: product.variations || [],
                        },
                      ];
                      handlePropChange('products', newProducts);
                    }}
                  />
                </div>
              )}

              {/* Products List */}
              {currentProject && (props.products || []).length > 0 && (
                <div className="border border-gray-300 rounded-md p-3 mt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Added Products ({(props.products || []).length})
                  </h4>
                  <div className="space-y-2">
                    {(props.products || []).map(
                      (product: any, index: number) => (
                        <div
                          key={product.id || index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {product.image_url && (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {product.currency || 'RM'}{' '}
                                {typeof product.base_price === 'number'
                                  ? product.base_price.toFixed(2)
                                  : product.base_price}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newProducts = (props.products || []).filter(
                                (_: any, i: number) => i !== index
                              );
                              handlePropChange('products', newProducts);
                            }}
                            className="text-xs text-red-600 hover:text-red-800 ml-2"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Colors
              </div>

              <div>
                <Label htmlFor="bgColor-carousel">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="bgColor-carousel"
                    type="color"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="textColor-carousel">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="textColor-carousel"
                    type="color"
                    value={props.textColor || '#1f2937'}
                    onChange={(e) =>
                      handlePropChange('textColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.textColor || '#1f2937'}
                    onChange={(e) =>
                      handlePropChange('textColor', e.target.value)
                    }
                    placeholder="#1f2937"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="priceColor-carousel">Price Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="priceColor-carousel"
                    type="color"
                    value={props.priceColor || '#2563eb'}
                    onChange={(e) =>
                      handlePropChange('priceColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.priceColor || '#2563eb'}
                    onChange={(e) =>
                      handlePropChange('priceColor', e.target.value)
                    }
                    placeholder="#2563eb"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Background Image */}
              {currentProject && (
                <div className="mt-4">
                  <Label>Background Image (optional)</Label>
                  <ImageUpload
                    value={props.backgroundImage || ''}
                    onChange={(url) => handlePropChange('backgroundImage', url)}
                    userId={currentProject.user_id}
                    maxSizeMB={5}
                  />
                </div>
              )}

              {props.backgroundImage && (
                <div>
                  <Label htmlFor="backgroundOpacity-carousel">
                    Background Overlay ({props.backgroundOpacity || 70}%)
                  </Label>
                  <input
                    id="backgroundOpacity-carousel"
                    type="range"
                    min="0"
                    max="100"
                    value={props.backgroundOpacity || 70}
                    onChange={(e) =>
                      handlePropChange(
                        'backgroundOpacity',
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </>
        );

      case 'media':
        return (
          <>
            {commonSection}
            <div className="space-y-4 pt-6">
              <div className="font-semibold text-sm text-gray-700 mb-2">
                Media Type
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handlePropChange('mediaType', 'image')}
                  className={`flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${
                    props.mediaType === 'image'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Image
                </button>
                <button
                  type="button"
                  onClick={() => handlePropChange('mediaType', 'video')}
                  className={`flex-1 py-2 px-3 rounded-md border text-sm font-medium transition-colors ${
                    props.mediaType === 'video'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Video
                </button>
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-4">
                Media Source
              </div>

              {/* URL Input */}
              <div>
                <Label htmlFor="mediaUrl">
                  {props.mediaType === 'image' ? 'Image URL' : 'Video URL'}
                </Label>
                <Input
                  id="mediaUrl"
                  value={props.mediaUrl || ''}
                  onChange={(e) => handlePropChange('mediaUrl', e.target.value)}
                  placeholder={
                    props.mediaType === 'image'
                      ? 'https://example.com/image.jpg'
                      : 'https://youtube.com/watch?v=... or video URL'
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  {props.mediaType === 'video'
                    ? 'Supports YouTube, Vimeo, or direct video file URLs'
                    : 'Paste image URL or upload below'}
                </p>
              </div>

              {/* Upload Button for Images */}
              {props.mediaType === 'image' && currentProject && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    id="media-upload"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      // Validate file type
                      if (!file.type.startsWith('image/')) {
                        alert('Please select an image file');
                        return;
                      }

                      // Validate file size (max 5MB)
                      if (file.size > 5 * 1024 * 1024) {
                        alert('Image must be less than 5MB');
                        return;
                      }

                      // Show uploading state
                      const uploadLabel =
                        document.getElementById('media-upload-label');
                      if (uploadLabel) {
                        uploadLabel.innerHTML =
                          '<p class="text-sm font-medium text-blue-600">Uploading...</p>';
                      }

                      try {
                        // Create file name
                        const fileExt = file.name.split('.').pop();
                        const fileName = `media/${currentProject.user_id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                        console.log('[Media Upload] Uploading to:', fileName);

                        // Upload to Supabase storage
                        const { supabase } =
                          await import('@/lib/supabase/auth-client');
                        const { data, error } = await supabase.storage
                          .from('project-images')
                          .upload(fileName, file, {
                            cacheControl: '3600',
                            upsert: false,
                          });

                        if (error) {
                          console.error('[Media Upload] Upload error:', error);
                          throw error;
                        }

                        console.log('[Media Upload] Upload success:', data);

                        // Get public URL
                        const {
                          data: { publicUrl },
                        } = supabase.storage
                          .from('project-images')
                          .getPublicUrl(data.path);

                        console.log('[Media Upload] Public URL:', publicUrl);

                        handlePropChange('mediaUrl', publicUrl);

                        // Reset upload label
                        if (uploadLabel) {
                          uploadLabel.innerHTML =
                            '<p class="text-sm font-medium">Click to upload image</p><p class="text-xs text-gray-400 mt-1">Max 5MB</p>';
                        }
                      } catch (err) {
                        console.error('[Media Upload] Error:', err);
                        alert(
                          'Failed to upload image: ' +
                            (err instanceof Error
                              ? err.message
                              : 'Unknown error')
                        );
                        // Reset upload label
                        const uploadLabel =
                          document.getElementById('media-upload-label');
                        if (uploadLabel) {
                          uploadLabel.innerHTML =
                            '<p class="text-sm font-medium">Click to upload image</p><p class="text-xs text-gray-400 mt-1">Max 5MB</p>';
                        }
                      }

                      // Reset file input
                      e.target.value = '';
                    }}
                  />
                  <label htmlFor="media-upload" className="cursor-pointer">
                    <div
                      id="media-upload-label"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <p className="text-sm font-medium">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Max 5MB</p>
                    </div>
                  </label>
                </div>
              )}

              {/* Preview */}
              {props.mediaUrl && props.mediaType === 'image' && (
                <div className="relative">
                  <img
                    src={props.mediaUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-md border border-gray-200"
                    onError={(e) => {
                      // Show placeholder on error
                      (e.target as HTMLImageElement).style.display = 'none';
                      const placeholder = document.getElementById(
                        'media-preview-error'
                      );
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      // Hide error placeholder on successful load
                      (e.target as HTMLImageElement).style.display = 'block';
                      const placeholder = document.getElementById(
                        'media-preview-error'
                      );
                      if (placeholder) placeholder.style.display = 'none';
                    }}
                  />
                  <div
                    id="media-preview-error"
                    className="w-full h-32 bg-gray-100 rounded-md border border-gray-200 items-center justify-center text-gray-500 text-xs text-center p-2"
                    style={{ display: 'none' }}
                  >
                    <div>
                      <p>Preview unavailable</p>
                      <p className="mt-1 text-blue-600 break-all">
                        {props.mediaUrl.substring(0, 50)}...
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handlePropChange('mediaUrl', '')}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <p className="text-xs text-green-600 mt-1">
                    Image uploaded successfully
                  </p>
                </div>
              )}

              {/* Alt Text for Images */}
              {props.mediaType === 'image' && (
                <div>
                  <Label htmlFor="altText">Alt Text (for accessibility)</Label>
                  <Input
                    id="altText"
                    value={props.altText || ''}
                    onChange={(e) =>
                      handlePropChange('altText', e.target.value)
                    }
                    placeholder="Describe the image"
                  />
                </div>
              )}

              {/* Video Options */}
              {props.mediaType === 'video' && (
                <>
                  <div className="font-semibold text-sm text-gray-700 mb-2 mt-4">
                    Video Options
                  </div>
                  <div className="space-y-3 border border-gray-200 rounded-md p-3 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoplay" className="cursor-pointer">
                        Autoplay
                      </Label>
                      <input
                        type="checkbox"
                        id="autoplay"
                        checked={props.autoplay ?? false}
                        onChange={(e) =>
                          handlePropChange('autoplay', e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="loop" className="cursor-pointer">
                        Loop
                      </Label>
                      <input
                        type="checkbox"
                        id="loop"
                        checked={props.loop ?? true}
                        onChange={(e) =>
                          handlePropChange('loop', e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="muted" className="cursor-pointer">
                        Muted
                      </Label>
                      <input
                        type="checkbox"
                        id="muted"
                        checked={props.muted ?? true}
                        onChange={(e) =>
                          handlePropChange('muted', e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="controls" className="cursor-pointer">
                        Show Controls
                      </Label>
                      <input
                        type="checkbox"
                        id="controls"
                        checked={props.controls ?? true}
                        onChange={(e) =>
                          handlePropChange('controls', e.target.checked)
                        }
                        className="w-4 h-4"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Layout
              </div>

              <div>
                <Label htmlFor="layout">Alignment</Label>
                <select
                  id="layout"
                  value={props.layout || 'contained'}
                  onChange={(e) => handlePropChange('layout', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="full_width">Full Width</option>
                  <option value="contained">Contained (Centered)</option>
                  <option value="left">Left Aligned</option>
                  <option value="center">Center Aligned</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>

              {props.layout !== 'full_width' && (
                <div>
                  <Label htmlFor="maxWidth">Max Width</Label>
                  <select
                    id="maxWidth"
                    value={props.maxWidth || '800px'}
                    onChange={(e) =>
                      handlePropChange('maxWidth', e.target.value)
                    }
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="400px">Small (400px)</option>
                    <option value="600px">Medium (600px)</option>
                    <option value="800px">Large (800px)</option>
                    <option value="1000px">Extra Large (1000px)</option>
                    <option value="100%">Full Container Width</option>
                  </select>
                </div>
              )}

              <div>
                <Label htmlFor="aspectRatio">Aspect Ratio</Label>
                <select
                  id="aspectRatio"
                  value={props.aspectRatio || 'auto'}
                  onChange={(e) =>
                    handlePropChange('aspectRatio', e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="auto">Auto (Original)</option>
                  <option value="16:9">16:9 (Widescreen)</option>
                  <option value="4:3">4:3 (Standard)</option>
                  <option value="1:1">1:1 (Square)</option>
                  <option value="9:16">9:16 (Portrait)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="borderRadius">Border Radius</Label>
                <select
                  id="borderRadius"
                  value={props.borderRadius || '8px'}
                  onChange={(e) =>
                    handlePropChange('borderRadius', e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="0">None</option>
                  <option value="4px">Small</option>
                  <option value="8px">Medium</option>
                  <option value="16px">Large</option>
                  <option value="24px">Extra Large</option>
                  <option value="full">Full (Circular)</option>
                </select>
              </div>

              <div>
                <Label htmlFor="shadow">Shadow</Label>
                <select
                  id="shadow"
                  value={props.shadow || 'none'}
                  onChange={(e) => handlePropChange('shadow', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="none">None</option>
                  <option value="sm">Small</option>
                  <option value="md">Medium</option>
                  <option value="lg">Large</option>
                  <option value="xl">Extra Large</option>
                </select>
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Caption
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showCaption" className="cursor-pointer">
                  Show Caption
                </Label>
                <input
                  type="checkbox"
                  id="showCaption"
                  checked={props.showCaption ?? false}
                  onChange={(e) =>
                    handlePropChange('showCaption', e.target.checked)
                  }
                  className="w-4 h-4"
                />
              </div>

              {props.showCaption && (
                <>
                  <div>
                    <Label htmlFor="caption">Caption Text</Label>
                    <Input
                      id="caption"
                      value={props.caption || ''}
                      onChange={(e) =>
                        handlePropChange('caption', e.target.value)
                      }
                      placeholder="Add a caption..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="captionPosition">Caption Position</Label>
                    <select
                      id="captionPosition"
                      value={props.captionPosition || 'below'}
                      onChange={(e) =>
                        handlePropChange('captionPosition', e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="above">Above Media</option>
                      <option value="below">Below Media</option>
                    </select>
                  </div>
                </>
              )}

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">
                Styling
              </div>

              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="bgColor"
                    type="color"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    type="text"
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) =>
                      handlePropChange('bgColor', e.target.value)
                    }
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="paddingY">Vertical Padding</Label>
                <select
                  id="paddingY"
                  value={props.paddingY || '2rem'}
                  onChange={(e) => handlePropChange('paddingY', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="0">None</option>
                  <option value="1rem">Small</option>
                  <option value="2rem">Medium</option>
                  <option value="3rem">Large</option>
                  <option value="4rem">Extra Large</option>
                </select>
              </div>
            </div>
          </>
        );

      default:
        return (
          <>
            {commonSection}
            <div className="pt-6 text-sm text-gray-600">
              <p>No editable properties for this element type.</p>
            </div>
          </>
        );
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full md:relative absolute md:z-0 z-20 right-0 top-0 shadow-xl md:shadow-none">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Properties</h2>
          <p className="text-sm text-gray-500 mt-1">
            Edit the selected element
          </p>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1 hover:bg-gray-100 rounded"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Properties editor */}
      <div className="flex-1 overflow-y-auto p-4">{renderPropsEditor()}</div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button variant="outline" className="w-full" onClick={handleDuplicate}>
          <Copy className="w-4 h-4 mr-2" />
          Duplicate Element
        </Button>
        <Button
          variant="outline"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Element
        </Button>
      </div>
    </div>
  );
};
