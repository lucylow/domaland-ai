import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useWeb3 } from '@/contexts/Web3Context';
import { useDoma } from '@/contexts/DomaContext';
import { Menu, X, Wallet, User, Settings } from 'lucide-react';

const MobileNavigation: React.FC = () => {
  const { isConnected, connectWallet, account, disconnectWallet, isMockMode } = useWeb3();
  const { userDomains, marketplaceDomains } = useDoma();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { path: '/marketplace', label: 'Domains', icon: '🌐' },
    { path: '/fractional', label: 'Portfolio', icon: '💼' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
    { path: '/chat', label: 'Chat', icon: '💬' },
    { path: '/help', label: 'Help', icon: '❓' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="glass"
            size="icon"
            className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl animate-bounce-in"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="glass-card border-gradient-dark w-80">
          <SheetHeader className="space-y-4">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl text-gradient-primary">
                DomaLand.AI
              </SheetTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Wallet Status */}
            <div className="p-4 glass-card rounded-lg border-gradient-dark">
              {isConnected ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-emerald-600">
                      {isMockMode ? 'Mock Mode' : 'Connected'}
                    </span>
                    {isMockMode && (
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                        DEV
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {account?.slice(0, 6)}...{account?.slice(-4)}
                  </div>
                  <Button
                    onClick={() => {
                      disconnectWallet();
                      setIsOpen(false);
                    }}
                    variant="outline"
                    size="sm"
                    className="w-full hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
                  >
                    Disconnect
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Not Connected</span>
                  </div>
                  <Button
                    onClick={() => {
                      connectWallet();
                      setIsOpen(false);
                    }}
                    variant="gradient"
                    size="sm"
                    className="w-full"
                  >
                    Connect Wallet
                  </Button>
                </div>
              )}
            </div>
          </SheetHeader>

          {/* Navigation Items */}
          <div className="mt-6 space-y-2">
            {navigationItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 animate-slide-in-left ${
                  isActivePath(item.path)
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:shadow-md'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-lg hover:scale-110 transition-transform duration-200">
                  {item.icon}
                </span>
                <span className="font-medium flex-1">{item.label}</span>
                {item.path === '/marketplace' && marketplaceDomains.length > 0 && (
                  <Badge variant="secondary" className="text-xs animate-bounce-in">
                    {marketplaceDomains.length}
                  </Badge>
                )}
                {item.path === '/dashboard' && userDomains.length > 0 && (
                  <Badge variant="secondary" className="text-xs animate-bounce-in">
                    {userDomains.length}
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 space-y-3">
            <div className="text-sm font-medium text-muted-foreground px-4">Quick Actions</div>
            <div className="space-y-2">
              <Button
                variant="glass"
                size="sm"
                className="w-full justify-start gap-3"
                onClick={() => setIsOpen(false)}
              >
                <User className="h-4 w-4" />
                Profile Settings
              </Button>
              <Button
                variant="glass"
                size="sm"
                className="w-full justify-start gap-3"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Preferences
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavigation;
