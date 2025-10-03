import { FC } from 'react';
import { useDoma } from '@/contexts/DomaContext';
import { useMetrics } from '@/contexts/MetricsContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MetricCard from '../MetricCard';

export const DashboardOverviewTab: FC = () => {
  const { userDomains, marketplaceDomains } = useDoma();
  const { metrics } = useMetrics();

  const stats = [
    {
      title: 'Total Domains',
      value: userDomains.length.toString(),
      icon: '🌐',
      change: '+12%',
      trend: 'up' as const
    },
    {
      title: 'Total Value',
      value: `$${(userDomains.reduce((acc, d) => acc + (parseFloat(d.price || '0')), 0)).toFixed(2)}`,
      icon: '💰',
      change: '+8%',
      trend: 'up' as const
    },
    {
      title: 'Active Listings',
      value: userDomains.filter(d => d.isListed).length.toString(),
      icon: '📈',
      change: '+5%',
      trend: 'up' as const
    },
    {
      title: 'Transactions',
      value: metrics?.totalTransactions?.toString() || '0',
      icon: '⚡',
      change: '+15%',
      trend: 'up' as const
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <MetricCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background/10 border-border/20 text-white">
          <CardHeader>
            <CardTitle>Your Domains</CardTitle>
          </CardHeader>
          <CardContent>
            {userDomains.length === 0 ? (
              <p className="text-white/70">No domains tokenized yet</p>
            ) : (
              <div className="space-y-2">
                {userDomains.slice(0, 5).map((domain, idx) => (
                  <div key={domain.tokenId || idx} className="flex justify-between items-center p-2 bg-background/5 rounded">
                    <span>{domain.name}</span>
                    <span className="text-sm text-white/70">{domain.price} ETH</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-background/10 border-border/20 text-white">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/70">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
