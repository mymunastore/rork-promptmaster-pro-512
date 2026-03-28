import { useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentMountTime: number;
  apiResponseTime?: number;
  errorCount: number;
  userInteractions: number;
}

interface PerformanceEntry {
  name: string;
  startTime: number;
  duration: number;
  type: 'render' | 'api' | 'navigation' | 'user-interaction';
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private entries: PerformanceEntry[] = [];
  private maxEntries = 100;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(name: string, type: PerformanceEntry['type'], metadata?: Record<string, any>): () => void {
    const startTime = Date.now();
    
    return () => {
      const duration = Date.now() - startTime;
      this.addEntry({
        name,
        startTime,
        duration,
        type,
        metadata,
      });
    };
  }

  addEntry(entry: PerformanceEntry): void {
    this.entries.push(entry);
    
    // Keep only the most recent entries
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }

    // Log performance issues
    if (entry.duration > 1000) {
      console.warn(`Performance warning: ${entry.name} took ${entry.duration}ms`);
    }
  }

  getMetrics(): PerformanceMetrics {
    const renderEntries = this.entries.filter(e => e.type === 'render');
    const apiEntries = this.entries.filter(e => e.type === 'api');
    const userInteractionEntries = this.entries.filter(e => e.type === 'user-interaction');

    return {
      renderTime: renderEntries.length > 0 
        ? renderEntries.reduce((sum, e) => sum + e.duration, 0) / renderEntries.length 
        : 0,
      componentMountTime: renderEntries.length > 0 
        ? Math.max(...renderEntries.map(e => e.duration)) 
        : 0,
      apiResponseTime: apiEntries.length > 0 
        ? apiEntries.reduce((sum, e) => sum + e.duration, 0) / apiEntries.length 
        : undefined,
      errorCount: this.entries.filter(e => e.metadata?.error).length,
      userInteractions: userInteractionEntries.length,
      memoryUsage: this.getMemoryUsage(),
    };
  }

  private getMemoryUsage(): number | undefined {
    if (Platform.OS === 'web' && 'memory' in performance) {
      return (performance as any).memory?.usedJSHeapSize;
    }
    return undefined;
  }

  getSlowOperations(threshold = 500): PerformanceEntry[] {
    return this.entries.filter(entry => entry.duration > threshold);
  }

  clear(): void {
    this.entries = [];
  }

  exportData(): PerformanceEntry[] {
    return [...this.entries];
  }
}

export function usePerformanceMonitor(componentName: string) {
  const monitor = PerformanceMonitor.getInstance();
  const mountTimeRef = useRef<number>(Date.now());
  const renderCountRef = useRef<number>(0);

  // Track component mount time
  useEffect(() => {
    const mountDuration = Date.now() - mountTimeRef.current;
    monitor.addEntry({
      name: `${componentName}-mount`,
      startTime: mountTimeRef.current,
      duration: mountDuration,
      type: 'render',
      metadata: { component: componentName },
    });

    return () => {
      const unmountTime = Date.now();
      monitor.addEntry({
        name: `${componentName}-unmount`,
        startTime: unmountTime,
        duration: 0,
        type: 'render',
        metadata: { component: componentName },
      });
    };
  }, [componentName, monitor]);

  // Track renders
  useEffect(() => {
    renderCountRef.current += 1;
    
    if (renderCountRef.current > 1) {
      monitor.addEntry({
        name: `${componentName}-render`,
        startTime: Date.now(),
        duration: 0,
        type: 'render',
        metadata: { 
          component: componentName,
          renderCount: renderCountRef.current,
        },
      });
    }
  });

  const trackOperation = useCallback((
    operationName: string, 
    type: PerformanceEntry['type'] = 'user-interaction',
    metadata?: Record<string, any>
  ) => {
    return monitor.startTiming(`${componentName}-${operationName}`, type, {
      component: componentName,
      ...metadata,
    });
  }, [componentName, monitor]);

  const trackApiCall = useCallback((apiName: string, metadata?: Record<string, any>) => {
    return monitor.startTiming(`api-${apiName}`, 'api', {
      component: componentName,
      ...metadata,
    });
  }, [componentName, monitor]);

  const trackNavigation = useCallback((routeName: string, metadata?: Record<string, any>) => {
    return monitor.startTiming(`navigation-${routeName}`, 'navigation', {
      component: componentName,
      ...metadata,
    });
  }, [componentName, monitor]);

  const getMetrics = useCallback(() => {
    return monitor.getMetrics();
  }, [monitor]);

  const getSlowOperations = useCallback((threshold?: number) => {
    return monitor.getSlowOperations(threshold);
  }, [monitor]);

  return {
    trackOperation,
    trackApiCall,
    trackNavigation,
    getMetrics,
    getSlowOperations,
    renderCount: renderCountRef.current,
  };
}

// Hook for tracking API performance
export function useApiPerformance() {
  const monitor = PerformanceMonitor.getInstance();

  const trackApiCall = useCallback(async <T>(
    apiName: string,
    apiCall: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> => {
    const endTiming = monitor.startTiming(`api-${apiName}`, 'api', metadata);
    
    try {
      const result = await apiCall();
      endTiming();
      return result;
    } catch (error) {
      endTiming();
      monitor.addEntry({
        name: `api-${apiName}-error`,
        startTime: Date.now(),
        duration: 0,
        type: 'api',
        metadata: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          ...metadata,
        },
      });
      throw error;
    }
  }, [monitor]);

  return { trackApiCall };
}

// Hook for tracking user interactions
export function useInteractionTracking() {
  const monitor = PerformanceMonitor.getInstance();

  const trackInteraction = useCallback((
    interactionName: string,
    metadata?: Record<string, any>
  ) => {
    monitor.addEntry({
      name: `interaction-${interactionName}`,
      startTime: Date.now(),
      duration: 0,
      type: 'user-interaction',
      metadata,
    });
  }, [monitor]);

  const trackButtonPress = useCallback((buttonName: string, metadata?: Record<string, any>) => {
    trackInteraction(`button-${buttonName}`, metadata);
  }, [trackInteraction]);

  const trackScreenView = useCallback((screenName: string, metadata?: Record<string, any>) => {
    trackInteraction(`screen-${screenName}`, metadata);
  }, [trackInteraction]);

  return {
    trackInteraction,
    trackButtonPress,
    trackScreenView,
  };
}

// Global performance utilities
export const performanceUtils = {
  getGlobalMetrics: () => PerformanceMonitor.getInstance().getMetrics(),
  getSlowOperations: (threshold?: number) => PerformanceMonitor.getInstance().getSlowOperations(threshold),
  clearMetrics: () => PerformanceMonitor.getInstance().clear(),
  exportMetrics: () => PerformanceMonitor.getInstance().exportData(),
  
  // Memory monitoring (web only)
  getMemoryInfo: () => {
    if (Platform.OS === 'web' && 'memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      };
    }
    return null;
  },

  // Performance observer (web only)
  observePerformance: (callback: (entries: any[]) => void) => {
    if (Platform.OS === 'web' && 'PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
      
      return () => observer.disconnect();
    }
    return () => {};
  },
};