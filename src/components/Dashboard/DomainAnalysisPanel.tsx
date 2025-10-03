import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, TrendingUp, Eye, Zap, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DomainAnalysis {
  domain: string;
  overallScore: number;
  metrics: {
    seoScore: number;
    brandability: number;
    memorability: number;
    marketDemand: number;
    techReadiness: number;
    legalRisk: number;
  };
  insights: string[];
  recommendations: string[];
  predictedValue: {
    current: number;
    projected12m: number;
    confidence: number;
  };
  competitorAnalysis: {
    similarDomains: string[];
    averagePrice: number;
    marketPosition: 'premium' | 'mid-tier' | 'emerging';
  };
}

const MOCK_ANALYSIS: DomainAnalysis = {
  domain: 'crypto.ai',
  overallScore: 87,
  metrics: {
    seoScore: 92,
    brandability: 89,
    memorability: 94,
    marketDemand: 78,
    techReadiness: 85,
    legalRisk: 15
  },
  insights: [
    "High brandability score due to memorable .ai extension",
    "Strong SEO potential with keyword relevance",
    "Growing market demand in AI sector (+23% YoY)",
    "Low legal risk assessment"
  ],
  recommendations: [
    "Consider listing at premium pricing tier",
    "Develop content strategy around AI themes",
    "Target tech startup demographic",
    "Implement immediate tokenization"
  ],
  predictedValue: {
    current: 15200,
    projected12m: 22800,
    confidence: 84
  },
  competitorAnalysis: {
    similarDomains: ['aitech.eth', 'smartai.com', 'aibot.xyz'],
    averagePrice: 12500,
    marketPosition: 'premium'
  }
};

export const DomainAnalysisPanel: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [analysis, setAnalysis] = useState<DomainAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const analyzeHandler = async () => {
    if (!selectedDomain) {
      toast({
        title: "Domain Required",
        description: "Please enter a domain name to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setAnalysis({ ...MOCK_ANALYSIS, domain: selectedDomain });
      setLoading(false);
      toast({
        title: "Analysis Complete",
        description: `Successfully analyzed ${selectedDomain}`,
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Analysis Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-primary" />
            <span>AI Domain Analyzer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input 
              placeholder="Enter domain name (e.g., myawesomeai.eth)"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={analyzeHandler} 
              disabled={loading || !selectedDomain}
              className="min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4" />
                  <span>Analyze</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Overall Score</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="56" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="transparent" 
                      className="text-muted"
                    />
                    <circle 
                      cx="64" 
                      cy="64" 
                      r="56" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      fill="transparent" 
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - analysis.overallScore / 100)}`}
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary">{analysis.overallScore}</span>
                  </div>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20">
                  Premium Grade
                </Badge>
              </CardContent>
            </Card>

            {/* Detailed Metrics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Detailed Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analysis.metrics).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-muted-foreground">{value}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Analysis Tabs */}
          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="insights">AI Insights</TabsTrigger>
              <TabsTrigger value="valuation">Valuation</TabsTrigger>
              <TabsTrigger value="competitors">Competition</TabsTrigger>
              <TabsTrigger value="recommendations">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="insights">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5" />
                    <span>AI-Generated Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.insights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
                        <Zap className="w-4 h-4 text-primary mt-0.5" />
                        <p className="text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="valuation">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Current Valuation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">
                        ${analysis.predictedValue.current.toLocaleString()}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {analysis.predictedValue.confidence}% confidence
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>12-Month Projection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">
                        ${analysis.predictedValue.projected12m.toLocaleString()}
                      </div>
                      <div className="flex items-center justify-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm text-green-600">
                          +{Math.round(((analysis.predictedValue.projected12m - analysis.predictedValue.current) / analysis.predictedValue.current) * 100)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="competitors">
              <Card>
                <CardHeader>
                  <CardTitle>Competitive Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">Market Position</span>
                      <Badge className="capitalize">
                        {analysis.competitorAnalysis.marketPosition}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">Average Market Price</span>
                      <span className="font-bold">
                        ${analysis.competitorAnalysis.averagePrice.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium mb-2 block">Similar Domains</span>
                      <div className="flex flex-wrap gap-2">
                        {analysis.competitorAnalysis.similarDomains.map((domain, index) => (
                          <Badge key={index} variant="outline">
                            {domain}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="w-5 h-5" />
                    <span>AI Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.recommendations.map((recommendation, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{recommendation}</p>
                          <Button variant="outline" size="sm" className="mt-2">
                            Implement
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};
