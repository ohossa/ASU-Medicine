import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, X, SunMedium, Eye, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface MedicalImageViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  altText?: string;
}

/**
 * MedicalImageViewerModal
 * High-definition, Apple HIG-compliant medical image & histology viewer.
 * Supports fluid pinch-to-zoom, drag-pan, microscopy contrast enhancement,
 * and high-resolution inspection.
 */
export function MedicalImageViewerModal({
  isOpen,
  onClose,
  imageUrl,
  title = 'Medical Figure Inspection',
  subtitle = 'High-Resolution Specimen & Diagram Viewer',
  altText = 'Medical diagram or specimen',
}: MedicalImageViewerModalProps) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [invertContrast, setInvertContrast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragStart = useRef({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const lastTapTime = useRef<number>(0);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  }, []);

  // Reset state when modal opens or image changes
  useEffect(() => {
    if (isOpen) {
      resetZoom();
      setInvertContrast(false);
    }
  }, [isOpen, imageUrl, resetZoom]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const zoomIn = () => setScale((s) => Math.min(4.0, Math.round((s + 0.5) * 10) / 10));
  const zoomOut = () => setScale((s) => Math.max(1.0, Math.round((s - 0.5) * 10) / 10));

  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
    }
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPan({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale((s) => Math.min(4.0, Number((s + 0.2).toFixed(2))));
    } else {
      setScale((s) => {
        const next = Math.max(1.0, Number((s - 0.2).toFixed(2)));
        if (next <= 1) setPan({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Touch pinch-to-zoom & pan handlers for mobile/iPad
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      lastTouchDistance.current = dist;
    } else if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapTime.current < 300) {
        // Double tap
        handleDoubleClick();
        lastTapTime.current = 0;
        return;
      }
      lastTapTime.current = now;

      if (scale > 1) {
        setIsDragging(true);
        dragStart.current = {
          x: e.touches[0].clientX - pan.x,
          y: e.touches[0].clientY - pan.y,
        };
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDistance.current !== null) {
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = currentDist / lastTouchDistance.current;
      setScale((s) => {
        const next = Math.min(4.0, Math.max(1.0, Number((s * factor).toFixed(2))));
        if (next <= 1) setPan({ x: 0, y: 0 });
        return next;
      });
      lastTouchDistance.current = currentDist;
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      setPan({
        x: e.touches[0].clientX - dragStart.current.x,
        y: e.touches[0].clientY - dragStart.current.y,
      });
    }
  };

  const handleTouchEnd = () => {
    lastTouchDistance.current = null;
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed inset-0 z-50 flex flex-col justify-between p-3 sm:p-6 bg-stone-950/95 backdrop-blur-2xl"
      >
        {/* Top Header & Toolbar */}
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between pb-3 border-b border-white/10 text-white">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <Eye size={18} className="text-purple-400 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">{title}</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-medium">
                {Math.round(scale * 100)}%
              </span>
            </div>
            {subtitle && <p className="text-xs text-stone-400 hidden sm:block">{subtitle}</p>}
          </div>

          {/* Action Toolbar (Apple HIG 44px Hit Targets) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={zoomOut}
              disabled={scale <= 1}
              title="Zoom out"
              aria-label="Zoom out"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white transition-colors focus-visible:outline-2 focus-visible:outline-purple-400"
            >
              <ZoomOut size={16} />
            </button>

            <button
              type="button"
              onClick={resetZoom}
              title="Reset zoom"
              aria-label="Reset zoom"
              className="min-h-[44px] px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-medium text-white transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-purple-400"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={zoomIn}
              disabled={scale >= 4.0}
              title="Zoom in"
              aria-label="Zoom in"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:hover:bg-white/10 text-white transition-colors focus-visible:outline-2 focus-visible:outline-purple-400"
            >
              <ZoomIn size={16} />
            </button>

            <div className="w-[1px] h-6 bg-white/20 mx-1" />

            <button
              type="button"
              onClick={() => setInvertContrast((v) => !v)}
              title={invertContrast ? 'Standard view' : 'Invert microscopy contrast'}
              aria-label="Toggle microscopy contrast"
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-purple-400 ${
                invertContrast ? 'bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <SunMedium size={16} />
            </button>

            <a
              href={imageUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              title="Open full resolution in new tab"
              aria-label="Open full resolution in new tab"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors focus-visible:outline-2 focus-visible:outline-purple-400"
            >
              <Download size={16} />
            </a>

            <button
              type="button"
              onClick={onClose}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 transition-colors ml-1 focus-visible:outline-2 focus-visible:outline-red-400"
              aria-label="Close inspection modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Viewport Frame */}
        <div
          className="w-full max-w-6xl mx-auto flex-1 flex items-center justify-center overflow-hidden my-3 rounded-2xl border border-white/10 bg-black/60 relative select-none"
          style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onDoubleClick={handleDoubleClick}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <motion.img
            src={imageUrl}
            alt={altText}
            animate={{
              scale,
              x: pan.x,
              y: pan.y,
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="w-auto h-auto max-w-full max-h-[75vh] object-contain rounded-lg transition-all duration-150 select-none"
            style={{
              filter: invertContrast ? 'invert(0.9) hue-rotate(180deg)' : 'none',
              willChange: 'transform',
            }}
            draggable={false}
          />
        </div>

        {/* Bottom Status / Instructions */}
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between text-xs text-stone-400 pt-2 border-t border-white/10">
          <span>Pinch to zoom · Double-tap to toggle 250% · Drag to pan</span>
          <span className="hidden sm:inline">Press Esc to exit</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
