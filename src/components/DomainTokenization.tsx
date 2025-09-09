import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useDoma } from '@/contexts/DomaContext';
import { useMetrics } from '@/contexts/MetricsContext';
import ErrorAlert from './ErrorAlert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

const DomainTokenization: React.FC = () => {
  const [domainName, setDomainName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { tokenizeDomain } = useDoma();
  const { incrementTransaction } = useMetrics();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate domain name format
      const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.([a-zA-Z]{2,}|[a-zA-Z]{2,}\.[a-zA-Z]{2,})$/;
      if (!domainRegex.test(domainName)) {
        throw new Error('Please enter a valid domain name (e.g., example.com)');
      }

      const receipt = await tokenizeDomain(domainName);
      
      setSuccess(`${domainName} has been successfully tokenized!`);
      toast({
        title: "Domain Tokenized Successfully!",
        description: `${domainName} has been tokenized on the blockchain.`,
      });
      
      incrementTransaction();
      setDomainName('');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setError(errorMessage);
      toast({
        title: "Tokenization Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <Card className="group relative overflow-hidden bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
      
      <CardHeader className="relative z-10">
        <CardTitle className="flex items-center gap-2 text-lg">
          <span className="text-2xl animate-float">🌐</span>
          <span className="text-foreground">
            Tokenize Domain
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-4">
        {error && (
          <ErrorAlert
            title="Tokenization Failed"
            message={error}
            onRetry={handleRetry}
            onDismiss={() => setError(null)}
          />
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="domainName" className="text-sm font-medium text-foreground/80">
              Domain Name
            </Label>
            <div className="relative">
              <Input
                id="domainName"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                placeholder="example.com"
                required
                disabled={isLoading}
                className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50"
              />
              <div className="absolute inset-0 bg-background/5 rounded-md opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isLoading || !domainName.trim()}
            className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium py-2.5 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Tokenizing...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>🚀</span>
                Tokenize Domain
              </div>
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
          <p className="font-semibold mb-3 text-foreground flex items-center gap-2">
            <span className="text-lg">💡</span>
            Benefits:
          </p>
          <ul className="text-sm space-y-2 text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
              Prove ownership on blockchain
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full"></div>
              Enable domain trading
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
              Unlock DeFi opportunities
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainTokenization;