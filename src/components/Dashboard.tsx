import React from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useDoma } from '@/contexts/DomaContext';
import { useMetrics } from '@/contexts/MetricsContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardSkeleton, MetricCardSkeleton, DomainCardSkeleton } from './LoadingStates';
import MetricCard from './MetricCard';
import DomainTokenization from './DomainTokenization';
import OnboardingTour from './OnboardingTour';
import Logo from './Logo';

const Dashboard: React.FC = () => {
  const { isConnected, connectWallet, account, network } = useWeb3();
  const { userDomains, marketplaceDomains, listDomain, isLoading } = useDoma();
  const { metrics } = useMetrics();
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showOnboarding, setShowOnboarding] = React.useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Check if user is new (no domains tokenized yet)
  const isNewUser = userDomains.length === 0 && marketplaceDomains.length === 0;

  // Show onboarding for new users
  React.useEffect(() => {
    if (isConnected && isNewUser && !localStorage.getItem('domainfi-onboarding-completed')) {
      setShowOnboarding(true);
    }
  }, [isConnected, isNewUser]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        
        <Card className="w-full max-w-md bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-md border border-border/50 shadow-2xl shadow-primary/10 relative z-10">
          <CardHeader className="text-center pb-6">
            <div className="mb-4 flex justify-center">
              <Logo size="lg" showText={true} showTagline={false} variant="default" className="animate-float" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DomainFi Protocol
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Tokenize, trade, and fractionalize domain names on blockchain
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              onClick={connectWallet} 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium py-3 transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <span>🔗</span>
              Connect Wallet
              </div>
            </Button>
            <div className="text-sm text-muted-foreground text-center bg-muted/30 rounded-lg p-3">
              Connect your wallet to access domain tokenization and trading
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold text-black dark:text-white">
              DomainFi Analytics Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm">Connected: {account?.slice(0, 6)}...{account?.slice(-4)}</span>
              </div>
              {network && (
                <Badge variant="outline" className="text-xs">
                  {network.name}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border-emerald-500/20 text-emerald-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
              Live Protocol Data
            </Badge>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
              className="hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
            >
              {isRefreshing ? (
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              ) : (
                <span>🔄</span>
              )}
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Transactions"
            value={metrics.totalTransactions}
            change={metrics.dailyTransactions}
            changeLabel="today"
            icon="📊"
          />
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers}
            change={15}
            changeLabel="% growth"
            icon="👥"
          />
          <MetricCard
            title="Protocol Revenue"
            value={`$${Math.floor(metrics.totalRevenue).toLocaleString()}`}
            change={`$${Math.floor(metrics.projectedRevenue)}`}
            changeLabel="projected monthly"
            icon="💰"
          />
          <MetricCard
            title="Domains Tokenized"
            value={metrics.domainStats.totalTokenized + marketplaceDomains.length}
            change={metrics.domainStats.totalListed}
            changeLabel="listed for sale"
            icon="🌐"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Domain Tokenization */}
          <div className="lg:col-span-1">
            <DomainTokenization />
          </div>

          {/* User Domains */}
          <div className="lg:col-span-1">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-xl">🏠</span>
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Your Domains ({userDomains.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                {userDomains.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3 opacity-50">🌐</div>
                    <p className="text-muted-foreground">
                    No domains tokenized yet
                  </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start by tokenizing your first domain
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userDomains.map((domain) => (
                      <div key={domain.tokenId} className="group/item flex justify-between items-center p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <span className="font-medium text-foreground group-hover/item:text-primary transition-colors duration-300">
                            {domain.name}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="hover:bg-primary/10 hover:border-primary/30 transition-all duration-300"
                          onClick={() => {
                            const price = prompt('Enter price in ETH:');
                            if (price) listDomain(domain.tokenId, price);
                          }}
                        >
                          List
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Marketplace */}
          <div className="lg:col-span-1">
            <Card className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-xl">🏪</span>
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Marketplace ({marketplaceDomains.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  {marketplaceDomains.slice(0, 5).map((domain) => (
                    <div key={domain.tokenId} className="group/item flex justify-between items-center p-3 bg-gradient-to-r from-muted/30 to-muted/10 rounded-lg border border-border/30 hover:border-primary/30 transition-all duration-300 hover:shadow-md">
                      <div className="flex-1">
                        <div className="font-medium text-foreground group-hover/item:text-primary transition-colors duration-300">
                          {domain.name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                          {domain.owner?.slice(0, 6)}...{domain.owner?.slice(-4)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground group-hover/item:text-primary transition-colors duration-300">
                          {domain.price} ETH
                        </div>
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="mt-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white transition-all duration-300 hover:shadow-md"
                        >
                          Buy
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl animate-float">🔗</span>
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Tokenization
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                Convert domain ownership into blockchain tokens with verifiable proof of ownership.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl animate-float" style={{animationDelay: '1s'}}>🏪</span>
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Marketplace
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                Trade tokenized domains in a decentralized marketplace with transparent pricing.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl animate-float" style={{animationDelay: '2s'}}>🎯</span>
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Fractionalization
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                Split domain ownership into fractional shares for collaborative ownership.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Button */}
      <Button
        onClick={() => setShowOnboarding(true)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-40"
        size="sm"
      >
        ?
      </Button>

      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        onComplete={() => {
          setShowOnboarding(false);
          localStorage.setItem('domainfi-onboarding-completed', 'true');
        }}
      />
    </div>
  );
};

export default Dashboard;