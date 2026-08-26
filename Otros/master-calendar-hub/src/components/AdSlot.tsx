import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AdSlotProps {
  id: string;
  size: 'banner' | 'rectangle' | 'skyscraper' | 'leaderboard';
  className?: string;
  showAds: boolean;
  hasConsent: boolean;
  isPro: boolean;
  children?: React.ReactNode; // Fallback content
}

const adSizes = {
  banner: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  skyscraper: { width: 160, height: 600 },
  leaderboard: { width: 970, height: 90 }
};

export function AdSlot({ 
  id, 
  size, 
  className, 
  showAds, 
  hasConsent, 
  isPro, 
  children 
}: AdSlotProps) {
  const adRef = useRef<HTMLElement>(null);
  const dimensions = adSizes[size];

  useEffect(() => {
    // Don't show ads if user is Pro, hasn't consented, or ads are disabled
    if (isPro || !hasConsent || !showAds) {
      return;
    }

    // Load Google Ads script lazily
    const loadGoogleAds = async () => {
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Initialize the ad
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('Ad loading error:', error);
      }
    };

    loadGoogleAds();
  }, [showAds, hasConsent, isPro]);

  // Don't render anything if user is Pro
  if (isPro) {
    return null;
  }

  // Show fallback content if ads are disabled or no consent
  if (!showAds || !hasConsent) {
    return children ? (
      <div className={cn("flex items-center justify-center", className)}>
        {children}
      </div>
    ) : null;
  }

  return (
    <div 
      className={cn(
        "flex items-center justify-center bg-muted/30 border border-dashed border-muted-foreground/20 rounded",
        className
      )}
      style={{ 
        width: dimensions.width, 
        height: dimensions.height,
        maxWidth: '100%'
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          width: dimensions.width,
          height: dimensions.height
        }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Declare global for TypeScript
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}