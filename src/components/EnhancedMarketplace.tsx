import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import MarketplaceFilters from './MarketplaceFilters';
import { useDoma } from '@/contexts/DomaContext';
import { ExternalLink, Eye, Heart, TrendingUp } from 'lucide-react';

interface FilterOptions {
  priceRange: { min: number; max: number };
  domainLength: { min: number; max: number };
  tld: string[];
}

const EnhancedMarketplace: React.FC = () => {
  const { marketplaceDomains, isLoading } = useDoma();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: { min: 0, max: 1000 },
    domainLength: { min: 1, max: 50 },
    tld: []
  });

  const filteredAndSortedDomains = useMemo(() => {
    let filtered = marketplaceDomains.filter(domain => {
      // Search filter
      if (searchQuery && !domain.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Price filter
      const price = parseFloat(domain.price || '0');
      if (price < filters.priceRange.min || price > filters.priceRange.max) {
        return false;
      }

      // Domain length filter
      const domainLength = domain.name.length;
      if (domainLength < filters.domainLength.min || domainLength > filters.domainLength.max) {
        return false;
      }

      // TLD filter
      if (filters.tld.length > 0) {
        const domainTld = '.' + domain.name.split('.').pop();
        if (!filters.tld.includes(domainTld)) {
          return false;
        }
      }

      return true;
    });

    // Sort domains
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = parseFloat(a.price || '0');
          bValue = parseFloat(b.price || '0');
          break;
        case 'length':
          aValue = a.name.length;
          bValue = b.name.length;
          break;
        case 'tld':
          aValue = a.name.split('.').pop()?.toLowerCase() || '';
          bValue = b.name.split('.').pop()?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [marketplaceDomains, searchQuery, sortBy, sortDirection, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSort = (newSortBy: string, direction: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(direction);
  };

  const handleFilter = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const getDomainValue = (domainName: string) => {
    // Simple domain value estimation based on length and TLD
    const length = domainName.length;
    const tld = domainName.split('.').pop()?.toLowerCase();
    
    let baseValue = 0;
    if (tld === 'com') baseValue = 100;
    else if (tld === 'org') baseValue = 50;
    else if (tld === 'net') baseValue = 30;
    else if (tld === 'io') baseValue = 80;
    else baseValue = 20;

    // Shorter domains are generally more valuable
    const lengthMultiplier = Math.max(0.1, 1 - (length - 3) * 0.1);
    
    return Math.round(baseValue * lengthMultiplier);
  };

  if (isLoading) {
    return (
      <Card className="bg-background/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Marketplace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between items-center p-2 bg-muted/50 rounded">
              <div className="space-y-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <MarketplaceFilters
        onSearch={handleSearch}
        onSort={handleSort}
        onFilter={handleFilter}
        searchQuery={searchQuery}
        sortBy={sortBy}
        sortDirection={sortDirection}
        filters={filters}
      />

      <Card className="bg-background/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🏪</span>
              Marketplace
              <Badge variant="secondary" className="ml-2">
                {filteredAndSortedDomains.length} domains
              </Badge>
            </CardTitle>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery('')}
                className="text-muted-foreground hover:text-foreground"
              >
                Clear search
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredAndSortedDomains.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">🔍</div>
              <p>No domains found matching your criteria</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedDomains.map((domain) => (
                <div
                  key={domain.tokenId}
                  className="group flex justify-between items-center p-4 bg-muted/30 rounded-lg border border-border/30 hover:border-primary/30 hover:bg-muted/50 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                        {domain.name}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {domain.name.length} chars
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Owner: {domain.owner?.slice(0, 6)}...{domain.owner?.slice(-4)}</span>
                      <span>•</span>
                      <span>Est. Value: ${getDomainValue(domain.name)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        {domain.price} ETH
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ≈ ${(parseFloat(domain.price || '0') * 2000).toFixed(0)}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Add to favorites"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View on blockchain"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium transition-all duration-200 hover:scale-105"
                    >
                      Buy Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedMarketplace;
