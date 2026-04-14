'use client';

import { useAuth } from '@/contexts/AuthContext';

export type SubscriptionPlan = 'free' | 'premium' | 'enterprise';

export interface SubscriptionFeatures {
  maxProjects: number;
  maxProducts: number;
  customDomain: boolean;
  analytics: boolean;
  trackingPixels: boolean;
  bumpOffer: boolean;
  googleSheets: boolean;
  versionControl: boolean;
  prioritySupport: boolean;
  eInvoice: boolean;
  affiliateManagement: boolean;
  dedicatedManager: boolean;
}

const PLAN_FEATURES: Record<SubscriptionPlan, SubscriptionFeatures> = {
  free: {
    maxProjects: 1,
    maxProducts: 5,
    customDomain: false,
    analytics: false,
    trackingPixels: false,
    bumpOffer: false,
    googleSheets: false,
    versionControl: false,
    prioritySupport: false,
    eInvoice: false,
    affiliateManagement: false,
    dedicatedManager: false,
  },
  premium: {
    maxProjects: Infinity,
    maxProducts: Infinity,
    customDomain: true,
    analytics: true,
    trackingPixels: true,
    bumpOffer: true,
    googleSheets: true,
    versionControl: true,
    prioritySupport: true,
    eInvoice: false,
    affiliateManagement: false,
    dedicatedManager: false,
  },
  enterprise: {
    maxProjects: Infinity,
    maxProducts: Infinity,
    customDomain: true,
    analytics: true,
    trackingPixels: true,
    bumpOffer: true,
    googleSheets: true,
    versionControl: true,
    prioritySupport: true,
    eInvoice: true,
    affiliateManagement: true,
    dedicatedManager: true,
  },
};

export function useSubscription() {
  const { profile } = useAuth();

  const plan: SubscriptionPlan =
    (profile?.subscription_plan as SubscriptionPlan) || 'free';
  const features = PLAN_FEATURES[plan];

  const isPremiumOrHigher = plan === 'premium' || plan === 'enterprise';
  const isEnterprise = plan === 'enterprise';
  const isFree = plan === 'free';

  /**
   * Check if a specific feature is available for the current plan
   */
  const hasFeature = (feature: keyof SubscriptionFeatures): boolean => {
    return !!features[feature];
  };

  /**
   * Check if user can create more projects
   */
  const canCreateProject = (currentCount: number): boolean => {
    return currentCount < features.maxProjects;
  };

  /**
   * Check if user can create more products
   */
  const canCreateProduct = (currentCount: number): boolean => {
    return currentCount < features.maxProducts;
  };

  /**
   * Get upgrade message for a specific feature
   */
  const getUpgradeMessage = (feature: keyof SubscriptionFeatures): string => {
    const featureNames: Record<keyof SubscriptionFeatures, string> = {
      maxProjects: 'unlimited projects',
      maxProducts: 'unlimited products',
      customDomain: 'custom domain',
      analytics: 'analytics dashboard',
      trackingPixels: 'tracking pixels',
      bumpOffer: 'bump offer / upsell',
      googleSheets: 'Google Sheets integration',
      versionControl: 'version control',
      prioritySupport: 'priority support',
      eInvoice: 'e-invoice integration',
      affiliateManagement: 'affiliate management',
      dedicatedManager: 'dedicated account manager',
    };

    return `Upgrade to Premium to access ${featureNames[feature]}`;
  };

  /**
   * Check subscription expiry status
   */
  const getSubscriptionStatus = () => {
    const status = profile?.subscription_status;
    const expiry = profile?.subscription_expires_at;

    if (!expiry || plan === 'free') {
      return {
        status: 'active',
        daysUntilExpiry: null,
        isExpiring: false,
        isExpired: false,
      };
    }

    const expiryDate = new Date(expiry);
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      status,
      daysUntilExpiry,
      isExpiring: daysUntilExpiry <= 7 && daysUntilExpiry > 0,
      isExpired: daysUntilExpiry <= 0,
    };
  };

  return {
    plan,
    features,
    isPremiumOrHigher,
    isEnterprise,
    isFree,
    hasFeature,
    canCreateProject,
    canCreateProduct,
    getUpgradeMessage,
    getSubscriptionStatus,
  };
}
