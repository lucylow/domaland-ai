import { FC } from 'react';
import { useDoma } from '@/contexts/DomaContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DomainTokenization from '../DomainTokenization';

export const PortfolioTab: FC = () => {
  const { userDomains } = useDoma();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Your Portfolio</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {userDomains.map((domain, idx) => (
          <Card key={domain.tokenId || idx} className="bg-background/10 border-border/20 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{domain.name}</CardTitle>
                {domain.isListed && (
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    Listed
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/70">Price:</span>
                  <span className="font-medium">{domain.price} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Status:</span>
                  <span className="font-medium">{domain.tokenizedAt ? 'Tokenized' : 'Not Tokenized'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-background/10 border-border/20 text-white">
        <CardHeader>
          <CardTitle>Tokenize New Domain</CardTitle>
        </CardHeader>
        <CardContent>
          <DomainTokenization />
        </CardContent>
      </Card>
    </div>
  );
};
