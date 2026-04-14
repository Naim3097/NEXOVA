'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog';
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
  const [iframeLoading, setIframeLoading] = useState(true);

  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col rounded-2xl border-[#E2E8F0] p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-lg font-semibold text-[#455263]">
              {template.name}
            </h2>
            <p className="text-sm text-[#969696]">{template.description}</p>
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex-1 relative bg-[#F8FAFC] overflow-hidden">
          {iframeLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-[#5FC7CD] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-[#969696]">Loading preview...</p>
              </div>
            </div>
          )}
          <iframe
            src={`/api/templates/${template.id}/preview`}
            className="w-full h-full border-0"
            onLoad={() => setIframeLoading(false)}
            title={`${template.name} preview`}
          />
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-4 border-t border-[#E2E8F0]">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="teal" onClick={() => onUseTemplate(template)}>
            Use This Template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
