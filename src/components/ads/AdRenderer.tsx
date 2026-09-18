import React, { useEffect, useRef, useState, useId } from 'react';
import { Advertisement } from '../../types';
import { Info, AlertCircle, ExternalLink } from 'lucide-react';

interface AdRendererProps {
  ad: Advertisement;
  className?: string;
  showLabel?: boolean;
}

export const AdRenderer: React.FC<AdRendererProps> = ({ 
  ad, 
  className = '', 
  showLabel = true 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [isBlockedOrError, setIsBlockedOrError] = useState<boolean>(false);
  const uniqueId = useId();

  // Measure container width to dynamically scale fixed banners if viewport is narrower than ad
  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Proactively clean up any legacy popup/social bar scripts or intrusive overlays
  useEffect(() => {
    try {
      const rogueScripts = document.querySelectorAll(
        'script[src*="profitableratecpmnetwork.com"], script[src*="1822920cd10687d189b60424e04ba451"], [id*="talentio-ad-script"], [id*="container-70e37b03ade96f3849b83b7f9832bfc2"]'
      );
      rogueScripts.forEach(s => s.remove());
    } catch {
      // ignore
    }
  }, []);

  // Reject and suppress any popup or script-only ad format that could trigger overlays
  if (
    ad.format === 'script' || 
    ad.format === 'container' ||
    (ad.width === 1 && ad.height === 1) || 
    ad.placement === 'top_banner' ||
    ad.id === 'ad-1-adsterra-script' ||
    ad.id === 'ad-2-adsterra-container' ||
    ad.code.includes('1822920cd10687d189b60424e04ba451') ||
    ad.code.includes('profitableratecpmnetwork.com')
  ) {
    return null;
  }

  // Calculate dimensions and responsive scale ratio
  const targetWidth = ad.width || 728;
  const targetHeight = ad.height || 90;

  // Scale down proportionately if viewport is narrower than target ad width
  let scale = 1;
  if (containerWidth > 0 && containerWidth < targetWidth) {
    scale = Math.max(0.4, containerWidth / targetWidth);
  }

  const scaledHeight = targetHeight * scale;

  // Build the isolated friendly iframe document
  // The iframe isolates window.atOptions and Adsterra invoke scripts safely
  const iframeContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base target="_blank">
    <style>
      * { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      #container-${ad.id} {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="container-${ad.id}">
      ${ad.code}
    </div>
  </body>
</html>
  `;

  return (
    <div 
      ref={containerRef}
      id={`talentio-ad-slot-${ad.id}`}
      data-ad-placement={ad.placement}
      data-ad-format={ad.format}
      className={`relative w-full flex flex-col items-center justify-center max-w-full overflow-hidden ${className}`}
    >
      {/* Discreet Ad Transparency Disclosure (Anti-Slop Compliant) */}
      {showLabel && (
        <div className="w-full flex items-center justify-center gap-1.5 mb-1.5 select-none">
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500">
            Advertisement
          </span>
          <span className="text-slate-300 dark:text-slate-600 text-[10px]">•</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
            {ad.network || 'Adsterra'}
          </span>
        </div>
      )}

      {/* Main Responsive Ad Box Container */}
      <div 
        className="relative flex items-center justify-center max-w-full overflow-hidden transition-all duration-200"
        style={{
          width: scale < 1 ? '100%' : `${targetWidth}px`,
          height: `${scaledHeight}px`,
          maxWidth: '100%'
        }}
      >
        <div 
          style={{
            width: `${targetWidth}px`,
            height: `${targetHeight}px`,
            transform: scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
            maxWidth: 'none'
          }}
          className="flex items-center justify-center shrink-0"
        >
          <iframe
            key={`${ad.id}-${ad.updatedAt}-${uniqueId}`}
            title={`Talentio Ad - ${ad.name}`}
            srcDoc={iframeContent}
            scrolling="no"
            frameBorder="0"
            className="w-full h-full border-0 overflow-hidden bg-transparent"
            style={{ width: `${targetWidth}px`, height: `${targetHeight}px` }}
            sandbox="allow-scripts allow-same-origin allow-forms"
            onError={() => setIsBlockedOrError(true)}
          />
        </div>
      </div>
    </div>
  );
};
