import { FC } from 'react';
import { useDoma } from '@/contexts/DomaContext';
import VisualDashboard from '../Analytics/VisualDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const AnalyticsTab: FC = () => {
  const { userDomains } = useDoma();

  const mappedDomains = userDomains.map(domain => ({
    ...domain,
    currentPrice: parseFloat(domain.price || '0'),
    isTokenized: !!domain.tokenizedAt
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Analytics & Insights</h2>
      
      {userDomains.length > 0 ? (
        <VisualDashboard domains={mappedDomains} transactions={[]} />
      ) : (
        <Card className="bg-background/10 border-border/20 text-white">
          <CardHeader>
            <CardTitle>No Analytics Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/70">Tokenize some domains to view analytics and insights.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
