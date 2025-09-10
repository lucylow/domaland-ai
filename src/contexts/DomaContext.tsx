import { createContext, useContext, useState, useEffect, ReactNode, FC } from 'react';
import { useWeb3 } from './Web3Context';
import { ethers } from 'ethers';

interface Domain {
  tokenId: string;
  name: string;
  owner: string;
  price?: string;
  isListed?: boolean;
  metadata?: Record<string, unknown>;
  category?: string;
  listedAt?: string;
}

interface DomaContextType {
  userDomains: Domain[];
  marketplaceDomains: Domain[];
  isLoading: boolean;
  tokenizeDomain: (domainName: string) => Promise<{ success: boolean; tokenId?: string; error?: string }>;
  listDomain: (tokenId: string, price: string) => Promise<{ success: boolean; error?: string }>;
  buyDomain: (tokenId: string, price: string) => Promise<{ success: boolean; error?: string }>;
  refreshData: () => void;
}

const DomaContext = createContext<DomaContextType | undefined>(undefined);

export const useDoma = () => {
  const context = useContext(DomaContext);
  if (!context) {
    throw new Error('useDoma must be used within a DomaProvider');
  }
  return context;
};

interface DomaProviderProps {
  children: ReactNode;
}

// Mock Doma contract address and ABI for demo
const DOMA_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
const DOMA_ABI = [
  'function tokenizeDomain(string domainName) external returns (uint256)',
  'function balanceOf(address owner) external view returns (uint256)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'event DomainTokenized(address indexed owner, uint256 indexed tokenId, string domainName)'
];

export const DomaProvider: FC<DomaProviderProps> = ({ children }) => {
  const { signer, account, isMockMode } = useWeb3();
  const [userDomains, setUserDomains] = useState<Domain[]>([]);
  const [marketplaceDomains, setMarketplaceDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock tokenize domain function
  const tokenizeDomain = async (domainName: string) => {
    if (!account) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful tokenization
      const newDomain: Domain = {
        tokenId: Math.random().toString(36).substring(7),
        name: domainName,
        owner: account!,
        metadata: {
          description: `Tokenized domain: ${domainName}`,
          image: `https://api.doma.xyz/thumbnail/${domainName}`
        }
      };
      
      setUserDomains(prev => [...prev, newDomain]);
      
      return { 
        success: true,
        tokenId: '0x' + Math.random().toString(16).substring(2)
      };
    } catch (error) {
      console.error('Tokenization failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock list domain function
  const listDomain = async (tokenId: string, price: string) => {
    try {
      setIsLoading(true);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Move domain from user domains to marketplace
      const domain = userDomains.find(d => d.tokenId === tokenId);
      if (domain) {
        const listedDomain = { ...domain, price, isListed: true };
        setMarketplaceDomains(prev => [...prev, listedDomain]);
        setUserDomains(prev => prev.filter(d => d.tokenId !== tokenId));
      }
      
      return { 
        success: true
      };
    } catch (error) {
      console.error('Listing failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock buy domain function
  const buyDomain = async (tokenId: string, price: string) => {
    if (!account) throw new Error('Wallet not connected');
    
    try {
      setIsLoading(true);
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Move domain from marketplace to user domains
      const domain = marketplaceDomains.find(d => d.tokenId === tokenId);
      if (domain) {
        const purchasedDomain = { ...domain, owner: account!, isListed: false };
        setUserDomains(prev => [...prev, purchasedDomain]);
        setMarketplaceDomains(prev => prev.filter(d => d.tokenId !== tokenId));
      }
      
      return { 
        success: true
      };
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    // Mock data refresh
    console.log('Refreshing data...');
  };

  // Initialize with mock data
  useEffect(() => {
    if (account) {
      setMarketplaceDomains([
        {
          tokenId: '1',
          name: 'crypto.com',
          owner: '0x1234567890123456789012345678901234567890',
          price: '10.5',
          isListed: true,
          category: 'Premium',
          listedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          tokenId: '2',
          name: 'web3.org',
          owner: '0x0987654321098765432109876543210987654321',
          price: '5.2',
          isListed: true,
          category: 'Tech',
          listedAt: new Date(Date.now() - 172800000).toISOString()
        },
        {
          tokenId: '3',
          name: 'defi.io',
          owner: '0x4567890123456789012345678901234567890123',
          price: '8.7',
          isListed: true,
          category: 'DeFi',
          listedAt: new Date(Date.now() - 259200000).toISOString()
        },
        {
          tokenId: '4',
          name: 'nft.market',
          owner: '0x7890123456789012345678901234567890123456',
          price: '12.3',
          isListed: true,
          category: 'NFT',
          listedAt: new Date(Date.now() - 345600000).toISOString()
        },
        {
          tokenId: '5',
          name: 'blockchain.dev',
          owner: '0x2345678901234567890123456789012345678901',
          price: '6.8',
          isListed: true,
          category: 'Development',
          listedAt: new Date(Date.now() - 432000000).toISOString()
        }
      ]);
    }
  }, [account]);

  const value: DomaContextType = {
    userDomains,
    marketplaceDomains,
    isLoading,
    tokenizeDomain,
    listDomain,
    buyDomain,
    refreshData
  };

  return (
    <DomaContext.Provider value={value}>
      {children}
    </DomaContext.Provider>
  );
};