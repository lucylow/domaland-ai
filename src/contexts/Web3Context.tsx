import { createContext, useContext, useEffect, useState, ReactNode, FC, useCallback } from 'react';
import { ethers, BrowserProvider, JsonRpcProvider, Network } from 'ethers';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
      isConnected?: () => boolean;
    };
    solana?: {
      isPhantom?: boolean;
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
    };
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
  provider: BrowserProvider | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
  network: Network | null;
  currentChain: SupportedChain;
  chainId: number | null;
  
  // Solana
  solanaAccount: string | null;
  solanaProvider: {
    isPhantom?: boolean;
    connect: () => Promise<{ publicKey: { toString: () => string } }>;
  } | null;
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
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<Network | null>(null);
  const [currentChain, setCurrentChain] = useState<SupportedChain>(SupportedChain.POLYGON);
  const [chainId, setChainId] = useState<number | null>(null);
  
  // Solana state
  const [solanaAccount, setSolanaAccount] = useState<string | null>(null);
  const [solanaProvider, setSolanaProvider] = useState<{
    isPhantom?: boolean;
    connect: () => Promise<{ publicKey: { toString: () => string } }>;
  } | null>(null);
  const [isSolanaConnected, setIsSolanaConnected] = useState(false);
  
  // General state
  const [isMockMode, setIsMockMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Event listener references for cleanup
  const [eventListeners, setEventListeners] = useState<{
    accountsChanged?: (accounts: string[]) => void;
    chainChanged?: () => void;
  }>({});

  const connectMockWallet = useCallback(() => {
    setError(null);
    // Mock wallet for development
    const mockAccount = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    setAccount(mockAccount);
    setProvider(null); // No real provider in mock mode
    setSigner(null); // No real signer in mock mode
    setNetwork(null); // No real network in mock mode
    setChainId(CHAIN_CONFIGS[SupportedChain.POLYGON].chainId);
    setIsConnected(true);
    setIsMockMode(true);
    
    console.log('Connected to mock wallet for development');
  }, []);

  const switchChain = useCallback(async (chain: SupportedChain): Promise<boolean> => {
    if (!window.ethereum) {
      setError('MetaMask not detected');
      return false;
    }
    
    try {
      const chainConfig = CHAIN_CONFIGS[chain];
      if (!chainConfig) {
        throw new Error(`Unsupported chain: ${chain}`);
      }
      
      // Check if already on the correct chain
      const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
      const targetChainId = `0x${chainConfig.chainId.toString(16)}`;
      
      if (currentChainId === targetChainId) {
        setCurrentChain(chain);
        setChainId(chainConfig.chainId);
        return true;
      }
      
      // Try to switch to the chain
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }],
        });
        setCurrentChain(chain);
        setChainId(chainConfig.chainId);
        return true;
      } catch (switchError: any) {
        // If the chain is not added to MetaMask, add it
        if (switchError.code === 4902) {
          try {
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
            setChainId(chainConfig.chainId);
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
    } catch (error) {
      console.error('Chain switch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch chain';
      setError(errorMessage);
      return false;
    }
  }, []);

  const connectWallet = useCallback(async (chain: SupportedChain = SupportedChain.POLYGON): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Check if MetaMask is installed
        if (!window.ethereum.isMetaMask) {
          setError('Please install MetaMask to continue');
          return false;
        }

        const web3Provider = new BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Switch to the requested chain if not already on it
        const chainSwitched = await switchChain(chain);
        if (!chainSwitched) {
          setError('Failed to switch to the requested network');
          return false;
        }
        
        const accounts = await web3Provider.listAccounts();
        const network = await web3Provider.getNetwork();
        const signer = await web3Provider.getSigner();
        
        if (accounts.length === 0) {
          throw new Error('No accounts found. Please unlock your wallet.');
        }
        
        setProvider(web3Provider);
        setSigner(signer);
        setAccount(accounts[0].address);
        setNetwork(network);
        setCurrentChain(chain);
        setIsConnected(true);
        setIsMockMode(false);
        
        // Set up event listeners with proper cleanup
        const accountsChangedHandler = (accounts: string[]) => {
          if (accounts.length === 0) {
            disconnectWallet();
          } else {
            setAccount(accounts[0]);
          }
        };

        const chainChangedHandler = () => {
          window.location.reload();
        };

        // Remove existing listeners first
        if (eventListeners.accountsChanged) {
          window.ethereum.removeListener('accountsChanged', eventListeners.accountsChanged);
        }
        if (eventListeners.chainChanged) {
          window.ethereum.removeListener('chainChanged', eventListeners.chainChanged);
        }

        // Add new listeners
        window.ethereum.on('accountsChanged', accountsChangedHandler);
        window.ethereum.on('chainChanged', chainChangedHandler);

        // Store references for cleanup
        setEventListeners({
          accountsChanged: accountsChangedHandler,
          chainChanged: chainChangedHandler
        });
        
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
    } catch (error: unknown) {
      console.error('Failed to connect wallet:', error);
      let errorMessage = 'Failed to connect wallet';
      
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code: number }).code;
        if (errorCode === 4001) {
          errorMessage = 'User rejected the connection request';
        } else if (errorCode === -32002) {
          errorMessage = 'Connection request already pending';
        } else if (errorCode === -32003) {
          errorMessage = 'Wallet is locked. Please unlock your wallet and try again';
        }
      }
      
      if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [switchChain]);

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
    } catch (error: unknown) {
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
    } catch (error: unknown) {
      console.error('Bridge operation failed:', error);
      setError('Bridge operation failed');
      return false;
    }
  };



  const clearError = () => {
    setError(null);
  };

  const disconnectWallet = useCallback(() => {
    // Clean up event listeners
    if (window.ethereum && eventListeners.accountsChanged) {
      window.ethereum.removeListener('accountsChanged', eventListeners.accountsChanged);
    }
    if (window.ethereum && eventListeners.chainChanged) {
      window.ethereum.removeListener('chainChanged', eventListeners.chainChanged);
    }
    
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    setNetwork(null);
    setCurrentChain(SupportedChain.POLYGON);
    setIsMockMode(false);
    setError(null);
    setEventListeners({});
  }, [eventListeners]);

  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
          if (accounts.length > 0 && !isConnected) {
            // Auto-reconnect if wallet was previously connected
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            const chainIdNumber = parseInt(chainId as string, 16);
            
            // Determine which chain we're on
            let detectedChain = SupportedChain.POLYGON;
            if (chainIdNumber === 1) detectedChain = SupportedChain.ETHEREUM;
            else if (chainIdNumber === 137) detectedChain = SupportedChain.POLYGON;
            else if (chainIdNumber === 56) detectedChain = SupportedChain.BSC;
            
            await connectWallet(detectedChain);
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Cleanup function
    return () => {
      if (window.ethereum && eventListeners.accountsChanged) {
        window.ethereum.removeListener('accountsChanged', eventListeners.accountsChanged);
      }
      if (window.ethereum && eventListeners.chainChanged) {
        window.ethereum.removeListener('chainChanged', eventListeners.chainChanged);
      }
    };
  }, [connectWallet, isConnected, eventListeners]);

  const value: Web3ContextType = {
    // EVM chains
    account,
    provider,
    signer,
    isConnected,
    network,
    currentChain,
    chainId,
    
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