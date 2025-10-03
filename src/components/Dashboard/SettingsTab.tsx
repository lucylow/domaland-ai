import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWeb3 } from '@/contexts/Web3Context';

export const SettingsTab: FC = () => {
  const { account, network, disconnectWallet } = useWeb3();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Settings</h2>
      
      <Card className="bg-background/10 border-border/20 text-white">
        <CardHeader>
          <CardTitle>Wallet Connection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-white/70 mb-1">Connected Address</p>
            <p className="font-mono text-sm">{account}</p>
          </div>
          <div>
            <p className="text-sm text-white/70 mb-1">Network</p>
            <p className="font-medium">{typeof network === 'string' ? network : network?.name || 'Unknown'}</p>
          </div>
          {disconnectWallet && (
            <Button onClick={disconnectWallet} variant="destructive" className="w-full">
              Disconnect Wallet
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="bg-background/10 border-border/20 text-white">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/70">Settings preferences coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
