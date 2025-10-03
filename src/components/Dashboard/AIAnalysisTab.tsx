import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb } from 'lucide-react';

const mockAIData = {
  valuations: [
    { domain: "banmono.ai", predictedFloorETH: 1.1, confidence: 0.87, liquidity: "High" },
    { domain: "ecoenergy.io", predictedFloorETH: 0.7, confidence: 0.74, liquidity: "Medium" },
    { domain: "greenchain.xyz", predictedFloorETH: 1.4, confidence: 0.81, liquidity: "High" },
    { domain: "quantumlabs.ai", predictedFloorETH: 2.3, confidence: 0.92, liquidity: "Very High" }
  ],
  categoryTrends: [
    { category: "Eco / Green Domains", growth30dPercent: "+14%", momentumScore: 0.76 },
    { category: ".ai Extension", growth30dPercent: "+21%", momentumScore: 0.89 },
    { category: "Fintech Domains", growth30dPercent: "+9%", momentumScore: 0.64 },
    { category: "Metaverse / XR", growth30dPercent: "-5%", momentumScore: 0.42 }
  ],
  recommendations: [
    { domain: "banmono.ai", action: "Raise Price", newSuggestedPriceETH: 1.3, rationale: "AI valuation indicates strong momentum in eco-friendly + AI keyword overlap." },
    { domain: "ecoenergy.io", action: "List Domain", newSuggestedPriceETH: 0.75, rationale: "Search volume up 11% week-over-week, undervalued relative to peers." },
    { domain: "quantumlabs.ai", action: "Hold", rationale: "High predicted growth, but limited liquidity for quick exits." }
  ],
  predictiveSignals: [
    { signal: "Rising Demand", domain: "greenchain.xyz", indicator: "Social mentions up 35% this week", impact: "Expected floor +10% in next 7 days" },
    { signal: "Market Cooling", domain: "metasupply.ai", indicator: "Decline in offers (-20%) MoM", impact: "Lower bid depth, expect -5% adjustment" }
  ]
};

export const AIAnalysisTab: FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">AI Domain Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background/10 border-border/20">
          <CardHeader>
            <CardTitle className="text-white">Domain Valuations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAIData.valuations.map((val, idx) => (
              <div key={idx} className="p-3 bg-background/5 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-white font-medium">{val.domain}</span>
                  <Badge variant={val.liquidity === "Very High" || val.liquidity === "High" ? "default" : "secondary"}>
                    {val.liquidity}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Predicted Floor</span>
                  <span className="text-white font-semibold">{val.predictedFloorETH} ETH</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-white/70">Confidence</span>
                  <span className="text-emerald-400">{(val.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-background/10 border-border/20">
          <CardHeader>
            <CardTitle className="text-white">Category Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockAIData.categoryTrends.map((trend, idx) => (
              <div key={idx} className="p-3 bg-background/5 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-medium">{trend.category}</span>
                  <div className="flex items-center gap-2">
                    {trend.growth30dPercent.startsWith('+') ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                    <span className={trend.growth30dPercent.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}>
                      {trend.growth30dPercent}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/70">Momentum Score</span>
                  <span className="text-white">{(trend.momentumScore * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background/10 border-border/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockAIData.recommendations.map((rec, idx) => (
            <div key={idx} className="p-4 bg-background/5 rounded-lg border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-white font-semibold">{rec.domain}</span>
                  <Badge className="ml-2" variant={rec.action === "Raise Price" ? "default" : rec.action === "List Domain" ? "secondary" : "outline"}>
                    {rec.action}
                  </Badge>
                </div>
                {rec.newSuggestedPriceETH && (
                  <span className="text-emerald-400 font-semibold">{rec.newSuggestedPriceETH} ETH</span>
                )}
              </div>
              <p className="text-white/70 text-sm">{rec.rationale}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-background/10 border-border/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Predictive Signals
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mockAIData.predictiveSignals.map((signal, idx) => (
            <div key={idx} className="p-4 bg-background/5 rounded-lg border border-white/10">
              <div className="flex items-start gap-3">
                <Badge variant={signal.signal === "Rising Demand" ? "default" : "destructive"}>
                  {signal.signal}
                </Badge>
                <div className="flex-1">
                  <div className="text-white font-medium mb-1">{signal.domain}</div>
                  <div className="text-white/70 text-sm mb-1">{signal.indicator}</div>
                  <div className="text-white/60 text-xs">{signal.impact}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
