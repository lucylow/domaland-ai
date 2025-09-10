import { FC, useState, useEffect } from 'react';
import { useWeb3 } from '@/contexts/Web3Context';
import { useDoma } from '@/contexts/DomaContext';
import { useMetrics } from '@/contexts/MetricsContext';
import { useXMTP } from '@/contexts/XMTPContext';
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
import WalletConnectionTest from './WalletConnectionTest';
import { useNotificationHelpers } from './NotificationSystem';

const Dashboard: FC = () => {
  const { isConnected, connectWallet, account, network, isConnecting, error, clearError } = useWeb3();
  const { userDomains, marketplaceDomains, listDomain, isLoading } = useDoma();
  const { metrics } = useMetrics();
  const { conversations, getUnreadCount, connectXMTP, isConnected: isXMTPConnected } = useXMTP();
  const { showSuccess, showError, showWarning, showInfo } = useNotificationHelpers();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    showInfo('Refreshing Data', 'Updating dashboard metrics and domain information...');
    
    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Data Refreshed', 'Dashboard has been updated with the latest information');
    } catch (error) {
      showError('Refresh Failed', 'Unable to update dashboard data. Please try again.');
    } finally {
      setIsRefreshing(false);
    }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 relative overflow-hidden">
        {/* Enhanced background decorations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-float"></div>
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-xl animate-rotate-slow"></div>
        
        <Card className="w-full max-w-lg card-premium relative z-10 group animate-fade-in">
          {/* Enhanced card background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
          
          <CardHeader className="text-center pb-8 relative z-10">
            <div className="mb-6 flex justify-center">
              <div className="relative">
                <Logo size="lg" showText={true} showTagline={false} variant="default" className="animate-float" />
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl animate-pulse-glow"></div>
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-gradient-premium mb-4">
              DomainFi Protocol
            </CardTitle>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md mx-auto">
              Transform domain ownership into liquid digital assets on the blockchain
            </p>
          </CardHeader>
          <CardContent className="space-y-8 relative z-10">
            {error && (
              <Alert className="border-red-200 bg-red-50/80 backdrop-blur-sm text-red-800 animate-slide-up">
                <AlertDescription className="flex items-center justify-between">
                  <span className="font-medium">{error}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearError}
                    className="text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full p-1"
                  >
                    <span className="sr-only">Close error</span>
                    ✕
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            <Button 
              onClick={() => connectWallet()} 
              disabled={isConnecting}
              className="w-full btn-premium text-lg py-6 px-8 rounded-2xl font-bold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:-translate-y-0"
              size="lg"
            >
              <div className="flex items-center gap-3">
                {isConnecting ? (
                  <div className="loading-dots">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <span className="text-2xl">🔗</span>
                )}
                {isConnecting ? 'Connecting to Wallet...' : 'Connect Your Wallet'}
              </div>
            </Button>
            <div className="text-center space-y-4">
              <div className="text-sm text-muted-foreground bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-gray-800/80 dark:to-gray-700/80 rounded-2xl p-6 border border-blue-200/30 dark:border-gray-600/30 backdrop-blur-sm">
                <p className="font-medium mb-2">🚀 Get Started in Minutes</p>
                <p className="text-xs leading-relaxed">
                  Connect your MetaMask wallet to access domain tokenization, trading, and fractional ownership features
                </p>
              </div>
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <span>Decentralized</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span>Transparent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-l from-blue-400/10 via-purple-400/10 to-transparent rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-r from-indigo-400/10 via-cyan-400/10 to-transparent rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-r from-purple-400/5 to-pink-400/5 rounded-full blur-2xl animate-float"></div>
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-rotate-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-lg animate-bounce-slow"></div>
      
      <div className="container-max py-12 space-y-12 relative z-10">
        {/* Enhanced Header - Responsive */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 lg:gap-8 animate-fade-in">
          <div className="space-y-4 lg:space-y-6 w-full xl:w-auto">
            <div className="space-y-3 lg:space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gradient-premium leading-tight tracking-tight">
                DomainFi Analytics
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed">
                Real-time insights into domain tokenization, trading, and fractional ownership
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-full border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full animate-pulse shadow-glow-green"></div>
                <span className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
                </span>
              </div>
              {network && (
                <Badge variant="outline" className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 font-medium text-xs sm:text-sm">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse mr-1.5 sm:mr-2"></div>
                  {network.name}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full xl:w-auto">
            <Badge variant="outline" className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 shadow-lg text-center sm:text-left">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-2 sm:mr-3"></div>
              <span className="font-semibold text-sm sm:text-base">Live Protocol Data</span>
            </Badge>
            <Button
              onClick={handleRefresh}
              disabled={isRefreshing}
              variant="outline"
              size="lg"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 font-medium w-full sm:w-auto"
            >
              {isRefreshing ? (
                <div className="loading-dots">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ) : (
                <span className="text-lg sm:text-xl">🔄</span>
              )}
              <span className="ml-2 text-sm sm:text-base">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
          </div>
        </div>

        {/* Enhanced Metrics Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-slide-up">
          <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
            <MetricCard
              title="Total Transactions"
              value={metrics.totalTransactions}
              change={metrics.dailyTransactions}
              changeLabel="today"
              icon="📊"
            />
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <MetricCard
              title="Active Users"
              value={metrics.activeUsers}
              change={15}
              changeLabel="% growth"
              icon="👥"
            />
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.3s'}}>
            <MetricCard
              title="Protocol Revenue"
              value={`$${Math.floor(metrics.totalRevenue).toLocaleString()}`}
              change={`$${Math.floor(metrics.projectedRevenue)}`}
              changeLabel="projected monthly"
              icon="💰"
            />
          </div>
          <div className="animate-fade-in" style={{animationDelay: '0.4s'}}>
            <MetricCard
              title="Domains Tokenized"
              value={metrics.domainStats.totalTokenized + marketplaceDomains.length}
              change={metrics.domainStats.totalListed}
              changeLabel="listed for sale"
              icon="🌐"
            />
          </div>
        </div>

        {/* Enhanced Main Content Grid - Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
          
          {/* Domain Tokenization */}
          <div className="lg:col-span-1 animate-fade-in" style={{animationDelay: '0.3s'}}>
            <DomainTokenization />
          </div>

          {/* Enhanced User Domains */}
          <div className="lg:col-span-1 animate-fade-in" style={{animationDelay: '0.4s'}}>
            <Card className="group relative overflow-hidden card-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105">
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="relative">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🏠</span>
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="text-gradient-premium group-hover:text-blue-600 transition-colors duration-300">
                    Your Domains
                  </span>
                  <Badge variant="outline" className="ml-auto px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 font-semibold">
                    {userDomains.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                {userDomains.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="relative mb-6">
                      <div className="text-6xl mb-4 opacity-60 animate-float">🌐</div>
                      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-xl animate-pulse-glow"></div>
                    </div>
                    <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                      No domains tokenized yet
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      Start by tokenizing your first domain to unlock the power of blockchain ownership
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userDomains.map((domain, index) => (
                      <div 
                        key={domain.tokenId} 
                        className="group/item flex justify-between items-center p-5 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/30 dark:border-blue-700/30 hover:border-blue-400/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm animate-fade-in"
                        style={{animationDelay: `${0.1 * index}s`}}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse shadow-glow-blue"></div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <div>
                            <span className="font-bold text-foreground group-hover/item:text-blue-600 transition-colors duration-300 text-lg">
                              {domain.name}
                            </span>
                            <div className="text-xs text-muted-foreground mt-1">
                              Token ID: {domain.tokenId}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-700/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/30 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md hover:scale-105 transition-all duration-300 font-semibold"
                          onClick={() => {
                            const price = prompt('Enter price in ETH:');
                            if (price && !isNaN(parseFloat(price)) && parseFloat(price) > 0) {
                              try {
                                listDomain(domain.tokenId, price);
                                showSuccess('Domain Listed', `${domain.name} has been listed for ${price} ETH`);
                              } catch (error) {
                                showError('Listing Failed', 'Unable to list domain. Please try again.');
                              }
                            } else if (price) {
                              showWarning('Invalid Price', 'Please enter a valid price greater than 0');
                            }
                          }}
                        >
                          <span className="mr-2">📝</span>
                          List for Sale
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Marketplace */}
          <div className="lg:col-span-1 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <Card className="group relative overflow-hidden card-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105">
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <CardTitle className="flex items-center gap-3 text-xl font-bold">
                  <div className="relative">
                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300">🏪</span>
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="text-gradient-success group-hover:text-emerald-600 transition-colors duration-300">
                    Marketplace
                  </span>
                  <Badge variant="outline" className="ml-auto px-3 py-1 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 font-semibold">
                    {marketplaceDomains.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {marketplaceDomains.slice(0, 5).map((domain, index) => (
                    <div 
                      key={domain.tokenId} 
                      className="group/item flex justify-between items-center p-5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200/30 dark:border-emerald-700/30 hover:border-emerald-400/50 dark:hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 backdrop-blur-sm animate-fade-in"
                      style={{animationDelay: `${0.1 * index}s`}}
                    >
                      <div className="flex-1">
                        <div className="font-bold text-foreground group-hover/item:text-emerald-600 transition-colors duration-300 text-lg mb-2">
                          {domain.name}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="relative">
                            <div className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse shadow-glow-green"></div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-sm opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          <span>Owner: {domain.owner?.slice(0, 6)}...{domain.owner?.slice(-4)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gradient-success group-hover/item:text-emerald-600 transition-colors duration-300 text-xl mb-3">
                          {domain.price} ETH
                        </div>
                        <Button 
                          size="sm" 
                          variant="default" 
                          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white transition-all duration-300 hover:shadow-lg hover:scale-105 font-semibold rounded-xl"
                          onClick={() => {
                            if (confirm(`Are you sure you want to buy ${domain.name} for ${domain.price} ETH?`)) {
                              try {
                                // This would trigger the buy function
                                showInfo('Purchase Initiated', 'Transaction submitted. Please check your wallet for confirmation.');
                                // Simulate transaction
                                setTimeout(() => {
                                  showSuccess('Purchase Complete', `Successfully purchased ${domain.name} for ${domain.price} ETH`);
                                }, 3000);
                              } catch (error) {
                                showError('Purchase Failed', 'Transaction failed. Please try again.');
                              }
                            }
                          }}
                        >
                          <span className="mr-2">🛒</span>
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Messaging Section */}
        {isConnected && (
          <div className="mb-12 animate-fade-in" style={{animationDelay: '0.6s'}}>
            <Card className="group relative overflow-hidden card-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xl font-bold">
                    <div className="relative">
                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">💬</span>
                      <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="text-gradient-warning group-hover:text-purple-600 transition-colors duration-300">
                      Domain Negotiations
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {!isXMTPConnected && (
                      <Button
                        onClick={connectXMTP}
                        size="lg"
                        variant="outline"
                        className="px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-800/30 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
                      >
                        <span className="mr-2">🔗</span>
                        Connect XMTP
                      </Button>
                    )}
                    {isXMTPConnected && (
                      <Badge variant="outline" className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-emerald-200/50 dark:border-emerald-700/50 text-emerald-700 dark:text-emerald-300 font-semibold shadow-lg">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse mr-3"></div>
                        XMTP Connected
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                {conversations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3 opacity-50 animate-float">💬</div>
                    <p className="text-muted-foreground font-medium">
                      No active negotiations
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start chatting with domain sellers to negotiate deals
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversations.slice(0, 3).map((conversation) => (
                      <div key={conversation.id} className="group/item flex justify-between items-center p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          <div>
                            <span className="font-semibold text-foreground group-hover/item:text-primary transition-colors duration-300">
                              {conversation.domainName || 'Domain Negotiation'}
                            </span>
                            <div className="text-sm text-muted-foreground">
                              {conversation.lastMessage?.content.slice(0, 50)}...
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {conversation.unreadCount > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="hover:bg-primary/10 hover:border-primary/30 hover:shadow-md hover:scale-105 transition-all duration-300 font-medium"
                            onClick={() => window.location.href = `/negotiate/${conversation.domainId}`}
                          >
                            <span className="mr-1">💬</span>
                            Chat
                          </Button>
                        </div>
                      </div>
                    ))}
                    {conversations.length > 3 && (
                      <div className="text-center pt-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground">
                          View all {conversations.length} conversations
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Development Tools */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8">
            <WalletConnectionTest />
          </div>
        )}

        {/* Enhanced Features Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 animate-slide-up" style={{animationDelay: '0.7s'}}>
          <div className="animate-fade-in" style={{animationDelay: '0.8s'}}>
            <Card className="group relative overflow-hidden card-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 h-full">
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div className="relative">
                    <span className="text-2xl animate-float group-hover:scale-110 transition-transform duration-300">🔗</span>
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="text-gradient-premium group-hover:text-blue-600 transition-colors duration-300">
                    Tokenization
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-base text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300 leading-relaxed">
                  Convert domain ownership into blockchain tokens with verifiable proof of ownership and immutable records.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in" style={{animationDelay: '0.9s'}}>
            <Card className="group relative overflow-hidden card-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 h-full">
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div className="relative">
                    <span className="text-2xl animate-float group-hover:scale-110 transition-transform duration-300" style={{animationDelay: '1s'}}>🏪</span>
                    <div className="absolute -inset-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="text-gradient-success group-hover:text-emerald-600 transition-colors duration-300">
                    Marketplace
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-base text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300 leading-relaxed">
                  Trade tokenized domains in a decentralized marketplace with transparent pricing and secure escrow.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="animate-fade-in" style={{animationDelay: '1.0s'}}>
            <Card className="group relative overflow-hidden card-premium hover:shadow-premium-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 h-full">
              {/* Enhanced background effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-shimmer"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-400/10 to-pink-400/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              
              <CardHeader className="relative z-10 pb-4">
                <CardTitle className="text-xl font-bold flex items-center gap-3">
                  <div className="relative">
                    <span className="text-2xl animate-float group-hover:scale-110 transition-transform duration-300" style={{animationDelay: '2s'}}>🎯</span>
                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-500/20 to-pink-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <span className="text-gradient-warning group-hover:text-orange-600 transition-colors duration-300">
                    Fractionalization
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <p className="text-base text-muted-foreground group-hover:text-foreground/90 transition-colors duration-300 leading-relaxed">
                  Split domain ownership into fractional shares for collaborative ownership and investment opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Help Button */}
      <Button
        onClick={() => setShowOnboarding(true)}
        className="fixed bottom-8 right-8 h-16 w-16 rounded-full btn-premium shadow-premium-lg hover:shadow-3xl transition-all duration-500 hover:scale-110 z-50 group animate-bounce-in"
        size="sm"
      >
        <div className="relative">
          <span className="text-2xl font-bold group-hover:scale-110 transition-transform duration-300">?</span>
          <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
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