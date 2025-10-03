import { FC } from 'react';
import { DemoDomainsGrid } from '../DemoDomainsGrid';

export const MarketplaceTab: FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Domain Marketplace</h2>
      <DemoDomainsGrid />
    </div>
  );
};
