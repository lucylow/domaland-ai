import { useState, FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWeb3 } from '@/contexts/Web3Context';
import { useDoma } from '@/contexts/DomaContext';

const Navigation: FC = () => {
  const { isConnected, connectWallet, account, disconnectWallet, isMockMode, isConnecting, error, clearError } = useWeb3();
  const { userDomains, marketplaceDomains } = useDoma();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: '📊', description: 'Overview & metrics' },
    { path: '/marketplace', label: 'Domains', icon: '🌐', description: 'Browse & trade' },
    { path: '/fractional', label: 'Portfolio', icon: '💼', description: 'Your assets' },
    { path: '/analytics', label: 'Analytics', icon: '📈', description: 'Market insights' },
    { path: '/chat', label: 'Chat', icon: '💬', description: 'Trade negotiations' },
    { path: '/track5-demo', label: 'Track 5 Demo', icon: '🏆', description: 'Landing pages & messaging' },
    { path: '/help', label: 'Help', icon: '❓', description: 'Support & guides' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span>⚠️</span>
          <span className="text-sm">{error}</span>
          <button 
            onClick={clearError}
            className="ml-2 text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}
      
      <header className="fixed top-0 w-full bg-card/95 backdrop-blur-md border-b border-border/50 shadow-sm z-50">
        <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/welcome" className="flex items-center gap-2 text-2xl font-bold text-gradient hover:scale-105 transition-transform duration-300">
            <span className="text-2xl animate-float">🌐</span>
            DomaLand.AI
            <span className="text-xs text-muted-foreground ml-2 font-normal">DYNAMIC DIGITAL ASSETS</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 relative ${
                  isActivePath(item.path)
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-sm'
                }`}
                title={item.description}
              >
                <span className="text-lg group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
                 {item.path === '/marketplace' && marketplaceDomains.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs animate-pulse">
                    {marketplaceDomains.length}
                  </Badge>
                )}
                {item.path === '/' && userDomains.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs animate-pulse">
                    {userDomains.length}
                  </Badge>
                )}
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50">
                  {item.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                </div>
              </Link>
            ))}
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-3">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg border border-emerald-500/20">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-600">
                    {isMockMode ? 'Mock' : 'Connected'}: {account?.slice(0, 6)}...{account?.slice(-4)}
                  </span>
                  {isMockMode && (
                    <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                      DEV
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  size="sm"
                  className="hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition-all duration-300"
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  {isConnecting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Connecting...</span>
                    </>
                  ) : (
                    <>
                      <span>🔗</span>
                      <span className="hidden sm:inline">Connect Wallet</span>
                    </>
                  )}
                </div>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="text-lg">☰</span>
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    isActivePath(item.path)
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <span className="text-lg group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs opacity-70">{item.description}</div>
                  </div>
                   {item.path === '/marketplace' && marketplaceDomains.length > 0 && (
                    <Badge variant="secondary" className="ml-auto text-xs animate-pulse">
                      {marketplaceDomains.length}
                    </Badge>
                   )}
                   {item.path === '/' && userDomains.length > 0 && (
                    <Badge variant="secondary" className="ml-auto text-xs animate-pulse">
                      {userDomains.length}
                    </Badge>
                   )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
};

export default Navigation;