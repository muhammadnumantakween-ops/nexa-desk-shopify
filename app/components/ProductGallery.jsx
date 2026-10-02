import {useState, useRef, useEffect, useCallback} from 'react';
import {createPortal} from 'react-dom';
import {Image} from '@shopify/hydrogen';

/**
 * UI-PDP-01: Sticky Spec-Sync Product Gallery
 *
 * Requirements from tasks_ui.csv:
 * 1. Left-hand sticky scroll gallery on desktop.
 * 2. Smooth image thumbnail slider and thumbnail picker.
 * 3. Interactive Desktop Zoom / Magnifier on cursor hover with smooth lens overlay.
 * 4. Touch-swipeable full-width image carousel on mobile with pagination bullets & counter.
 * 5. Spec-Sync Hotspots overlay: Interactive hardware spec callouts (Power Delivery, Display Outputs, Host Ports)
 *    directly pinned on the product image with tooltips.
 * 6. Fullscreen Lightbox preview modal.
 *
 * @param {{
 *   images: Array<{
 *     id: string;
 *     url: string;
 *     altText?: string | null;
 *     width?: number | null;
 *     height?: number | null;
 *   }>;
 *   selectedVariantImage?: any;
 *   productTitle: string;
 *   specPills?: string[];
 *   activeSpecSection?: string;
 * }}
 */
