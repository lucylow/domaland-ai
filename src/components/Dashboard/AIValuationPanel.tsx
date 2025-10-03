import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, DollarSign, BarChart3, Calendar } from 'lucide-react';

const MOCK_VALUATIONS = [
  { domain: 'crypto.ai', current: 15200, predicted: 22800, change: 50, confidence: 87 },
  { domain: 'nft.eth', current: 28900, predicted: 35400, change: 22, confidence: 92 },
  { domain: 'web3.com', current: 45600, predicted: 52300, change: 15, confidence: 89 },
  { domain: 'defi.xyz', current: 12400, predicted: 18900, change: 52, confidence: 84 }
];

export const AIValuationPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <span>AI-Powered Domain Valuations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_VALUATIONS.map((valuation, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{valuation.domain}</h3>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    {valuation.confidence}% confident
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                    <p className="text-xl font-bold">${valuation.current.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">12M Projection</p>
                    <p className="text-xl font-bold text-primary">${valuation.predicted.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Growth</p>
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-xl font-bold text-green-600">+{valuation.change}%</span>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all" 
                    style={{ width: `${(valuation.predicted / valuation.current) * 50}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$102,100</p>
            <p className="text-sm text-muted-foreground">Current valuation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Projected Value (12M)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">$129,400</p>
            <p className="text-sm text-green-600">+26.7% growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Confidence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">88%</p>
            <p className="text-sm text-muted-foreground">AI prediction accuracy</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
