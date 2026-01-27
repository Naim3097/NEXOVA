'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { TemplateCard } from '@/components/templates/TemplateCard';
import { TemplatePreviewModal } from '@/components/templates/TemplatePreviewModal';
import { supabase } from '@/lib/supabase/auth-client';
import { BuilderSidebar } from '@/components/builder/BuilderSidebar';

interface Template {
  id: string;
  name: string;
  slug: string;
  category: string;
  industry: string;
  description: string;
  thumbnail_url: string;
  preview_url: string;
  tags: string[];
  usage_count: number;
  data?: any;
}

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_public', true)
        .order('usage_count', { ascending: false });

      if (error) throw error;

      setTemplates(data || []);
    } catch (err) {
      console.error('Error fetching templates:', err);
      setError('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'ebook', label: 'Ebook' },
    { value: 'ecommerce', label: 'E-commerce' },
  ];

  // Filter by category
  let filteredTemplates =
    selectedCategory === 'all'
      ? templates
      : templates.filter((t) => t.category === selectedCategory);

  // Filter by search query
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredTemplates = filteredTemplates.filter(
      (t) =>
        t.name.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.industry.toLowerCase().includes(query) ||
        t.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  const handlePreview = (template: Template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const handleUseTemplate = (template: Template) => {
    // TODO: Create project from template
    console.log('Using template:', template.slug);
    // For now, just navigate to a placeholder
    router.push(`/projects/new?template=${template.slug}`);
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <BuilderSidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-background">
          {/* Header */}
          <div className="border-b border-[#E2E8F0] bg-card">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-2 text-[#455263] tracking-tight">
                Template Gallery
              </h1>
              <p className="text-muted-foreground">
                Choose a professionally designed template to start building your
                landing page
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-background border rounded-xl border-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-[#5FC7CD] focus:border-[#5FC7CD]"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 font-medium transition-colors ${
                      selectedCategory === category.value
                        ? 'bg-[#455263] text-white rounded-xl'
                        : 'bg-white border border-[#E2E8F0] text-[#455263] hover:bg-[#F8FAFC] rounded-xl'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Templates Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5FC7CD]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-destructive">{error}</p>
                <button
                  onClick={fetchTemplates}
                  className="mt-4 px-4 py-2 bg-[#455263] text-white rounded-xl"
                >
                  Try Again
                </button>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground mb-2">
                  {searchQuery
                    ? `No templates found matching "${searchQuery}"`
                    : 'No templates found in this category'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-primary hover:underline text-sm"
                  >
                    Clear search
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onPreview={handlePreview}
                    onUseTemplate={handleUseTemplate}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Preview Modal */}
          <TemplatePreviewModal
            template={previewTemplate}
            open={showPreview}
            onClose={() => setShowPreview(false)}
            onUseTemplate={handleUseTemplate}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
}