export function ProductGallery({
  images = [],
  selectedVariantImage,
  productTitle,
  specPills = [],
  activeSpecSection,
}) {
  // Consolidate images ensuring the selected variant image is placed first if not already present
  const galleryImages = (() => {
    const list = [...images];
    if (selectedVariantImage && !list.some((img) => img.id === selectedVariantImage.id || img.url === selectedVariantImage.url)) {
      list.unshift(selectedVariantImage);
    }
    return list.length > 0
      ? list
      : selectedVariantImage
      ? [selectedVariantImage]
      : [];
  })();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({x: 50, y: 50});
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);

  const mainImageRef = useRef(null);
  const touchStartXRef = useRef(0);
  const touchEndXRef = useRef(0);

  // Sync with selected variant image when user switches options
  useEffect(() => {
    if (selectedVariantImage) {
      const idx = galleryImages.findIndex(
        (img) => img.id === selectedVariantImage.id || img.url === selectedVariantImage.url,
      );
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [selectedVariantImage]);

  // Handle Desktop Mouse Move for Precision Zoom Lens
  const handleMouseMove = useCallback((e) => {
    if (!mainImageRef.current) return;
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({x, y});
  }, []);

  // Handle Mobile Touch Swipes
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndXRef.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartXRef.current - touchEndXRef.current;
    const threshold = 45;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && activeIndex < galleryImages.length - 1) {
        setActiveIndex((prev) => prev + 1);
      } else if (diff < 0 && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
    }
  };

  // Keyboard navigation inside lightbox
  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight' && activeIndex < galleryImages.length - 1) {
        setActiveIndex((prev) => prev + 1);
      }
      if (e.key === 'ArrowLeft' && activeIndex > 0) {
        setActiveIndex((prev) => prev - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, activeIndex, galleryImages.length]);

  const currentImage = galleryImages[activeIndex] || null;

  return (
    <div className="pdp-sticky-gallery-wrap">
      {/* Left Vertical Thumbnail Rail (Desktop) */}
      {galleryImages.length > 1 && (
        <div className="pdp-thumbnails-rail" role="tablist" aria-label="Product thumbnails">
          {galleryImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={img.id || idx}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`View image ${idx + 1} of ${galleryImages.length}`}
                className={`pdp-thumb-btn ${isSelected ? 'active' : ''}`}
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                <img
                  src={img.url}
                  alt={img.altText || `${productTitle} thumbnail ${idx + 1}`}
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Main Showcase Stage with Zoom & Spec-Sync Callouts */}
      <div className="pdp-main-stage-container">
        <div
          ref={mainImageRef}
          className={`pdp-main-stage ${isZooming ? 'is-zoomed' : ''}`}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => {
            setIsZooming(false);
            setActiveHotspot(null);
          }}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="region"
          aria-label="Product Image Showcase with interactive zoom"
        >
          {/* Quick Badges Overlay */}
          <div className="pdp-stage-badges">
            <span className="pdp-hub-pill">
              <span className="pulse-green-dot" />
              <span>UK Warehouse Stock</span>
            </span>
            <button
              type="button"
              className="pdp-expand-btn"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              aria-label="Expand image to fullscreen"
              title="Expand to Fullscreen"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 3 21 3 21 9"></polyline>
                <polyline points="9 21 3 21 3 15"></polyline>
                <line x1="21" y1="3" x2="14" y2="10"></line>
                <line x1="3" y1="21" x2="10" y2="14"></line>
              </svg>
            </button>
          </div>

          {/* Primary Viewport Image */}
          {currentImage ? (
            <div className="pdp-image-viewport">
              <Image
                data={currentImage}
                alt={currentImage.altText || productTitle}
                aspectRatio="1/1"
                sizes="(min-width: 64em) 540px, (min-width: 48em) 450px, 92vw"
                className="pdp-rendered-img"
              />

              {/* Magnifier Lens Background (Zoom on Desktop) */}
              <div
                className="pdp-magnifier-lens"
                style={{
                  backgroundImage: `url(${currentImage.url})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  opacity: isZooming ? 1 : 0,
                }}
                aria-hidden="true"
              />
            </div>
          ) : (
            <div className="pdp-image-placeholder">No image available</div>
          )}

          {/* Mobile Swipe Guidance Indicator */}
          {galleryImages.length > 1 && (
            <div className="pdp-mobile-pagination">
              {galleryImages.map((_, dotIdx) => (
                <span
                  key={dotIdx}
                  className={`pdp-page-dot ${dotIdx === activeIndex ? 'active' : ''}`}
                />
              ))}
              <span className="pdp-mobile-counter">
                {activeIndex + 1}/{galleryImages.length}
              </span>
            </div>
          )}

          {/* Interactive Spec-Sync Feature Hotspots */}
          {specPills.length > 0 && activeIndex === 0 && (
            <div className="pdp-spec-hotspots-layer" onClick={(e) => e.stopPropagation()}>
              {specPills.slice(0, 2).map((pill, pIdx) => {
                const isFirst = pIdx === 0;
                const posClass = isFirst ? 'hotspot-left' : 'hotspot-right';
                const isSelected = activeHotspot === pIdx;
                return (
                  <div
                    key={pIdx}
                    className={`pdp-hardware-hotspot ${posClass} ${isSelected ? 'active' : ''}`}
                    onMouseEnter={() => setActiveHotspot(pIdx)}
                    onMouseLeave={() => setActiveHotspot(null)}
                    onClick={() => setActiveHotspot(isSelected ? null : pIdx)}
                  >
                    <span className="hotspot-beacon">
                      <span className="beacon-ring" />
                      <span className="beacon-dot" />
                    </span>
                    <div className="hotspot-tooltip">
                      <strong>Hardware Spec</strong>
                      <span>{pill}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Gallery Caption Bar */}
        <div className="pdp-gallery-caption-bar">
          <div className="caption-features">
            <span className="feat-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Dispatch in 24h</span>
            </span>
            <span className="feat-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>2-Year UK Warranty</span>
            </span>
            <span className="feat-chip">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              <span>Hover image to zoom</span>
            </span>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal (Portal to body for clean viewport stacking) */}
      {isLightboxOpen && currentImage && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="pdp-lightbox-overlay"
            onClick={() => setIsLightboxOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="High-resolution full screen image preview"
          >
            <div className="pdp-lightbox-stage" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="lightbox-close-btn"
                onClick={() => setIsLightboxOpen(false)}
                aria-label="Close fullscreen view"
              >
                ✕
              </button>

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    className="lightbox-nav-btn prev"
                    disabled={activeIndex === 0}
                    onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
                    aria-label="Previous image"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="lightbox-nav-btn next"
                    disabled={activeIndex === galleryImages.length - 1}
                    onClick={() => setActiveIndex((prev) => Math.min(galleryImages.length - 1, prev + 1))}
                    aria-label="Next image"
                  >
                    ›
                  </button>
                </>
              )}

              <div className="lightbox-image-box">
                <img
                  src={currentImage.url}
                  alt={currentImage.altText || productTitle}
                  className="lightbox-img"
                />
              </div>

              <div className="lightbox-footer">
                <span>{productTitle}</span>
                {galleryImages.length > 1 && (
                  <span>
                    {activeIndex + 1} / {galleryImages.length}
                  </span>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
