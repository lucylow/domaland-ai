import { FC, useState } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import ConnectWalletButton from './ConnectWalletButton';
import Logo from './Logo';
import { 
  LayoutDashboard, 
  Brain,
  ShoppingCart,
  PieChart,
  MessageSquare,
  BarChart3,
  Settings
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Tab content components
import { DashboardOverviewTab } from './Dashboard/DashboardOverviewTab';
import { AIAnalysisTab } from './Dashboard/AIAnalysisTab';
import { MarketplaceTab } from './Dashboard/MarketplaceTab';
import { PortfolioTab } from './Dashboard/PortfolioTab';
import { MessagingTab } from './Dashboard/MessagingTab';
import { AnalyticsTab } from './Dashboard/AnalyticsTab';
import { SettingsTab } from './Dashboard/SettingsTab';

const Dashboard: FC = () => {
  const { isConnected, account, network, error, clearError } = useWeb3();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'ai-analysis', label: 'AI Analysis', icon: Brain },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingCart },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart },
    { id: 'messaging', label: 'Messages', icon: MessageSquare },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        
        <Card className="w-full max-w-lg relative z-10 bg-background/95 backdrop-blur-md">
          <CardHeader className="text-center pb-8">
            <div className="mb-6 flex justify-center">
              <Logo size="lg" showText={true} showTagline={false} variant="default" />
            </div>
            <CardTitle className="text-4xl font-bold mb-4">
              DomaLand.AI Dashboard
            </CardTitle>
            <p className="text-lg text-muted-foreground">
              Connect your wallet to access the dashboard
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-destructive/50 text-destructive">
                <AlertDescription className="flex items-center justify-between">
                  <span>{error}</span>
                  <Button variant="ghost" size="sm" onClick={clearError}>✕</Button>
                </AlertDescription>
              </Alert>
            )}
            <ConnectWalletButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-blue-900">
      {/* Header */}
      <div className="bg-background/10 backdrop-blur-md border-b border-border/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">DomaLand.AI Dashboard</h1>
              <p className="text-sm text-white/70">
                Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs">
                {typeof network === 'string' ? network : network?.name || 'Unknown'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-7 h-auto p-1 bg-background/10 backdrop-blur-md border border-border/20 mb-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center space-y-1 p-3 text-white/70 data-[state=active]:bg-background/20 data-[state=active]:text-white rounded-md"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Content */}
          <div className="bg-background/10 backdrop-blur-md rounded-lg border border-border/20 min-h-[600px] p-6">
            <TabsContent value="overview" className="mt-0">
              <DashboardOverviewTab />
            </TabsContent>

            <TabsContent value="ai-analysis" className="mt-0">
              <AIAnalysisTab />
            </TabsContent>

            <TabsContent value="marketplace" className="mt-0">
              <MarketplaceTab />
            </TabsContent>

            <TabsContent value="portfolio" className="mt-0">
              <PortfolioTab />
            </TabsContent>

            <TabsContent value="messaging" className="mt-0">
              <MessagingTab />
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <AnalyticsTab />
            </TabsContent>

            <TabsContent value="settings" className="mt-0">
              <SettingsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
