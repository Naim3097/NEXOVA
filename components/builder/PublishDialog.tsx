'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Check, Copy, ExternalLink, Loader2 } from 'lucide-react';

interface PublishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  currentPublishedUrl?: string | null;
  subscriptionPlan?: 'free' | 'pro';
  userSubdomain?: string | null;
  autoPublish?: boolean; // If true, automatically publish when dialog opens
}

export const PublishDialog = ({
  open,
  onOpenChange,
  projectId,
  projectName,
  currentPublishedUrl,
  subscriptionPlan = 'free',
  userSubdomain,
  autoPublish = false,
}: PublishDialogProps) => {
  const [publishing, setPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(
    currentPublishedUrl || null
  );
  const [urlType, setUrlType] = useState<'path' | 'subdomain' | 'custom'>('path');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [hasAutoPublished, setHasAutoPublished] = useState(false);

  const isPro = subscriptionPlan === 'pro';

  // Auto-publish when dialog opens if autoPublish is true and page is already published
  React.useEffect(() => {
    if (open && autoPublish && currentPublishedUrl && !hasAutoPublished && !publishing) {
      setHasAutoPublished(true);
      handlePublish();
    }
    // Reset when dialog closes
    if (!open) {
      setHasAutoPublished(false);
    }
  }, [open, autoPublish, currentPublishedUrl, hasAutoPublished, publishing]);

  const handlePublish = async () => {
    try {
      setPublishing(true);
      setError(null);

      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish');
      }

      setPublishedUrl(data.publishedUrl);
      setUrlType(data.urlType || 'path');
    } catch (err) {
      console.error('Publish error:', err);
      setError(err instanceof Error ? err.message : 'Failed to publish project');
    } finally {
      setPublishing(false);
    }
  };

  const handleCopyUrl = async () => {
    if (!publishedUrl) return;

    try {
      await navigator.clipboard.writeText(publishedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleVisit = () => {
    if (!publishedUrl) return;
    window.open(publishedUrl, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Publish Project</DialogTitle>
          <DialogDescription>
            {publishedUrl
              ? 'Your project is live!'
              : 'Make your project publicly accessible'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!publishedUrl ? (
            /* Pre-publish state */
            <>
              <div className={`${isPro ? 'bg-purple-50 border-purple-200' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4`}>
                <h4 className={`font-semibold mb-2 ${isPro ? 'text-purple-900' : 'text-blue-900'}`}>
                  Ready to publish "{projectName}"?
                </h4>
                <p className={`text-sm mb-2 ${isPro ? 'text-purple-700' : 'text-blue-700'}`}>
                  Your landing page will be generated and made publicly accessible.
                  You can unpublish or update it anytime.
                </p>

                {userSubdomain ? (
                  <div className={`mt-3 pt-3 border-t ${isPro ? 'border-purple-200' : 'border-blue-200'}`}>
                    <p className={`text-sm font-medium mb-1 ${isPro ? 'text-purple-900' : 'text-blue-900'}`}>
                      {isPro ? '✨ Your Subdomain:' : '📍 Your Subdomain:'}
                    </p>
                    <p className={`text-sm mb-2 ${isPro ? 'text-purple-700' : 'text-blue-700'}`}>
                      Your page will be published at: <span className="font-mono font-semibold">{userSubdomain}.yourdomain.com</span>
                    </p>
                    {!isPro && (
                      <p className="text-xs text-blue-600">
                        💡 Upgrade to Pro for custom domains like <span className="font-mono">www.yourdomain.com</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      📍 Publishing URL:
                    </p>
                    <p className="text-sm text-gray-700">
                      Your page will be published with a unique URL.
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="flex-1"
                >
                  {publishing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    'Publish Now'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={publishing}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            /* Post-publish state */
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-green-900 mb-1">
                      Published Successfully!
                    </h4>
                    <p className="text-sm text-green-700">
                      Your page is now live and accessible to anyone.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center justify-between">
                  <span>Published URL</span>
                  {urlType === 'subdomain' && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                      SUBDOMAIN
                    </span>
                  )}
                  {urlType === 'custom' && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">
                      CUSTOM DOMAIN
                    </span>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={publishedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyUrl}
                    title="Copy URL"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {!isPro && (
                  <p className="text-xs text-gray-600 mt-2">
                    💡 <a href="/pricing" className="text-blue-600 hover:underline">Upgrade to Pro</a> for custom domains like <span className="font-mono">www.yourdomain.com</span>, unlimited projects, and advanced features
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleVisit}
                  className="flex-1"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Close
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Share this URL with your audience or embed it on your website
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
