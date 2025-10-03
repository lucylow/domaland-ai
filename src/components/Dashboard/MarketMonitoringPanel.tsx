import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, AlertCircle } from 'lucide-react';

const MOCK_MARKET_DATA = [
  {
    category: 'AI Domains',
    trend: 'bullish',
    volume24h: 145000,
    priceChange: 12.5,
    alerts: ['High buying activity detected', 'New premium listings']
  },
  {
    category: 'NFT Domains',
    trend: 'neutral',
    volume24h: 89000,
    priceChange: 2.3,
    alerts: ['Stable market conditions']
  },
  {
    category: 'Web3 Domains',
    trend: 'bullish',
    volume24h: 234000,
    priceChange: 18.7,
    alerts: ['Record trading volume', 'Institutional interest increasing']
  },
  {
    category: 'DeFi Domains',
    trend: 'bearish',
    volume24h: 67000,
    priceChange: -5.2,
    alerts: ['Price correction ongoing', 'Monitor for buying opportunities']
  }
];

export const MarketMonitoringPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Real-Time Market Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_MARKET_DATA.map((market, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{market.category}</h3>
                    <p className="text-sm text-muted-foreground">24h Volume: ${market.volume24h.toLocaleString()}</p>
                  </div>
                  <Badge 
                    className={
                      market.trend === 'bullish' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : market.trend === 'bearish'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200'
                    }
                  >
                    {market.trend}
                  </Badge>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  {market.priceChange >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-500" />
                  )}
                  <span className={`text-lg font-bold ${market.priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {market.priceChange >= 0 ? '+' : ''}{market.priceChange}%
                  </span>
                  <span className="text-sm text-muted-foreground">24h change</span>
                </div>

                <div className="space-y-2">
                  {market.alerts.map((alert, i) => (
                    <div key={i} className="flex items-start space-x-2 p-2 bg-primary/5 rounded">
                      <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
                      <p className="text-sm">{alert}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
