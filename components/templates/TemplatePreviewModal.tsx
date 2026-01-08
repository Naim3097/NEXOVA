'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  data?: {
    elements?: Array<{
      type: string;
      props: Record<string, any>;
    }>;
    seo_settings?: {
      title?: string;
      description?: string;
    };
    theme?: {
      primaryColor?: string;
      fontFamily?: string;
    };
  };
}

interface TemplatePreviewModalProps {
  template: Template | null;
  open: boolean;
  onClose: () => void;
  onUseTemplate: (template: Template) => void;
}

export function TemplatePreviewModal({
  template,
  open,
  onClose,
  onUseTemplate,
}: TemplatePreviewModalProps) {
  const [imageError, setImageError] = useState(false);

  if (!template) return null;

  const elementCount = template.data?.elements?.length || 0;
  const sections = template.data?.elements?.map((el) => el.type).join(', ') || '';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>{template.description}</DialogDescription>
        </DialogHeader>

        {/* Preview Image */}
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
          {!imageError ? (
            <img
              src={template.preview_url}
              alt={`${template.name} preview`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {getCategoryIcon(template.category)}
                </div>
                <p className="text-lg font-medium">{template.name}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Preview coming soon
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Template Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">Details</h4>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Industry:</dt>
                <dd className="font-medium">{template.industry}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Category:</dt>
                <dd className="font-medium capitalize">{template.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Sections:</dt>
                <dd className="font-medium">{elementCount}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Used by:</dt>
                <dd className="font-medium">{template.usage_count} projects</dd>
              </div>
            </dl>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Included Sections</h4>
            <div className="flex flex-wrap gap-1">
              {template.data?.elements?.map((element, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-muted rounded text-xs capitalize"
                >
                  {element.type}
                </span>
              )) || (
                <p className="text-xs text-muted-foreground">
                  Hero, Features, Testimonials, FAQ, CTA
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="mb-4">
          <h4 className="font-semibold text-sm mb-2">Tags</h4>
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Theme Colors */}
        {template.data?.theme && (
          <div className="mb-4">
            <h4 className="font-semibold text-sm mb-2">Theme</h4>
            <div className="flex gap-4 text-sm">
              {template.data.theme.primaryColor && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded border"
                    style={{
                      backgroundColor: template.data.theme.primaryColor,
                    }}
                  />
                  <span className="text-muted-foreground">
                    {template.data.theme.primaryColor}
                  </span>
                </div>
              )}
              {template.data.theme.fontFamily && (
                <div className="text-muted-foreground">
                  Font: {template.data.theme.fontFamily}
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => onUseTemplate(template)}>
            Use This Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    saas: '💻',
    ecommerce: '🛍️',
    course: '📚',
    leadgen: '🎯',
    event: '🎉',
    portfolio: '🎨',
  };
  return icons[category] || '📄';
}
