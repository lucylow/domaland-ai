import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Target, AlertTriangle, CheckCircle } from 'lucide-react';

const MOCK_INSIGHTS = {
  topPerformers: [
    { domain: 'crypto.ai', score: 94, reason: 'Strong market demand and brand recognition' },
    { domain: 'nft.eth', score: 92, reason: 'Premium extension with growing NFT market' },
    { domain: 'web3.com', score: 89, reason: 'Generic term with high traffic potential' }
  ],
  riskAlerts: [
    { domain: 'oldtech.com', risk: 'medium', issue: 'Declining market interest in traditional tech domains' },
    { domain: 'random123.xyz', risk: 'high', issue: 'Low brandability and memorability scores' }
  ],
  opportunities: [
    { category: 'AI Domains', insight: 'AI domain prices up 45% this quarter - consider early investment' },
    { category: 'Gaming', insight: 'Gaming domains showing strong buyer interest - 23% above average' },
    { category: 'Green Tech', insight: 'Emerging trend in sustainable tech domains - untapped market' }
  ],
  marketSummary: 'Overall market sentiment is positive with strong demand for AI, Web3, and NFT-related domains. Premium short domains continue to appreciate, while niche tech domains show highest growth potential.'
};

export const AIInsightsPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Market Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span>AI Market Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{MOCK_INSIGHTS.marketSummary}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_INSIGHTS.topPerformers.map((performer, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{performer.domain}</span>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Score: {performer.score}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{performer.reason}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span>Risk Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {MOCK_INSIGHTS.riskAlerts.map((alert, index) => (
                <div key={index} className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{alert.domain}</span>
                    <Badge 
                      className={
                        alert.risk === 'high' 
                          ? 'bg-red-100 text-red-800 border-red-200' 
                          : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }
                    >
                      {alert.risk} risk
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.issue}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Opportunities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <span>Investment Opportunities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_INSIGHTS.opportunities.map((opportunity, index) => (
              <div key={index} className="p-4 border rounded-lg bg-primary/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-primary">{opportunity.category}</span>
                  <Badge variant="outline">Trending</Badge>
                </div>
                <p className="text-sm">{opportunity.insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
