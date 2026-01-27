'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
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
  data?: any;
}

interface TemplateCardProps {
  template: Template;
  onPreview: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
}

export function TemplateCard({
  template,
  onPreview,
  onUseTemplate,
}: TemplateCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        {!imageError ? (
          <img
            src={template.thumbnail_url}
            alt={template.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <div className="text-center">
              <div className="text-4xl mb-2">
                {getCategoryIcon(template.category)}
              </div>
              <p className="text-sm text-muted-foreground">{template.name}</p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-background/90 backdrop-blur-sm rounded-full text-xs font-medium">
            {template.industry}
          </span>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {template.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {template.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          size="sm"
          onClick={() => onPreview(template)}
        >
          Preview
        </Button>
        <Button
          variant="teal"
          className="flex-1"
          size="sm"
          onClick={() => onUseTemplate(template)}
        >
          Use Template
        </Button>
      </CardFooter>
    </Card>
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
