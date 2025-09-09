import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useWeb3 } from './Web3Context';
import { useDoma } from './DomaContext';

interface Metrics {
  totalTransactions: number;
  dailyTransactions: number;
  weeklyTransactions: number;
  activeUsers: number;
  totalRevenue: number;
  projectedRevenue: number;
  domainStats: {
    totalTokenized: number;
    totalListed: number;
    totalFractionalized: number;
  };
}

interface MetricsContextType {
  metrics: Metrics;
  incrementTransaction: () => void;
  updateRevenue: (amount: number) => void;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics must be used within a MetricsProvider');
  }
  return context;
};

interface MetricsProviderProps {
  children: ReactNode;
}

export const MetricsProvider: React.FC<MetricsProviderProps> = ({ children }) => {
  const { account } = useWeb3();
  const { userDomains, marketplaceDomains } = useDoma();
  
  const [metrics, setMetrics] = useState<Metrics>({
    totalTransactions: 1247,
    dailyTransactions: 23,
    weeklyTransactions: 156,
    activeUsers: 892,
    totalRevenue: 45230,
    projectedRevenue: 67800,
    domainStats: {
      totalTokenized: 0,
      totalListed: 0,
      totalFractionalized: 0
    }
  });

  // Update domain statistics
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      domainStats: {
        totalTokenized: userDomains.length,
        totalListed: marketplaceDomains.length,
        totalFractionalized: userDomains.filter(d => d.metadata?.fractionalized).length
      }
    }));
  }, [userDomains, marketplaceDomains]);

  // Calculate revenue projections
  useEffect(() => {
    const calculateRevenue = () => {
      const listedDomains = marketplaceDomains.length;
      const avgPrice = marketplaceDomains.reduce((sum, domain) => 
        sum + parseFloat(domain.price || '0'), 0) / (listedDomains || 1);
      
      const estimatedRevenue = listedDomains * avgPrice * 0.03; // 3% platform fee
      const projectedMonthly = estimatedRevenue * 30;
      
      setMetrics(prev => ({
        ...prev,
        totalRevenue: prev.totalRevenue + estimatedRevenue,
        projectedRevenue: projectedMonthly
      }));
    };

    calculateRevenue();
  }, [marketplaceDomains]);

  // Simulate real-time growth
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
        dailyTransactions: prev.dailyTransactions + Math.floor(Math.random() * 3)
      }));
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const incrementTransaction = () => {
    setMetrics(prev => ({
      ...prev,
      totalTransactions: prev.totalTransactions + 1,
      dailyTransactions: prev.dailyTransactions + 1
    }));
  };

  const updateRevenue = (amount: number) => {
    setMetrics(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + amount,
      projectedRevenue: prev.projectedRevenue + (amount * 30)
    }));
  };

  const value: MetricsContextType = {
    metrics,
    incrementTransaction,
    updateRevenue
  };

  return (
    <MetricsContext.Provider value={value}>
      {children}
    </MetricsContext.Provider>
  );
};