import { createContext, useContext, useEffect, useState, ReactNode, FC } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
    solana?: any;
  }
}

// Supported blockchain networks
export enum SupportedChain {
  ETHEREUM = 'ethereum',
  POLYGON = 'polygon',
  BSC = 'bsc',
  SOLANA = 'solana'
}

export interface ChainConfig {
  chainId: number;
  name: string;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  contracts: {
    domainTokenization?: string;
    fractionalOwnership?: string;
    royaltyDistribution?: string;
  };
}

export const CHAIN_CONFIGS: Record<SupportedChain, ChainConfig> = {
  [SupportedChain.ETHEREUM]: {
    chainId: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    blockExplorer: 'https://etherscan.io',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18
    },
    contracts: {
      domainTokenization: '0x...', // Deploy and update
      fractionalOwnership: '0x...',
      royaltyDistribution: '0x...'
    }
  },
  [SupportedChain.POLYGON]: {
    chainId: 137,
    name: 'Polygon',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18
    },
    contracts: {
      domainTokenization: '0x...',
      fractionalOwnership: '0x...',
      royaltyDistribution: '0x...'
    }
  },
  [SupportedChain.BSC]: {
    chainId: 56,
    name: 'Binance Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    contracts: {
      domainTokenization: '0x...',
      fractionalOwnership: '0x...',
      royaltyDistribution: '0x...'
    }
  },
  [SupportedChain.SOLANA]: {
    chainId: 0, // Solana doesn't use chainId
    name: 'Solana',
    rpcUrl: 'https://api.mainnet-beta.solana.com',
    blockExplorer: 'https://explorer.solana.com',
    nativeCurrency: {
      name: 'SOL',
      symbol: 'SOL',
      decimals: 9
    },
    contracts: {
      // Solana program addresses
      domainTokenization: '0x...',
      fractionalOwnership: '0x...',
      royaltyDistribution: '0x...'
    }
  }
};

interface Web3ContextType {
  // EVM chains
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
  network: ethers.providers.Network | null;
  currentChain: SupportedChain;
  
  // Solana
  solanaAccount: string | null;
  solanaProvider: any;
  isSolanaConnected: boolean;
  
  // General state
  isMockMode: boolean;
  isConnecting: boolean;
  error: string | null;
  
  // EVM methods
  connectWallet: (chain?: SupportedChain) => Promise<boolean>;
  switchChain: (chain: SupportedChain) => Promise<boolean>;
  disconnectWallet: () => void;
  connectMockWallet: () => void;
  clearError: () => void;
  
  // Solana methods
  connectSolanaWallet: () => Promise<boolean>;
  disconnectSolanaWallet: () => void;
  
