import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Brain, Search, MessageSquare, BarChart3, Zap, Activity } from 'lucide-react';
import { DomainAnalysisPanel } from './DomainAnalysisPanel';
import { AIValuationPanel } from './AIValuationPanel';
import { ContentGenerationPanel } from './ContentGenerationPanel';
import { MarketMonitoringPanel } from './MarketMonitoringPanel';
import { AIInsightsPanel } from './AIInsightsPanel';

interface AIAgent {
  id: string;
  name: string;
  type: 'analysis' | 'valuation' | 'content' | 'negotiation' | 'monitoring';
  status: 'active' | 'idle' | 'processing';
  lastUpdate: string;
  confidence: number;
  icon: React.ComponentType<{ className?: string }>;
}

const MOCK_AGENTS: AIAgent[] = [
  {
    id: 'domain-analyst',
    name: 'Domain Analyst',
    type: 'analysis',
    status: 'active',
    lastUpdate: '2 minutes ago',
    confidence: 94,
    icon: Search
  },
  {
    id: 'price-prophet',
    name: 'Price Prophet',
    type: 'valuation',
    status: 'processing',
    lastUpdate: '30 seconds ago',
    confidence: 87,
    icon: TrendingUp
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    type: 'content',
    status: 'idle',
    lastUpdate: '5 minutes ago',
    confidence: 91,
    icon: Brain
  },
  {
    id: 'deal-negotiator',
    name: 'Deal Negotiator',
    type: 'negotiation',
    status: 'active',
    lastUpdate: '1 minute ago',
    confidence: 88,
    icon: MessageSquare
  }
];

const AIAgentCard: React.FC<{ agent: AIAgent }> = ({ agent }) => {
  const IconComponent = agent.icon;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'idle': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="w-4 h-4 text-primary" />
            </div>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
          </div>
          <Badge variant="outline" className="text-xs">
            {agent.confidence}% confident
          </Badge>
        </div>
        <CardTitle className="text-sm font-medium">{agent.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Performance</span>
            <span>{agent.confidence}%</span>
          </div>
          <Progress value={agent.confidence} className="h-1" />
          <p className="text-xs text-muted-foreground">Updated {agent.lastUpdate}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export const AICommandCenter: React.FC = () => {
  const [activeAgents] = useState<AIAgent[]>(MOCK_AGENTS);

  return (
    <div className="space-y-6">
      {/* AI Command Center Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Command Center</h1>
          <p className="text-muted-foreground">Intelligent domain analysis powered by advanced AI agents</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <Zap className="w-3 h-3 mr-1" />
            {activeAgents.filter(a => a.status === 'active').length} Agents Active
          </Badge>
        </div>
      </div>

      {/* AI Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeAgents.map((agent) => (
          <AIAgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="analysis">Domain Analysis</TabsTrigger>
          <TabsTrigger value="valuation">AI Valuation</TabsTrigger>
          <TabsTrigger value="content">Content Gen</TabsTrigger>
          <TabsTrigger value="monitoring">Market Monitor</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis">
          <DomainAnalysisPanel />
        </TabsContent>
        
        <TabsContent value="valuation">
          <AIValuationPanel />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentGenerationPanel />
        </TabsContent>
        
        <TabsContent value="monitoring">
          <MarketMonitoringPanel />
        </TabsContent>
        
        <TabsContent value="insights">
          <AIInsightsPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};
