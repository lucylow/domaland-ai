import { FC, useState } from 'react';
import AIIntegrationPanel from '../AIIntegrationPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const AIAnalysisTab: FC = () => {
  const [domainName, setDomainName] = useState('');
  const [analyzeDomain, setAnalyzeDomain] = useState('');

  const handleAnalyze = () => {
    if (domainName.trim()) {
      setAnalyzeDomain(domainName.trim());
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">AI Domain Analysis</h2>
      
      {!analyzeDomain ? (
        <Card className="bg-background/10 border-border/20 text-white">
          <CardHeader>
            <CardTitle>Analyze a Domain</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter domain name (e.g., example.com)"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              className="bg-background/20 border-border/30 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button onClick={handleAnalyze} className="w-full">
              Analyze Domain
            </Button>
          </CardContent>
        </Card>
      ) : (
        <AIIntegrationPanel domainName={analyzeDomain} />
      )}
    </div>
  );
};
