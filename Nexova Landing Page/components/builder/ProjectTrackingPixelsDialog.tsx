'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/auth-client';
import { Save, Eye, EyeOff, Info, RotateCcw } from 'lucide-react';

interface TrackingPixelsConfig {
  facebook?: {
    enabled: boolean;
    pixelId: string | null;
    enableConversionsAPI?: boolean;
    conversionsAPIToken?: string | null;
    enableAdvancedMatching?: boolean;
    testEventCode?: string | null;
  };
  tiktok?: {
    enabled: boolean;
    pixelId: string | null;
    enableEventsAPI?: boolean;
  };
  google_ads?: {
    enabled: boolean;
    tagId: string | null;
    conversionLabel?: string | null;
  };
  google_analytics?: {
    enabled: boolean;
    measurementId: string | null;
  };
}

interface ProjectTrackingPixelsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export function ProjectTrackingPixelsDialog({
  open,
  onOpenChange,
  projectId,
}: ProjectTrackingPixelsDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [useCustomPixels, setUseCustomPixels] = useState(false);
  const [accountDefaults, setAccountDefaults] =
    useState<TrackingPixelsConfig | null>(null);
  const [customConfig, setCustomConfig] = useState<TrackingPixelsConfig | null>(
    null
  );
  const [showFacebookPixel, setShowFacebookPixel] = useState(false);
  const [showFacebookAPIToken, setShowFacebookAPIToken] = useState(false);
  const [showTikTokPixel, setShowTikTokPixel] = useState(false);

  useEffect(() => {
    if (open) {
      loadConfiguration();
    }
  }, [open, projectId]);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch account defaults
      const { data: profile } = await supabase
        .from('profiles')
        .select('tracking_pixels')
        .eq('id', user.id)
        .single();

      setAccountDefaults(profile?.tracking_pixels || null);

      // Fetch project override
      const { data: project } = await supabase
        .from('projects')
        .select('tracking_pixels_override')
        .eq('id', projectId)
        .single();

      if (project?.tracking_pixels_override) {
        setUseCustomPixels(true);
        setCustomConfig(project.tracking_pixels_override);
      } else {
        setUseCustomPixels(false);
        setCustomConfig(profile?.tracking_pixels || null);
      }
    } catch (error) {
      console.error('Error loading tracking pixels:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tracking pixels configuration',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          tracking_pixels_override: useCustomPixels ? customConfig : null,
        })
        .eq('id', projectId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: useCustomPixels
          ? 'Custom tracking pixels saved for this project'
          : 'Project now uses account default pixels',
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error saving tracking pixels:', error);
      toast({
        title: 'Error',
        description: 'Failed to save tracking pixels',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetToDefaults = () => {
    setCustomConfig(accountDefaults);
    toast({
      title: 'Reset',
      description: 'Configuration reset to account defaults',
    });
  };

  const activeConfig = customConfig || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Tracking Pixels</DialogTitle>
          <DialogDescription>
            Configure tracking pixels for this specific project
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Use Custom Pixels Toggle */}
            <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <div>
                <h3 className="font-semibold text-[#455263]">
                  Use Custom Pixels for This Project
                </h3>
                <p className="text-sm text-[#969696]">
                  Override account defaults with project-specific configuration
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCustomPixels}
                  onChange={(e) => setUseCustomPixels(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-8 bg-[#E2E8F0] peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#5FC7CD]/20 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-[#E2E8F0] after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#5FC7CD]"></div>
              </label>
            </div>

            {/* Info Box */}
            {!useCustomPixels && (
              <div className="flex gap-3 p-4 bg-[#5FC7CD]/10 border border-[#5FC7CD]/20 rounded-xl text-[#455263]">
                <Info className="w-5 h-5 flex-shrink-0 mt-0.5 text-[#5FC7CD]" />
                <div>
                  <p className="font-semibold text-sm">
                    Using Account Defaults
                  </p>
                  <p className="text-sm opacity-90 mt-1">
                    This project is using your account-level pixel
                    configuration. Enable custom pixels above to override.
                  </p>
                </div>
              </div>
            )}

            {useCustomPixels && (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-[#455263]">
                    Custom Configuration
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResetToDefaults}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>

                {/* Facebook Pixel */}
                <div className="border border-[#E2E8F0] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📘</div>
                      <div>
                        <h4 className="font-semibold text-[#455263]">
                          Facebook Pixel
                        </h4>
                        <p className="text-sm text-[#969696]">
                          Track Facebook ad conversions
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeConfig.facebook?.enabled || false}
                        onChange={(e) =>
                          setCustomConfig({
                            ...activeConfig,
                            facebook: {
                              ...activeConfig.facebook,
                              enabled: e.target.checked,
                              pixelId: activeConfig.facebook?.pixelId || null,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#E2E8F0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-[#E2E8F0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5FC7CD]"></div>
                    </label>
                  </div>

                  {activeConfig.facebook?.enabled && (
                    <div className="space-y-4">
                      <div>
                        <Label className="text-[#455263] font-medium">
                          Facebook Pixel ID *
                        </Label>
                        <div className="relative mt-1">
                          <Input
                            type={showFacebookPixel ? 'text' : 'password'}
                            value={activeConfig.facebook?.pixelId || ''}
                            onChange={(e) =>
                              setCustomConfig({
                                ...activeConfig,
                                facebook: {
                                  ...activeConfig.facebook,
                                  enabled: true,
                                  pixelId: e.target.value,
                                },
                              })
                            }
                            placeholder="123456789012345"
                            className="pr-10 rounded-xl border-[#E2E8F0] focus:ring-[#5FC7CD] focus:border-[#5FC7CD]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowFacebookPixel(!showFacebookPixel)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969696] hover:text-[#455263]"
                          >
                            {showFacebookPixel ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-[#969696] mt-1">
                          15-16 digit number from your Facebook Business Manager
                        </p>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              activeConfig.facebook?.enableConversionsAPI ||
                              false
                            }
                            onChange={(e) =>
                              setCustomConfig({
                                ...activeConfig,
                                facebook: {
                                  ...activeConfig.facebook,
                                  enabled: true,
                                  pixelId:
                                    activeConfig.facebook?.pixelId || null,
                                  enableConversionsAPI: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4 rounded border-[#E2E8F0]"
                          />
                          <div>
                            <span className="text-sm font-medium text-[#455263]">
                              Enable Facebook Conversions API
                            </span>
                            <p className="text-xs text-[#969696]">
                              Server-side tracking for better data accuracy
                            </p>
                          </div>
                        </label>

                        {activeConfig.facebook?.enableConversionsAPI && (
                          <div className="ml-7 space-y-4 pt-2 border-l-2 border-[#5FC7CD]/20 pl-4">
                            <div>
                              <Label className="text-[#455263] font-medium">
                                Conversion API Access Token *
                              </Label>
                              <div className="relative mt-1">
                                <Input
                                  type={
                                    showFacebookAPIToken ? 'text' : 'password'
                                  }
                                  value={
                                    activeConfig.facebook
                                      ?.conversionsAPIToken || ''
                                  }
                                  onChange={(e) =>
                                    setCustomConfig({
                                      ...activeConfig,
                                      facebook: {
                                        ...activeConfig.facebook,
                                        enabled: true,
                                        pixelId:
                                          activeConfig.facebook?.pixelId ||
                                          null,
                                        enableConversionsAPI: true,
                                        conversionsAPIToken: e.target.value,
                                      },
                                    })
                                  }
                                  placeholder="EAAb..."
                                  className="pr-10 font-mono text-sm rounded-xl border-[#E2E8F0] focus:ring-[#5FC7CD] focus:border-[#5FC7CD]"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    setShowFacebookAPIToken(
                                      !showFacebookAPIToken
                                    )
                                  }
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969696] hover:text-[#455263]"
                                >
                                  {showFacebookAPIToken ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </button>
                              </div>
                              <p className="text-xs text-[#969696] mt-1">
                                Generate in Events Manager → Settings →
                                Conversions API
                              </p>
                            </div>

                            <div>
                              <Label className="text-[#455263] font-medium">
                                Test Event Code (Optional)
                              </Label>
                              <Input
                                type="text"
                                value={
                                  activeConfig.facebook?.testEventCode || ''
                                }
                                onChange={(e) =>
                                  setCustomConfig({
                                    ...activeConfig,
                                    facebook: {
                                      ...activeConfig.facebook,
                                      enabled: true,
                                      pixelId:
                                        activeConfig.facebook?.pixelId || null,
                                      enableConversionsAPI: true,
                                      conversionsAPIToken:
                                        activeConfig.facebook
                                          ?.conversionsAPIToken || null,
                                      testEventCode: e.target.value,
                                    },
                                  })
                                }
                                placeholder="TEST12345"
                                className="mt-1 rounded-xl border-[#E2E8F0] focus:ring-[#5FC7CD] focus:border-[#5FC7CD]"
                              />
                              <p className="text-xs text-[#969696] mt-1">
                                Use for testing. Remove after verification.
                              </p>
                            </div>
                          </div>
                        )}

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              activeConfig.facebook?.enableAdvancedMatching ||
                              false
                            }
                            onChange={(e) =>
                              setCustomConfig({
                                ...activeConfig,
                                facebook: {
                                  ...activeConfig.facebook,
                                  enabled: true,
                                  pixelId:
                                    activeConfig.facebook?.pixelId || null,
                                  enableAdvancedMatching: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4 rounded border-[#E2E8F0]"
                          />
                          <div>
                            <span className="text-sm font-medium text-[#455263]">
                              Enable Advanced Matching
                            </span>
                            <p className="text-xs text-[#969696]">
                              Send hashed customer data for better attribution
                            </p>
                          </div>
                        </label>
                      </div>

                      <div className="p-3 bg-[#5FC7CD]/10 border border-[#5FC7CD]/20 rounded-xl">
                        <p className="text-sm text-[#455263] font-medium">
                          Auto-tracked Events:
                        </p>
                        <ul className="text-xs text-[#455263] mt-1 space-y-0.5 list-disc list-inside">
                          <li>PageView - When page loads</li>
                          <li>AddToCart - When product added to cart</li>
                          <li>InitiateCheckout - When form is submitted</li>
                          <li>Purchase - When payment is completed</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* TikTok Pixel */}
                <div className="border border-[#E2E8F0] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎵</div>
                      <div>
                        <h4 className="font-semibold text-[#455263]">
                          TikTok Pixel
                        </h4>
                        <p className="text-sm text-[#969696]">
                          Track TikTok ad campaigns
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeConfig.tiktok?.enabled || false}
                        onChange={(e) =>
                          setCustomConfig({
                            ...activeConfig,
                            tiktok: {
                              ...activeConfig.tiktok,
                              enabled: e.target.checked,
                              pixelId: activeConfig.tiktok?.pixelId || null,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#E2E8F0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-[#E2E8F0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#455263]"></div>
                    </label>
                  </div>

                  {activeConfig.tiktok?.enabled && (
                    <div>
                      <Label className="text-[#455263] font-medium">
                        TikTok Pixel ID
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          type={showTikTokPixel ? 'text' : 'password'}
                          value={activeConfig.tiktok?.pixelId || ''}
                          onChange={(e) =>
                            setCustomConfig({
                              ...activeConfig,
                              tiktok: {
                                ...activeConfig.tiktok,
                                enabled: true,
                                pixelId: e.target.value,
                              },
                            })
                          }
                          placeholder="C4XXXXXXXXXXXXXXXXXXX"
                          className="pr-10 rounded-xl border-[#E2E8F0] focus:ring-[#5FC7CD] focus:border-[#5FC7CD]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowTikTokPixel(!showTikTokPixel)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#969696] hover:text-[#455263]"
                        >
                          {showTikTokPixel ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Google Ads */}
                <div className="border border-[#E2E8F0] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🎯</div>
                      <div>
                        <h4 className="font-semibold text-[#455263]">
                          Google Ads
                        </h4>
                        <p className="text-sm text-[#969696]">
                          Track Google Ads conversions
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activeConfig.google_ads?.enabled || false}
                        onChange={(e) =>
                          setCustomConfig({
                            ...activeConfig,
                            google_ads: {
                              ...activeConfig.google_ads,
                              enabled: e.target.checked,
                              tagId: activeConfig.google_ads?.tagId || null,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#E2E8F0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-[#E2E8F0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
                    </label>
                  </div>

                  {activeConfig.google_ads?.enabled && (
                    <div>
                      <Label className="text-[#455263] font-medium">
                        Google Tag ID
                      </Label>
                      <Input
                        type="text"
                        value={activeConfig.google_ads?.tagId || ''}
                        onChange={(e) =>
                          setCustomConfig({
                            ...activeConfig,
                            google_ads: {
                              ...activeConfig.google_ads,
                              enabled: true,
                              tagId: e.target.value,
                            },
                          })
                        }
                        placeholder="G-XXXXXXXXXX or AW-XXXXXXXXXX"
                        className="mt-1 rounded-xl border-[#E2E8F0] focus:ring-[#5FC7CD] focus:border-[#5FC7CD]"
                      />
                    </div>
                  )}
                </div>

                {/* Google Analytics 4 */}
                <div className="border border-[#E2E8F0] rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">📊</div>
                      <div>
                        <h4 className="font-semibold text-[#455263]">
                          Google Analytics 4
                        </h4>
                        <p className="text-sm text-[#969696]">
                          Track website analytics
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={
                          activeConfig.google_analytics?.enabled || false
                        }
                        onChange={(e) =>
                          setCustomConfig({
                            ...activeConfig,
                            google_analytics: {
                              ...activeConfig.google_analytics,
                              enabled: e.target.checked,
                              measurementId:
                                activeConfig.google_analytics?.measurementId ||
                                null,
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-[#E2E8F0] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-[#E2E8F0] after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>

                  {activeConfig.google_analytics?.enabled && (
                    <div>
                      <Label className="text-[#455263] font-medium">
                        Measurement ID
                      </Label>
                      <Input
                        type="text"
                        value={
                          activeConfig.google_analytics?.measurementId || ''
                        }
                        onChange={(e) =>
                          setCustomConfig({
                            ...activeConfig,
                            google_analytics: {
                              ...activeConfig.google_analytics,
                              enabled: true,
                              measurementId: e.target.value,
                            },
                          })
                        }
                        placeholder="G-XXXXXXXXXX"
                        className="mt-1 rounded-xl border-[#E2E8F0] focus:ring-[#5FC7CD] focus:border-[#5FC7CD]"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Save Button */}
            <div className="flex justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} variant="teal">
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Configuration'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
