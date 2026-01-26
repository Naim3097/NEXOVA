'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { HelpCircle, Loader2, CheckCircle, MessageSquare } from 'lucide-react';
import { getCsrfToken } from '@/lib/csrf';

interface HelpButtonProps {
  pageSource?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  showText?: boolean;
}

export function HelpButton({
  pageSource,
  variant = 'outline',
  size = 'sm',
  className = '',
  showText = true,
}: HelpButtonProps) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      setError('Please describe your issue or question.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/help/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': getCsrfToken(),
        },
        body: JSON.stringify({
          request_type: 'help',
          subject: subject || 'Help Request',
          message,
          page_source: pageSource,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit help request');
      }

      setSuccess(true);
      setSubject('');
      setMessage('');

      // Auto-close after 3 seconds
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error submitting help request:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to submit help request'
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubject('');
    setMessage('');
    setError(null);
    setSuccess(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <HelpCircle className="h-4 w-4" />
          {showText && <span className="ml-2">Need Help?</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Request Submitted!</h3>
            <p className="text-gray-600">
              Thank you for reaching out. Our team will get back to you soon.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Get Help
              </DialogTitle>
              <DialogDescription>
                Having trouble or need assistance? Describe your issue and our
                team will help you.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject (Optional)</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  How can we help? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your issue or question in detail..."
                  rows={5}
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
