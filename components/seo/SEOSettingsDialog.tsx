'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { SEOSettings } from '@/types';
import { X, Plus, Trash2, Globe, Search, Share2 } from 'lucide-react';

interface SEOSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  currentSettings: SEOSettings;
  onSave: (settings: SEOSettings) => Promise<void>;
}

export function SEOSettingsDialog({
  open,
  onOpenChange,
  projectId,
  currentSettings,
  onSave,
}: SEOSettingsDialogProps) {
  const [settings, setSettings] = useState<SEOSettings>(currentSettings);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'advanced'>('basic');

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(settings);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save SEO settings:', error);
      alert('Failed to save SEO settings');
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    setSettings({
      ...settings,
      keywords: [...(settings.keywords || []), ''],
    });
  };

  const updateKeyword = (index: number, value: string) => {
    const newKeywords = [...(settings.keywords || [])];
    newKeywords[index] = value;
    setSettings({ ...settings, keywords: newKeywords });
  };

  const removeKeyword = (index: number) => {
    const newKeywords = (settings.keywords || []).filter((_, i) => i !== index);
    setSettings({ ...settings, keywords: newKeywords });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-600" />
            <h2 className="text-xl font-semibold">SEO Settings</h2>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b px-6">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'basic'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Basic SEO
              </div>
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'social'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Social Media
              </div>
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`py-3 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'advanced'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Advanced
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Page Title */}
              <div>
                <Label htmlFor="title">Page Title *</Label>
                <Input
                  id="title"
                  value={settings.title}
                  onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                  placeholder="Your Page Title"
                  maxLength={60}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {settings.title.length}/60 characters (recommended: 50-60)
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <Label htmlFor="description">Meta Description *</Label>
                <textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  placeholder="A brief description of your page"
                  maxLength={160}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {settings.description.length}/160 characters (recommended: 150-160)
                </p>
              </div>

              {/* Keywords */}
              <div>
                <Label>Keywords (Optional)</Label>
                <p className="text-xs text-gray-500 mb-2">
                  Add relevant keywords for your page
                </p>
                <div className="space-y-2">
                  {(settings.keywords || []).map((keyword, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={keyword}
                        onChange={(e) => updateKeyword(index, e.target.value)}
                        placeholder="Enter keyword"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeKeyword(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addKeyword}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Keyword
                  </Button>
                </div>
              </div>

              {/* Language */}
              <div>
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div className="space-y-6">
              {/* Open Graph */}
              <Card className="p-4 bg-blue-50 border-blue-200">
                <h3 className="font-semibold text-sm mb-3 text-blue-900">Open Graph (Facebook)</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ogTitle">OG Title</Label>
                    <Input
                      id="ogTitle"
                      value={settings.ogTitle || ''}
                      onChange={(e) => setSettings({ ...settings, ogTitle: e.target.value })}
                      placeholder={settings.title}
                    />
                    <p className="text-xs text-gray-600 mt-1">Leave blank to use page title</p>
                  </div>

                  <div>
                    <Label htmlFor="ogDescription">OG Description</Label>
                    <textarea
                      id="ogDescription"
                      value={settings.ogDescription || ''}
                      onChange={(e) =>
                        setSettings({ ...settings, ogDescription: e.target.value })
                      }
                      placeholder={settings.description}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Leave blank to use meta description
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="ogImage">OG Image URL</Label>
                    <Input
                      id="ogImage"
                      value={settings.ogImage || ''}
                      onChange={(e) => setSettings({ ...settings, ogImage: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                    <p className="text-xs text-gray-600 mt-1">
                      Recommended: 1200x630px (1.91:1 ratio)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="ogType">OG Type</Label>
                    <select
                      id="ogType"
                      value={settings.ogType}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          ogType: e.target.value as 'website' | 'article' | 'product',
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="website">Website</option>
                      <option value="article">Article</option>
                      <option value="product">Product</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Twitter Card */}
              <Card className="p-4 bg-sky-50 border-sky-200">
                <h3 className="font-semibold text-sm mb-3 text-sky-900">Twitter Card</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="twitterCard">Card Type</Label>
                    <select
                      id="twitterCard"
                      value={settings.twitterCard}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          twitterCard: e.target.value as 'summary' | 'summary_large_image',
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="twitterSite">Twitter Handle</Label>
                    <Input
                      id="twitterSite"
                      value={settings.twitterSite || ''}
                      onChange={(e) => setSettings({ ...settings, twitterSite: e.target.value })}
                      placeholder="@yourhandle"
                    />
                    <p className="text-xs text-gray-600 mt-1">Your Twitter/X username</p>
                  </div>
                </div>
              </Card>

              <p className="text-xs text-gray-500">
                Twitter will use Open Graph title, description, and image if not separately
                specified.
              </p>
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              {/* Canonical URL */}
              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  value={settings.canonicalUrl || ''}
                  onChange={(e) => setSettings({ ...settings, canonicalUrl: e.target.value })}
                  placeholder="https://example.com/page"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Specify the preferred URL for this page to avoid duplicate content issues
                </p>
              </div>

              {/* Robots Settings */}
              <Card className="p-4">
                <h3 className="font-semibold text-sm mb-3">Search Engine Indexing</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.robotsIndex}
                      onChange={(e) =>
                        setSettings({ ...settings, robotsIndex: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Allow search engines to index this page</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.robotsFollow}
                      onChange={(e) =>
                        setSettings({ ...settings, robotsFollow: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Allow search engines to follow links</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Uncheck these if you don't want this page to appear in search results
                </p>
              </Card>

              {/* Preview */}
              <Card className="p-4 bg-gray-50">
                <h3 className="font-semibold text-sm mb-3">Search Engine Preview</h3>
                <div className="space-y-1">
                  <p className="text-blue-600 text-lg">{settings.title || 'Page Title'}</p>
                  <p className="text-green-700 text-xs">
                    {settings.canonicalUrl || 'https://yourdomain.com/page'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {settings.description || 'Page description will appear here...'}
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}
