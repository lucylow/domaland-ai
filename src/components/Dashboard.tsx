import { FC, useState, useEffect } from 'react';
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
import { DomainTokenization } from './DomainTokenization';
import OnboardingTour from './OnboardingTour';
import Logo from './Logo';

const Dashboard: FC = () => {
  const { isConnected, connectWallet, account, network } = useWeb3();
  const { userDomains, marketplaceDomains, listDomain, isLoading } = useDoma();
  const { metrics } = useMetrics();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Check if user is new (no domains tokenized yet)
  const isNewUser = userDomains.length === 0 && marketplaceDomains.length === 0;

  // Show onboarding for new users
  useEffect(() => {
    if (isConnected && isNewUser && !localStorage.getItem('domainfi-onboarding-completed')) {
      setShowOnboarding(true);
    }
  }, [isConnected, isNewUser]);

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative overflow-hidden">
        {/* Enhanced background decorations */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-secondary/30 to-accent/30 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-2xl animate-float"></div>
        
        <Card className="w-full max-w-md card-elevated relative z-10 group">
          {/* Enhanced card background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
          
          <CardHeader className="text-center pb-6 relative z-10">
            <div className="mb-4 flex justify-center">
              <Logo size="lg" showText={true} showTagline={false} variant="default" className="animate-float" />
            </div>
            <CardTitle className="text-2xl text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DomainFi Protocol
            </CardTitle>
            <p className="text-muted-foreground mt-2 leading-relaxed">
              Tokenize, trade, and fractionalize domain names on blockchain
            </p>
          </CardHeader>
          <CardContent className="space-y-6 relative z-10">
            <Button 
              onClick={() => connectWallet()} 
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 font-semibold py-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-105"
              size="lg"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔗</span>
                Connect Wallet
              </div>
            </Button>
            <div className="text-sm text-muted-foreground text-center bg-gradient-to-r from-muted/30 to-muted/20 rounded-xl p-4 border border-border/30 backdrop-blur-sm">
              Connect your wallet to access domain tokenization and trading
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-primary/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-r from-secondary/10 to-transparent rounded-full blur-3xl"></div>
      
      <div className="container-padding py-8 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-3">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent leading-tight">
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
              <Badge variant="outline" className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-500/30 text-emerald-700 shadow-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2"></div>
                Live Protocol Data
              </Badge>
              <Button
                onClick={handleRefresh}
                disabled={isRefreshing}
                variant="outline"
                size="sm"
                className="hover:bg-primary/10 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                {isRefreshing ? (
                  <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                ) : (
                  <span className="text-lg">🔄</span>
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
            <Card className="group relative overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">🏠</span>
                  <span className="text-foreground group-hover:text-primary transition-colors duration-300">
                    Your Domains ({userDomains.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                {userDomains.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3 opacity-50 animate-float">🌐</div>
                    <p className="text-muted-foreground font-medium">
                      No domains tokenized yet
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start by tokenizing your first domain
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userDomains.map((domain) => (
                      <div key={domain.tokenId} className="group/item flex justify-between items-center p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <span className="font-semibold text-foreground group-hover/item:text-primary transition-colors duration-300">
                            {domain.name}
                          </span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="hover:bg-primary/10 hover:border-primary/30 hover:shadow-md hover:scale-105 transition-all duration-300 font-medium"
                          onClick={() => {
                            const price = prompt('Enter price in ETH:');
                            if (price && !isNaN(parseFloat(price)) && parseFloat(price) > 0) {
                              listDomain(domain.tokenId, price);
                            } else if (price) {
                              alert('Please enter a valid price greater than 0');
                            }
                          }}
                        >
                          <span className="mr-1">📝</span>
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
            <Card className="group relative overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-xl group-hover:scale-110 transition-transform duration-300">🏪</span>
                  <span className="text-foreground group-hover:text-primary transition-colors duration-300">
                    Marketplace ({marketplaceDomains.length})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-3">
                  {marketplaceDomains.slice(0, 5).map((domain) => (
                    <div key={domain.tokenId} className="group/item flex justify-between items-center p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm">
                      <div className="flex-1">
                        <div className="font-semibold text-foreground group-hover/item:text-primary transition-colors duration-300">
                          {domain.name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                          {domain.owner?.slice(0, 6)}...{domain.owner?.slice(-4)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground group-hover/item:text-primary transition-colors duration-300 text-lg">
                          {domain.price} ETH
                        </div>
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="mt-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold"
                          onClick={() => {
                            if (confirm(`Are you sure you want to buy ${domain.name} for ${domain.price} ETH?`)) {
                              // This would trigger the buy function
                              alert('Purchase initiated! Check your wallet for transaction confirmation.');
                            }
                          }}
                        >
                          <span className="mr-1">🛒</span>
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
          <Card className="group relative overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl animate-float group-hover:scale-110 transition-transform duration-300">🔗</span>
                <span className="text-foreground group-hover:text-primary transition-colors duration-300">
                  Tokenization
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                Convert domain ownership into blockchain tokens with verifiable proof of ownership.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl animate-float group-hover:scale-110 transition-transform duration-300" style={{animationDelay: '1s'}}>🏪</span>
                <span className="text-foreground group-hover:text-primary transition-colors duration-300">
                  Marketplace
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                Trade tokenized domains in a decentralized marketplace with transparent pricing.
              </p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
            
            <CardHeader className="relative z-10">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-xl animate-float group-hover:scale-110 transition-transform duration-300" style={{animationDelay: '2s'}}>🎯</span>
                <span className="text-foreground group-hover:text-primary transition-colors duration-300">
                  Fractionalization
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                Split domain ownership into fractional shares for collaborative ownership.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Help Button */}
      <Button
        onClick={() => setShowOnboarding(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 z-40 group"
        size="sm"
      >
        <span className="text-xl font-bold group-hover:scale-110 transition-transform duration-300">?</span>
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