import React, { useState } from 'react';
import { useWeb3, SupportedChain } from '@/contexts/Web3Context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const WalletConnectionHelper: React.FC = () => {
  const {
    isConnected,
    connectWallet,
    account,
    network,
    currentChain,
    isConnecting,
    error,
    clearError,
    isMockMode
  } = useWeb3();

  const [diagnostics, setDiagnostics] = useState<string[]>([]);

  const runDiagnostics = () => {
    const results: string[] = [];
    
    // Check if window.ethereum exists
    if (typeof window !== 'undefined' && window.ethereum) {
      results.push('✅ Web3 provider detected');
      
      // Check specific wallet types
      if (window.ethereum.isMetaMask) {
        results.push('✅ MetaMask detected');
      } else if (window.ethereum.isCoinbaseWallet) {
        results.push('✅ Coinbase Wallet detected');
      } else if (window.ethereum.isBraveWallet) {
        results.push('✅ Brave Wallet detected');
      } else {
        results.push('⚠️ Unknown wallet type detected');
      }
      
      // Check if wallet is locked
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: any) => {
          if (accounts.length > 0) {
            results.push('✅ Wallet is unlocked');
          } else {
            results.push('❌ Wallet is locked or no accounts');
          }
          setDiagnostics([...results]);
        })
        .catch(() => {
          results.push('❌ Unable to check wallet status');
          setDiagnostics([...results]);
        });
    } else {
      results.push('❌ No Web3 provider found');
      results.push('💡 Please install MetaMask, Coinbase Wallet, or another Web3 wallet');
    }
    
    setDiagnostics(results);
  };

  const clearDiagnostics = () => {
    setDiagnostics([]);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>🔧</span>
          Wallet Connection Helper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert className="border-red-200 bg-red-50 text-red-800">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="text-red-600 hover:text-red-800 hover:bg-red-100"
              >
                ✕
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={isConnected ? "default" : "secondary"}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </Badge>
            {isMockMode && (
              <Badge variant="outline" className="text-orange-600">
                Mock Mode
              </Badge>
            )}
          </div>
          
          {account && (
            <div className="text-sm">
              <span className="font-medium">Account:</span> {account}
            </div>
          )}
          
          {network && (
            <div className="text-sm">
              <span className="font-medium">Network:</span> {network.name}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={runDiagnostics}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Run Diagnostics
          </Button>
          
          <Button
            onClick={() => connectWallet(SupportedChain.POLYGON)}
            disabled={isConnecting}
            variant="outline"
          >
            {isConnecting ? 'Connecting...' : 'Connect Polygon'}
          </Button>
          
          <Button
            onClick={() => connectWallet(SupportedChain.ETHEREUM)}
            disabled={isConnecting}
            variant="outline"
          >
            {isConnecting ? 'Connecting...' : 'Connect Ethereum'}
          </Button>
          
          <Button
            onClick={clearDiagnostics}
            variant="ghost"
          >
            Clear Diagnostics
          </Button>
        </div>

        {diagnostics.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Diagnostics Results:</h4>
            <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto">
              {diagnostics.map((result, index) => (
                <div key={index} className="text-xs font-mono text-gray-700 mb-1">
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">💡 Troubleshooting Tips:</h4>
          <ul className="text-xs text-gray-700 space-y-1">
            <li>• Make sure your wallet extension is installed and enabled</li>
            <li>• Unlock your wallet and ensure you're on the correct network</li>
            <li>• Try refreshing the page if connection issues persist</li>
            <li>• Check that your wallet is not connected to another dApp</li>
            <li>• For development, you can use mock wallet mode</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnectionHelper;
