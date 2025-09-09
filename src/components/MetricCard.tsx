import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number | string;
  changeLabel?: string;
  icon?: string;
  trend?: 'up' | 'down' | 'neutral';
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon,
  trend = 'neutral'
}) => {
  const isPositiveChange = typeof change === 'number' ? change >= 0 : true;

  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-500';
    if (trend === 'down') return 'text-red-500';
    return 'text-blue-500';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↗';
    if (trend === 'down') return '↘';
    return '→';
  };

  return (
    <Card className="group relative overflow-hidden glass-card hover:glass-card-hover border-gradient-dark transition-all duration-500 hover:-translate-y-2 animate-slide-in-up">
      {/* Enhanced shimmer effect */}
      <div className="absolute inset-0 -top-2 -left-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer-enhanced"></div>
      
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className={`absolute inset-0 rounded-lg blur-xl ${trend === 'up' ? 'bg-emerald-500/20' : trend === 'down' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}></div>
      </div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {title}
        </CardTitle>
        {icon && (
          <div className="relative">
            <span className="text-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-float">
              {icon}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold text-foreground group-hover:text-gradient-primary transition-all duration-500 group-hover:scale-105">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        {change !== undefined && (
          <div className="flex items-center gap-2 text-xs mt-2">
            <span className={`flex items-center font-medium ${getTrendColor()} group-hover:scale-110 transition-all duration-300`}>
              <span className="mr-1 group-hover:animate-wiggle">{getTrendIcon()}</span>
              {typeof change === 'number' ? Math.abs(change) : change}
            </span>
            {changeLabel && (
              <span className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                {changeLabel}
              </span>
            )}
          </div>
        )}
        
        {/* Enhanced progress bar */}
        <div className="mt-3 h-2 bg-muted/20 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${trend === 'up' ? 'from-emerald-500 via-emerald-400 to-emerald-300' : trend === 'down' ? 'from-red-500 via-red-400 to-red-300' : 'from-blue-500 via-blue-400 to-blue-300'} rounded-full transition-all duration-1000 group-hover:shadow-glow-primary relative`}
            style={{ width: `${Math.min(100, Math.max(20, typeof change === 'number' ? Math.abs(change) * 10 : 50))}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer-enhanced"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;