  // Cross-chain methods
  bridgeAsset: (fromChain: SupportedChain, toChain: SupportedChain, amount: string) => Promise<boolean>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: FC<Web3ProviderProps> = ({ children }) => {
  // EVM chains state
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<ethers.providers.Network | null>(null);
  const [currentChain, setCurrentChain] = useState<SupportedChain>(SupportedChain.POLYGON);
  
  // Solana state
  const [solanaAccount, setSolanaAccount] = useState<string | null>(null);
  const [solanaProvider, setSolanaProvider] = useState<any>(null);
  const [isSolanaConnected, setIsSolanaConnected] = useState(false);
  
  // General state
  const [isMockMode, setIsMockMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async (chain: SupportedChain = SupportedChain.POLYGON): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Switch to the requested chain if not already on it
        await switchChain(chain);
        
        const accounts = await web3Provider.listAccounts();
        const network = await web3Provider.getNetwork();
        const signer = web3Provider.getSigner();
        
        if (accounts.length === 0) {
          throw new Error('No accounts found. Please unlock your wallet.');
        }
        
        setProvider(web3Provider);
        setSigner(signer);
        setAccount(accounts[0]);
        setNetwork(network);
        setCurrentChain(chain);
        setIsConnected(true);
        setIsMockMode(false);
        
        // Set up event listeners
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
        
        return true;
      } else {
        // Offer mock mode for development
        const useMock = confirm('MetaMask not detected. Would you like to use mock wallet mode for development?');
        if (useMock) {
          connectMockWallet();
          return true;
        } else {
          setError('MetaMask not installed. Please install MetaMask to continue.');
          return false;
        }
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      let errorMessage = 'Failed to connect wallet';
      
      if (error.code === 4001) {
        errorMessage = 'User rejected the connection request';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  const switchChain = async (chain: SupportedChain): Promise<boolean> => {
    if (!window.ethereum) return false;
    
    try {
      const chainConfig = CHAIN_CONFIGS[chain];
      if (!chainConfig) {
        throw new Error(`Unsupported chain: ${chain}`);
      }
      
      // Check if already on the correct chain
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (parseInt(currentChainId, 16) === chainConfig.chainId) {
        setCurrentChain(chain);
        return true;
      }
      
      // Switch to the requested chain
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainConfig.chainId.toString(16)}` }],
      });
      
      setCurrentChain(chain);
      return true;
    } catch (error: any) {
      console.error('Failed to switch chain:', error);
      
      // If the chain is not added to MetaMask, try to add it
      if (error.code === 4902) {
        try {
          const chainConfig = CHAIN_CONFIGS[chain];
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${chainConfig.chainId.toString(16)}`,
              chainName: chainConfig.name,
              rpcUrls: [chainConfig.rpcUrl],
              blockExplorerUrls: [chainConfig.blockExplorer],
              nativeCurrency: chainConfig.nativeCurrency,
            }],
          });
          setCurrentChain(chain);
          return true;
        } catch (addError) {
          console.error('Failed to add chain:', addError);
          setError(`Failed to add ${CHAIN_CONFIGS[chain].name} to MetaMask`);
          return false;
        }
      }
      
      setError(`Failed to switch to ${chain}`);
      return false;
    }
  };

  const connectSolanaWallet = async (): Promise<boolean> => {
    try {
      if (typeof window !== 'undefined' && window.solana && window.solana.isPhantom) {
        const response = await window.solana.connect();
        setSolanaAccount(response.publicKey.toString());
        setSolanaProvider(window.solana);
        setIsSolanaConnected(true);
        return true;
      } else {
        setError('Phantom wallet not detected. Please install Phantom wallet.');
        return false;
      }
    } catch (error: any) {
      console.error('Failed to connect Solana wallet:', error);
      setError('Failed to connect Solana wallet');
      return false;
    }
  };

  const disconnectSolanaWallet = () => {
    setSolanaAccount(null);
    setSolanaProvider(null);
    setIsSolanaConnected(false);
  };

  const bridgeAsset = async (fromChain: SupportedChain, toChain: SupportedChain, amount: string): Promise<boolean> => {
    try {
      // This is a placeholder for cross-chain bridging functionality
      // In a real implementation, this would interact with bridge contracts
      // like Chainlink CCIP, Axelar, or other cross-chain protocols
      
      console.log(`Bridging ${amount} from ${fromChain} to ${toChain}`);
      
      // For now, just simulate the bridge operation
      setError(null);
      return true;
    } catch (error: any) {
      console.error('Bridge operation failed:', error);
      setError('Bridge operation failed');
      return false;
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectMockWallet = () => {
    setError(null);
    // Mock wallet for development
    const mockAccount = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    const mockNetwork = {
      name: 'localhost',
      chainId: 1337,
      ensAddress: null
    };
    
    setAccount(mockAccount);
    setProvider(null); // No real provider in mock mode
    setSigner(null); // No real signer in mock mode
    setNetwork(mockNetwork as ethers.providers.Network);
    setIsConnected(true);
    setIsMockMode(true);
    
    console.log('Connected to mock wallet for development');
  };

  const clearError = () => {
    setError(null);
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setNetwork(null);
    setCurrentChain(SupportedChain.POLYGON);
    setIsMockMode(false);
    setError(null);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          connectWallet();
        }
      }
    };

    checkConnection();
  }, []);

  const value: Web3ContextType = {
    // EVM chains
    account,
    provider,
    signer,
    isConnected,
    network,
    currentChain,
    
    // Solana
    solanaAccount,
    solanaProvider,
    isSolanaConnected,
    
    // General state
    isMockMode,
    isConnecting,
    error,
    
    // EVM methods
    connectWallet,
    switchChain,
    disconnectWallet,
    connectMockWallet,
    clearError,
    
    // Solana methods
    connectSolanaWallet,
    disconnectSolanaWallet,
    
    // Cross-chain methods
    bridgeAsset
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};