import { useCallback, useMemo, useRef, useEffect } from 'react';
import { Platform } from 'react-native';
import React from "react";

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentCount: number;
}

interface UsePerformanceOptions {
  enableMetrics?: boolean;
  logToConsole?: boolean;
  trackMemory?: boolean;
}

export const usePerformance = (
  componentName: string,
  options: UsePerformanceOptions = {}
) => {
  const {
    enableMetrics = __DEV__,
    logToConsole = __DEV__,
    trackMemory = false
  } = options;

  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const metrics = useRef<PerformanceMetrics[]>([]);

  // Start performance tracking
  const startTracking = useCallback(() => {
    if (!enableMetrics) return;
    renderStartTime.current = performance.now();
  }, [enableMetrics]);

  // End performance tracking
  const endTracking = useCallback(() => {
    if (!enableMetrics || renderStartTime.current === 0) return;

    const renderTime = performance.now() - renderStartTime.current;
    renderCount.current += 1;

    const metric: PerformanceMetrics = {
      renderTime,
      componentCount: renderCount.current,
    };

    // Track memory usage on web
    if (trackMemory && Platform.OS === 'web' && 'memory' in performance) {
      const memoryInfo = (performance as any).memory;
      metric.memoryUsage = memoryInfo.usedJSHeapSize;
    }

    metrics.current.push(metric);

    if (logToConsole) {
      console.log(`[Performance] ${componentName}:`, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        renderCount: renderCount.current,
        memoryUsage: metric.memoryUsage ? `${(metric.memoryUsage / 1024 / 1024).toFixed(2)}MB` : 'N/A'
      });
    }

    renderStartTime.current = 0;
  }, [enableMetrics, trackMemory, logToConsole, componentName]);

  // Get performance statistics
  const getStats = useCallback(() => {
    if (metrics.current.length === 0) return null;

    const renderTimes = metrics.current.map(m => m.renderTime);
    const avgRenderTime = renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length;
    const maxRenderTime = Math.max(...renderTimes);
    const minRenderTime = Math.min(...renderTimes);

    return {
      totalRenders: renderCount.current,
      averageRenderTime: avgRenderTime,
      maxRenderTime,
      minRenderTime,
      lastRenderTime: renderTimes[renderTimes.length - 1] || 0,
    };
  }, []);

  // Clear metrics
  const clearMetrics = useCallback(() => {
    metrics.current = [];
    renderCount.current = 0;
  }, []);

  // Memoized performance wrapper for expensive operations
  const memoizedCallback = useCallback(
    <T extends (...args: any[]) => any>(fn: T, deps: React.DependencyList): T => {
      return useCallback(fn, deps);
    },
    []
  );

  const memoizedValue = useCallback(
    <T>(factory: () => T, deps: React.DependencyList): T => {
      return useMemo(factory, deps);
    },
    []
  );

  // Performance-optimized debounce
  const debounce = useCallback(
    <T extends (...args: any[]) => any>(
      func: T,
      delay: number
    ): ((...args: Parameters<T>) => void) => {
      const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

      return (...args: Parameters<T>) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => func(...args), delay);
      };
    },
    []
  );

  // Performance-optimized throttle
  const throttle = useCallback(
    <T extends (...args: any[]) => any>(
      func: T,
      delay: number
    ): ((...args: Parameters<T>) => void) => {
      const lastCallRef = useRef<number>(0);

      return (...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCallRef.current >= delay) {
          lastCallRef.current = now;
          func(...args);
        }
      };
    },
    []
  );

  // Batch state updates for better performance
  const batchUpdates = useCallback(
    (updates: (() => void)[]): void => {
      // Use React's unstable_batchedUpdates if available
      if (typeof (React as any).unstable_batchedUpdates === 'function') {
        (React as any).unstable_batchedUpdates(() => {
          updates.forEach(update => update());
        });
      } else {
        // Fallback: execute updates in sequence
        updates.forEach(update => update());
      }
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearMetrics();
    };
  }, [clearMetrics]);

  return {
    startTracking,
    endTracking,
    getStats,
    clearMetrics,
    memoizedCallback,
    memoizedValue,
    debounce,
    throttle,
    batchUpdates,
    renderCount: renderCount.current,
    isTracking: renderStartTime.current > 0,
  };
};

// Hook for optimizing list rendering
export const useVirtualizedList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const totalCount = items.length;
    
    return {
      getVisibleRange: (scrollOffset: number) => {
        const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - overscan);
        const endIndex = Math.min(totalCount - 1, startIndex + visibleCount + overscan * 2);
        
        return {
          startIndex,
          endIndex,
          visibleItems: items.slice(startIndex, endIndex + 1),
        };
      },
      totalHeight: totalCount * itemHeight,
      itemHeight,
    };
  }, [items, itemHeight, containerHeight, overscan]);
};

// Hook for optimizing image loading
export const useImageOptimization = () => {
  const imageCache = useRef<Map<string, boolean>>(new Map());

  const preloadImage = useCallback((uri: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (imageCache.current.has(uri)) {
        resolve();
        return;
      }

      if (Platform.OS === 'web') {
        const img = new Image();
        img.onload = () => {
          imageCache.current.set(uri, true);
          resolve();
        };
        img.onerror = reject;
        img.src = uri;
      } else {
        // For React Native, we can use Image.prefetch
        const { Image } = require('react-native');
        Image.prefetch(uri)
          .then(() => {
            imageCache.current.set(uri, true);
            resolve();
          })
          .catch(reject);
      }
    });
  }, []);

  const isImageCached = useCallback((uri: string): boolean => {
    return imageCache.current.has(uri);
  }, []);

  const clearImageCache = useCallback(() => {
    imageCache.current.clear();
  }, []);

  return {
    preloadImage,
    isImageCached,
    clearImageCache,
  };
};

export default usePerformance;