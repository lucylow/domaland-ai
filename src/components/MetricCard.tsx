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
    <Card className="group relative overflow-hidden bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      {/* Shimmer effect */}
      <div className="absolute inset-0 -top-2 -left-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {title}
        </CardTitle>
        {icon && (
          <div className="relative">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-300 animate-float">
              {icon}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-all duration-300">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </div>
        
        {change !== undefined && (
          <div className="flex items-center gap-2 text-xs mt-2">
            <span className={`flex items-center font-medium ${getTrendColor()} group-hover:scale-105 transition-transform duration-300`}>
              <span className="mr-1">{getTrendIcon()}</span>
              {typeof change === 'number' ? Math.abs(change) : change}
            </span>
            {changeLabel && (
              <span className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                {changeLabel}
              </span>
            )}
          </div>
        )}
        
        {/* Progress bar for visual appeal */}
        <div className="mt-3 h-1 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${trend === 'up' ? 'from-emerald-500 to-emerald-400' : trend === 'down' ? 'from-red-500 to-red-400' : 'from-blue-500 to-blue-400'} rounded-full transition-all duration-1000`}
            style={{ width: `${Math.min(100, Math.max(20, typeof change === 'number' ? Math.abs(change) * 10 : 50))}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;