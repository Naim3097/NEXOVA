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

              <div>
                <Label htmlFor="ctaText">Button Text</Label>
                <Input
                  id="ctaText"
                  value={props.ctaText || ''}
                  onChange={(e) => handlePropChange('ctaText', e.target.value)}
                  placeholder="Enter button text"
                />
              </div>

              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="bgColor"
                    type="color"
                    value={props.bgColor || '#f9fafb'}
                    onChange={(e) => handlePropChange('bgColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.bgColor || '#f9fafb'}
                    onChange={(e) => handlePropChange('bgColor', e.target.value)}
                    placeholder="#f9fafb"
                    className="flex-1"
                  />
                </div>
              </div>

              {currentProject && (
                <div>
                  <Label>
                    {props.variant === 'centered' ? 'Hero Icon/Image (optional)' :
                     props.variant === 'image_bg' ? 'Background Image' :
                     'Hero Image'}
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
                  <Label htmlFor="imageOpacity">Overlay Opacity ({props.imageOpacity || 70}%)</Label>
                  <input
                    id="imageOpacity"
                    type="range"
                    min="0"
                    max="100"
                    value={props.imageOpacity || 70}
                    onChange={(e) => handlePropChange('imageOpacity', parseInt(e.target.value))}
                    className="w-full mt-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Adjust the darkness of the overlay on the background image
                  </p>
                </div>
              )}

              {/* Text Styling Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Text Styling</h4>

                {/* Headline Color */}
                <div className="mb-4">
                  <Label htmlFor="headlineColor">Headline Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="headlineColor"
                      type="color"
                      value={props.headlineColor || '#111827'}
                      onChange={(e) => handlePropChange('headlineColor', e.target.value)}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={props.headlineColor || '#111827'}
                      onChange={(e) => handlePropChange('headlineColor', e.target.value)}
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
                    onChange={(e) => handlePropChange('headlineSize', e.target.value)}
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
                      onChange={(e) => handlePropChange('subheadlineColor', e.target.value)}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={props.subheadlineColor || '#4b5563'}
                      onChange={(e) => handlePropChange('subheadlineColor', e.target.value)}
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
                    onChange={(e) => handlePropChange('subheadlineSize', e.target.value)}
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
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Button Styling</h4>

                {/* Button Background Color */}
                <div className="mb-4">
                  <Label htmlFor="buttonBgColor">Button Background Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="buttonBgColor"
                      type="color"
                      value={props.buttonBgColor || '#2563eb'}
                      onChange={(e) => handlePropChange('buttonBgColor', e.target.value)}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={props.buttonBgColor || '#2563eb'}
                      onChange={(e) => handlePropChange('buttonBgColor', e.target.value)}
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
                      onChange={(e) => handlePropChange('buttonTextColor', e.target.value)}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={props.buttonTextColor || '#ffffff'}
                      onChange={(e) => handlePropChange('buttonTextColor', e.target.value)}
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
                  { key: 'description', label: 'Description', type: 'textarea' },
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
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Background Image</h4>
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
                        <Label htmlFor="backgroundOpacity">Overlay Opacity ({props.backgroundOpacity || 70}%)</Label>
                        <input
                          id="backgroundOpacity"
                          type="range"
                          min="0"
                          max="100"
                          value={props.backgroundOpacity || 70}
                          onChange={(e) => handlePropChange('backgroundOpacity', parseInt(e.target.value))}
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
                            onChange={(e) => handlePropChange('bgColor', e.target.value)}
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={props.bgColor || '#000000'}
                            onChange={(e) => handlePropChange('bgColor', e.target.value)}
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
                onChange={(testimonials) => handlePropChange('testimonials', testimonials)}
              />

              {/* Background Image Section */}
              {currentProject && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Background Image</h4>
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
                        <Label htmlFor="backgroundOpacity">Overlay Opacity ({props.backgroundOpacity || 70}%)</Label>
                        <input
                          id="backgroundOpacity"
                          type="range"
                          min="0"
                          max="100"
                          value={props.backgroundOpacity || 70}
                          onChange={(e) => handlePropChange('backgroundOpacity', parseInt(e.target.value))}
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
                            onChange={(e) => handlePropChange('bgColor', e.target.value)}
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={props.bgColor || '#000000'}
                            onChange={(e) => handlePropChange('bgColor', e.target.value)}
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
                onChange={(questions) => handlePropChange('questions', questions)}
              />

              {/* Background Image Section */}
              {currentProject && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Background Image</h4>
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
                        <Label htmlFor="backgroundOpacity">Overlay Opacity ({props.backgroundOpacity || 70}%)</Label>
                        <input
                          id="backgroundOpacity"
                          type="range"
                          min="0"
                          max="100"
                          value={props.backgroundOpacity || 70}
                          onChange={(e) => handlePropChange('backgroundOpacity', parseInt(e.target.value))}
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
                            onChange={(e) => handlePropChange('bgColor', e.target.value)}
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={props.bgColor || '#000000'}
                            onChange={(e) => handlePropChange('bgColor', e.target.value)}
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
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Button Customization</h4>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="buttonUrl">Button Link (Scroll to Section)</Label>
                    <select
                      id="buttonUrl"
                      value={props.buttonUrl || '#'}
                      onChange={(e) => handlePropChange('buttonUrl', e.target.value)}
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="#">Top of Page</option>
                      {allElements
                        .filter((el) => el.type !== 'announcement_bar' && el.type !== 'navigation')
                        .map((el) => (
                          <option key={el.id} value={`#${el.type}-${el.order}`}>
                            {el.type.charAt(0).toUpperCase() + el.type.slice(1).replace('_', ' ')} (Position {el.order + 1})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="buttonColor">Button Background Color</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="buttonColor"
                        type="color"
                        value={props.buttonColor || '#ffffff'}
                        onChange={(e) => handlePropChange('buttonColor', e.target.value)}
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        value={props.buttonColor || '#ffffff'}
                        onChange={(e) => handlePropChange('buttonColor', e.target.value)}
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
                        onChange={(e) => handlePropChange('buttonTextColor', e.target.value)}
                        className="w-20 h-10 p-1"
                      />
                      <Input
                        value={props.buttonTextColor || '#111827'}
                        onChange={(e) => handlePropChange('buttonTextColor', e.target.value)}
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
                      onChange={(e) => handlePropChange('buttonSize', e.target.value)}
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
                      onChange={(e) => handlePropChange('buttonFontSize', e.target.value)}
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

              {/* Background Image Section */}
              {currentProject && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Background Image</h4>
                  <Label>Background Image (optional)</Label>
                  <ImageUpload
                    value={props.backgroundImage || ''}
                    onChange={(url) => handlePropChange('backgroundImage', url)}
                    userId={currentProject.user_id}
                    maxSizeMB={5}
                  />
                  {props.backgroundImage && (
                    <div className="mt-4">
                      <Label htmlFor="backgroundOpacity">Overlay Opacity ({props.backgroundOpacity || 70}%)</Label>
                      <input
                        id="backgroundOpacity"
                        type="range"
                        min="0"
                        max="100"
                        value={props.backgroundOpacity || 70}
                        onChange={(e) => handlePropChange('backgroundOpacity', parseInt(e.target.value))}
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
                  onChange={(e) => handlePropChange('showCountdown', e.target.checked)}
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
                      onChange={(e) => handlePropChange('countdownLabel', e.target.value)}
                      placeholder="Ends in:"
                    />
                  </div>
                  <div>
                    <Label htmlFor="countdownEndDate">End Date & Time</Label>
                    <Input
                      id="countdownEndDate"
                      type="datetime-local"
                      value={props.countdownEndDate ? new Date(props.countdownEndDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => handlePropChange('countdownEndDate', new Date(e.target.value).toISOString())}
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
                    onChange={(e) => handlePropChange('bgColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.bgColor || '#ef4444'}
                    onChange={(e) => handlePropChange('bgColor', e.target.value)}
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
                    onChange={(e) => handlePropChange('textColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.textColor || '#ffffff'}
                    onChange={(e) => handlePropChange('textColor', e.target.value)}
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
                  onChange={(e) => handlePropChange('isSticky', e.target.checked)}
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
                  onChange={(e) => handlePropChange('showCloseButton', e.target.checked)}
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
          .filter(el => el.type !== 'navigation' && el.type !== 'announcement_bar')
          .map((el, index) => ({
            value: `#${el.type}-${el.order}`,
            label: `${el.type.charAt(0).toUpperCase() + el.type.slice(1).replace('_', ' ')} (Position ${el.order + 1})`
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
                      const newMenuItem = { label: 'New Item', url: sectionOptions[0]?.value || '#' };
                      handlePropChange('menuItems', [...(props.menuItems || []), newMenuItem]);
                    }}
                    className="h-7 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add
                  </Button>
                </div>

                <div className="space-y-2">
                  {(!props.menuItems || props.menuItems.length === 0) ? (
                    <p className="text-xs text-gray-500 text-center py-4">
                      No menu items. Click "Add" to create one.
                    </p>
                  ) : (
                    props.menuItems.map((item: any, index: number) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                          <button
                            onClick={() => {
                              const newMenuItems = props.menuItems.filter((_: any, i: number) => i !== index);
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
                                newMenuItems[index] = { ...item, label: e.target.value };
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
                                newMenuItems[index] = { ...item, url: e.target.value };
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
                        handlePropChange('ctaButton', { text: 'Get Started', url: '#' });
                      } else {
                        handlePropChange('ctaButton', null);
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="showCTA" className="cursor-pointer font-semibold">
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
                        onChange={(e) => handlePropChange('ctaButton', { ...props.ctaButton, text: e.target.value })}
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <Label htmlFor="ctaUrl">CTA URL</Label>
                      <Input
                        id="ctaUrl"
                        value={props.ctaButton.url || ''}
                        onChange={(e) => handlePropChange('ctaButton', { ...props.ctaButton, url: e.target.value })}
                        placeholder="#"
                      />
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
                    onChange={(e) => handlePropChange('bgColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) => handlePropChange('bgColor', e.target.value)}
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
                    onChange={(e) => handlePropChange('textColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.textColor || '#111827'}
                    onChange={(e) => handlePropChange('textColor', e.target.value)}
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
                  onChange={(e) => handlePropChange('isSticky', e.target.checked)}
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
                    onChange={(e) => handlePropChange('enablePaymentIntegration', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="enablePaymentIntegration" className="cursor-pointer font-semibold">
                    Enable LeanX Payment Gateway
                  </Label>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  When enabled, plan buttons will process payments via LeanX instead of redirecting to URLs
                </p>
              </div>

              {/* Product Selector for Pricing Plans */}
              {currentProject && (
                <div className="border border-gray-300 rounded-md p-3 bg-blue-50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Add from Inventory</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    Select products from your inventory to create pricing plans or{' '}
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
                      const newPlans = [...(props.plans || []), {
                        name: product.name,
                        price: product.base_price.toString(),
                        currency: product.currency,
                        description: product.description || '',
                        features: product.description ? product.description.split('\n').filter((f: string) => f.trim()) : [],
                        buttonText: 'Buy Now',
                        buttonUrl: '#',
                        highlighted: false,
                        enablePayment: props.enablePaymentIntegration || false,
                        productId: product.id,
                        priceNumeric: product.base_price,
                        stock: product.stock,
                      }];
                      handlePropChange('plans', newPlans);
                    }}
                  />
                </div>
              )}

              {/* Plans List (Read-only with remove option) */}
              {(props.plans || []).length > 0 && (
                <div className="border border-gray-300 rounded-md p-3 mt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Added Products/Plans</h4>
                  <div className="space-y-3">
                    {(props.plans || []).map((plan: any, planIndex: number) => (
                      <div key={planIndex} className="border border-gray-200 rounded-md p-3 bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-semibold text-gray-900">{plan.name}</h5>
                          <button
                            type="button"
                            onClick={() => {
                              const newPlans = (props.plans || []).filter((_: any, i: number) => i !== planIndex);
                              handlePropChange('plans', newPlans);
                            }}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="space-y-1 text-xs text-gray-600">
                          <p><strong>Price:</strong> {plan.currency || 'RM'} {plan.price || plan.priceNumeric}</p>
                          {plan.description && <p><strong>Description:</strong> {plan.description}</p>}
                          {plan.features && plan.features.length > 0 && (
                            <div>
                              <strong>Features:</strong>
                              <ul className="list-disc list-inside ml-2 mt-1">
                                {plan.features.map((feature: string, idx: number) => (
                                  <li key={idx}>{feature}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    To edit product details, go to the{' '}
                    <a href="/dashboard/products" target="_blank" className="text-blue-600 hover:underline">
                      Products page
                    </a>
                  </p>
                </div>
              )}

              {/* Background Image Section */}
              {currentProject && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Background Image</h4>
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
                        <Label htmlFor="backgroundOpacity">Overlay Opacity ({props.backgroundOpacity || 70}%)</Label>
                        <input
                          id="backgroundOpacity"
                          type="range"
                          min="0"
                          max="100"
                          value={props.backgroundOpacity || 70}
                          onChange={(e) => handlePropChange('backgroundOpacity', parseInt(e.target.value))}
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
                            onChange={(e) => handlePropChange('bgColor', e.target.value)}
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={props.bgColor || '#000000'}
                            onChange={(e) => handlePropChange('bgColor', e.target.value)}
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
                  onChange={(e) => handlePropChange('description', e.target.value)}
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
                  onChange={(e) => handlePropChange('copyright', e.target.value)}
                  placeholder="© 2024 Your Company. All rights reserved."
                />
              </div>

              <ArrayEditor
                title="Link Columns"
                items={props.columns || []}
                schema={[
                  { key: 'title', label: 'Column Title', type: 'text' },
                ]}
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
                onChange={(socialLinks) => handlePropChange('socialLinks', socialLinks)}
              />

              <div>
                <Label htmlFor="bgColor">Background Color</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    id="bgColor"
                    type="color"
                    value={props.bgColor || '#1f2937'}
                    onChange={(e) => handlePropChange('bgColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.bgColor || '#1f2937'}
                    onChange={(e) => handlePropChange('bgColor', e.target.value)}
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
                    onChange={(e) => handlePropChange('textColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.textColor || '#ffffff'}
                    onChange={(e) => handlePropChange('textColor', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              {/* Background Image Section */}
              {currentProject && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Background Image</h4>
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
                        <Label htmlFor="backgroundOpacity">Overlay Opacity ({props.backgroundOpacity || 70}%)</Label>
                        <input
                          id="backgroundOpacity"
                          type="range"
                          min="0"
                          max="100"
                          value={props.backgroundOpacity || 70}
                          onChange={(e) => handlePropChange('backgroundOpacity', parseInt(e.target.value))}
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
                            onChange={(e) => handlePropChange('bgColor', e.target.value)}
                            className="w-20 h-10 p-1"
                          />
                          <Input
                            value={props.bgColor || '#000000'}
                            onChange={(e) => handlePropChange('bgColor', e.target.value)}
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
              <div className="font-semibold text-sm text-gray-700 mb-2">Products</div>

              {/* Product Selector from Database */}
              {currentProject && (
                <div className="border border-gray-300 rounded-md p-3 bg-blue-50">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Add from Inventory</h4>
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
                      const newProducts = [...(props.products || []), {
                        id: product.id,
                        name: product.name,
                        description: product.description || '',
                        price: product.base_price,
                        currency: product.currency,
                        image: product.image_url || '',
                        stock: product.stock,
                        featured: false,
                      }];
                      handlePropChange('products', newProducts);
                    }}
                  />
                </div>
              )}

              {/* Products List (Read-only with remove option) */}
              {currentProject && (props.products || []).length > 0 && (
                <div className="border border-gray-300 rounded-md p-3 mt-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Added Products</h4>
                  <div className="space-y-2">
                    {(props.products || []).map((product: any, index: number) => (
                      <div key={product.id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200">
                        <div className="flex items-center gap-2 flex-1">
                          {product.image && (
                            <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              {product.currency || 'RM'} {typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                              {product.stock !== undefined && ` • Stock: ${product.stock}`}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newProducts = (props.products || []).filter((_: any, i: number) => i !== index);
                            handlePropChange('products', newProducts);
                          }}
                          className="text-xs text-red-600 hover:text-red-800 ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    To edit product details, go to the{' '}
                    <a href="/dashboard/products" target="_blank" className="text-blue-600 hover:underline">
                      Products page
                    </a>
                  </p>
                </div>
              )}

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">Button Styling</div>

              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={props.buttonText || ''}
                  onChange={(e) => handlePropChange('buttonText', e.target.value)}
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
                    onChange={(e) => handlePropChange('buttonColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.buttonColor || '#3b82f6'}
                    onChange={(e) => handlePropChange('buttonColor', e.target.value)}
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
                  onChange={(e) => handlePropChange('buttonSize', e.target.value)}
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
                    onChange={(e) => handlePropChange('bgColor', e.target.value)}
                    className="w-20 h-10 p-1"
                  />
                  <Input
                    value={props.bgColor || '#ffffff'}
                    onChange={(e) => handlePropChange('bgColor', e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">Bump Offer (Upsell)</div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="enableBumpOffer"
                  checked={props.enableBumpOffer || false}
                  onChange={(e) => handlePropChange('enableBumpOffer', e.target.checked)}
                  className="w-4 h-4"
                />
                <Label htmlFor="enableBumpOffer" className="cursor-pointer">
                  Enable Bump Offer
                </Label>
              </div>

              {props.enableBumpOffer && (
                <>
                  <div>
                    <Label htmlFor="bumpOfferName">Bump Offer Name</Label>
                    <Input
                      id="bumpOfferName"
                      value={props.bumpOfferName || ''}
                      onChange={(e) => handlePropChange('bumpOfferName', e.target.value)}
                      placeholder="VIP Membership"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bumpOfferDescription">Bump Offer Description</Label>
                    <Input
                      id="bumpOfferDescription"
                      value={props.bumpOfferDescription || ''}
                      onChange={(e) => handlePropChange('bumpOfferDescription', e.target.value)}
                      placeholder="Get exclusive access for 50% OFF"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="bumpOfferAmount">Price</Label>
                      <Input
                        id="bumpOfferAmount"
                        type="number"
                        step="0.01"
                        value={props.bumpOfferAmount || 0}
                        onChange={(e) => handlePropChange('bumpOfferAmount', parseFloat(e.target.value) || 0)}
                        placeholder="197.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bumpOfferDiscount">Discount %</Label>
                      <Input
                        id="bumpOfferDiscount"
                        type="number"
                        value={props.bumpOfferDiscount || 0}
                        onChange={(e) => handlePropChange('bumpOfferDiscount', parseInt(e.target.value) || 0)}
                        placeholder="50"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="font-semibold text-sm text-gray-700 mb-2 mt-6">Messages</div>

              <div>
                <Label htmlFor="successMessage">Success Message</Label>
                <Input
                  id="successMessage"
                  value={props.successMessage || ''}
                  onChange={(e) => handlePropChange('successMessage', e.target.value)}
                  placeholder="Payment successful!"
                />
              </div>

              <div>
                <Label htmlFor="failureMessage">Failure Message</Label>
                <Input
                  id="failureMessage"
                  value={props.failureMessage || ''}
                  onChange={(e) => handlePropChange('failureMessage', e.target.value)}
                  placeholder="Payment failed. Please try again."
                />
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
        <Button
          variant="outline"
          className="w-full"
          onClick={handleDuplicate}
        >
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
