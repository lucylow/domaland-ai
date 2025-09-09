import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Zap, Clock, Database, Wifi, Cpu, Memory } from 'lucide-react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  cacheHitRate: number;
  bundleSize: number;
}

const PerformanceOptimizer: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    cacheHitRate: 0,
    bundleSize: 0,
  });

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizations, setOptimizations] = useState<string[]>([]);

  useEffect(() => {
    // Simulate performance monitoring
    const measurePerformance = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      setMetrics({
        loadTime: navigation ? Math.round(navigation.loadEventEnd - navigation.loadEventStart) : 0,
        renderTime: paint.length > 0 ? Math.round(paint[paint.length - 1].startTime) : 0,
        memoryUsage: (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0,
        networkLatency: Math.round(Math.random() * 100 + 50),
        cacheHitRate: Math.round(Math.random() * 30 + 70),
        bundleSize: Math.round(Math.random() * 500 + 1000),
      });
    };

    measurePerformance();
    const interval = setInterval(measurePerformance, 5000);

    return () => clearInterval(interval);
  }, []);

  const optimizePerformance = async () => {
    setIsOptimizing(true);
    setOptimizations([]);

    const optimizationSteps = [
      'Preloading critical resources...',
      'Optimizing image compression...',
      'Enabling service worker caching...',
      'Minifying JavaScript bundles...',
      'Compressing CSS files...',
      'Implementing lazy loading...',
      'Optimizing database queries...',
      'Enabling CDN acceleration...',
    ];

    for (let i = 0; i < optimizationSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setOptimizations(prev => [...prev, optimizationSteps[i]]);
    }

    // Simulate performance improvement
    setMetrics(prev => ({
      ...prev,
      loadTime: Math.round(prev.loadTime * 0.7),
      renderTime: Math.round(prev.renderTime * 0.8),
      memoryUsage: Math.round(prev.memoryUsage * 0.6),
      networkLatency: Math.round(prev.networkLatency * 0.5),
      cacheHitRate: Math.min(95, prev.cacheHitRate + 15),
    }));

    setIsOptimizing(false);
  };

  const getPerformanceScore = () => {
    const scores = [
      metrics.loadTime < 1000 ? 100 : Math.max(0, 100 - (metrics.loadTime - 1000) / 50),
      metrics.renderTime < 100 ? 100 : Math.max(0, 100 - (metrics.renderTime - 100) / 10),
      metrics.memoryUsage < 50 ? 100 : Math.max(0, 100 - (metrics.memoryUsage - 50) / 5),
      metrics.networkLatency < 100 ? 100 : Math.max(0, 100 - (metrics.networkLatency - 100) / 10),
      metrics.cacheHitRate,
    ];
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const performanceScore = getPerformanceScore();
  const scoreColor = performanceScore >= 90 ? 'text-emerald-500' : 
                    performanceScore >= 70 ? 'text-yellow-500' : 'text-red-500';

  return (
    <div className="space-y-6">
      {/* Performance Score */}
      <Card className="glass-card border-gradient-dark">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gradient-primary">
            <Zap className="h-5 w-5" />
            Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold">
              <span className={scoreColor}>{performanceScore}</span>
              <span className="text-muted-foreground">/100</span>
            </div>
            <Badge 
              variant={performanceScore >= 90 ? "default" : performanceScore >= 70 ? "secondary" : "destructive"}
              className="animate-pulse"
            >
              {performanceScore >= 90 ? 'Excellent' : performanceScore >= 70 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
          <Progress value={performanceScore} className="h-2" />
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="glass-card border-gradient-dark animate-slide-in-up">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Load Time</div>
                <div className="text-lg font-semibold">{metrics.loadTime}ms</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-gradient-dark animate-slide-in-up animate-stagger-1">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Cpu className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-sm text-muted-foreground">Render Time</div>
                <div className="text-lg font-semibold">{metrics.renderTime}ms</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-gradient-dark animate-slide-in-up animate-stagger-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Memory className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-sm text-muted-foreground">Memory Usage</div>
                <div className="text-lg font-semibold">{metrics.memoryUsage}MB</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-gradient-dark animate-slide-in-up animate-stagger-3">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Wifi className="h-5 w-5 text-orange-500" />
              <div>
                <div className="text-sm text-muted-foreground">Network Latency</div>
                <div className="text-lg font-semibold">{metrics.networkLatency}ms</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-gradient-dark animate-slide-in-up animate-stagger-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-cyan-500" />
              <div>
                <div className="text-sm text-muted-foreground">Cache Hit Rate</div>
                <div className="text-lg font-semibold">{metrics.cacheHitRate}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-gradient-dark animate-slide-in-up animate-stagger-5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-sm text-muted-foreground">Bundle Size</div>
                <div className="text-lg font-semibold">{metrics.bundleSize}KB</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Actions */}
      <Card className="glass-card border-gradient-dark">
        <CardHeader>
          <CardTitle className="text-gradient-primary">Performance Optimization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={optimizePerformance}
            disabled={isOptimizing}
            variant="gradient"
            className="w-full animate-pulse-glow"
          >
            {isOptimizing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Optimizing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Optimize Performance
              </div>
            )}
          </Button>

          {optimizations.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Optimization Progress:</div>
              <div className="space-y-1">
                {optimizations.map((optimization, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm animate-slide-in-left"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-muted-foreground">{optimization}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceOptimizer;
