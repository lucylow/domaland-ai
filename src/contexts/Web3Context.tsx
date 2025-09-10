import { createContext, useContext, useEffect, useState, ReactNode, FC, useCallback } from 'react';
import { ethers, BrowserProvider, JsonRpcProvider, Network } from 'ethers';

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
      isMetaMask?: boolean;
      isCoinbaseWallet?: boolean;
      isBraveWallet?: boolean;
      isRabby?: boolean;
      isTrust?: boolean;
      isFrame?: boolean;
      isOpera?: boolean;
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
  isManualConnection: boolean;
  
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
  const [isManualConnection, setIsManualConnection] = useState(false);

  // Event listener references for cleanup
  const [eventListeners, setEventListeners] = useState<{
    accountsChanged?: (accounts: string[]) => void;
    chainChanged?: () => void;
  }>({});

  const connectMockWallet = useCallback(() => {
    if (process.env.NODE_ENV !== 'development') {
      console.warn('Mock wallet only available in development mode');
      return;
    }

    console.log('🔧 Connecting mock wallet for development...');
    
    // Mock wallet data
    const mockAccount = '0x742d35Cc6634C0532925a3b844Bc454e4438f44e';
    setAccount(mockAccount);
    setProvider(null); // No real provider in mock mode
    setSigner(null); // No real signer in mock mode
    setNetwork(null); // No real network in mock mode
    setCurrentChain(SupportedChain.POLYGON);
    setChainId(CHAIN_CONFIGS[SupportedChain.POLYGON].chainId);
    setIsConnected(true);
    setIsMockMode(true);
    setError(null);
    
    console.log('✅ Mock wallet connected for development');
  }, []);

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
    setChainId(null);
    setIsMockMode(false);
    setError(null);
    setEventListeners({});
  }, [eventListeners]);

  const switchChain = useCallback(async (chain: SupportedChain): Promise<boolean> => {
    if (!window.ethereum) {
      setError('Wallet not detected');
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
        // If the chain is not added to the wallet, add it
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
          } catch (addError: any) {
            console.error('Failed to add chain:', addError);
            let errorMsg = `Failed to add ${chainConfig.name} to your wallet`;
            if (addError.code === 4001) {
              errorMsg = `User rejected adding ${chainConfig.name} to wallet`;
            } else if (addError.code === -32602) {
              errorMsg = `Invalid parameters for adding ${chainConfig.name}`;
            }
            setError(errorMsg);
            return false;
          }
        } else if (switchError.code === 4001) {
          setError(`User rejected switching to ${chainConfig.name}`);
          return false;
        } else if (switchError.code === -32002) {
          setError(`Request to switch to ${chainConfig.name} is already pending`);
          return false;
        }
        
        setError(`Failed to switch to ${chainConfig.name}. Please try again.`);
        return false;
      }
    } catch (error) {
      console.error('Chain switch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to switch chain';
      setError(errorMessage);
      return false;
    }
  }, []);

  const connectWallet = useCallback(async (chain?: SupportedChain): Promise<boolean> => {
    console.log('🔄 Starting wallet connection...');
    setIsConnecting(true);
    setIsManualConnection(true);
    setError(null);

    try {
      // Enhanced wallet detection with better error messages
      if (typeof window === 'undefined' || !window.ethereum) {
        const errorMsg = 'No Web3 wallet detected. Please install MetaMask, Coinbase Wallet, or another Web3 wallet.';
        setError(errorMsg);
        console.error('❌ Wallet detection failed:', errorMsg);
        return false;
      }

      // Check if any wallet is available (not just MetaMask)
      const isWalletAvailable = window.ethereum.isMetaMask || 
                               window.ethereum.isCoinbaseWallet || 
                               window.ethereum.isBraveWallet || 
                               window.ethereum.isRabby || 
                               window.ethereum.isTrust || 
                               window.ethereum.isFrame || 
                               window.ethereum.isOpera;

      if (!isWalletAvailable) {
        const errorMsg = 'No compatible wallet detected. Please install MetaMask, Coinbase Wallet, or another Web3 wallet.';
        setError(errorMsg);
        console.error('❌ No compatible wallet found');
        return false;
      }

      // Check if wallet is already connected
      const existingAccounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
      
      let accounts: string[];
      if (existingAccounts.length > 0) {
        // Wallet is already connected, just switch chain if needed
        accounts = existingAccounts;
        console.log('✅ Wallet already connected:', accounts[0]);
      } else {
        // Request wallet connection
        console.log('🔗 Requesting wallet connection...');
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[];
      }

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts returned from wallet');
      }

      // Create provider and signer
      const web3Provider = new BrowserProvider(window.ethereum);
      const network = await web3Provider.getNetwork();
      const signer = await web3Provider.getSigner();

      // Update state
      setProvider(web3Provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setNetwork(network);
      setCurrentChain(chain || SupportedChain.POLYGON);
      setChainId(Number(network.chainId));
      setIsConnected(true);

      // Switch to requested chain if specified
      if (chain) {
        const chainSwitched = await switchChain(chain);
        if (!chainSwitched) {
          console.warn('⚠️ Failed to switch to requested chain, but wallet is connected');
        }
      }

      console.log('✅ Wallet connected successfully:', {
        account: accounts[0],
        chainId: Number(network.chainId),
        network: network.name
      });

      return true;

    } catch (error: any) {
      console.error('❌ Wallet connection failed:', error);
      
      // Handle specific error codes
      let errorMessage = 'Failed to connect wallet. Please try again.';
      
      if (error.code === 4001) {
        errorMessage = 'Connection rejected. Please approve the connection request in your wallet.';
      } else if (error.code === -32002) {
        errorMessage = 'Connection request already pending. Please check your wallet.';
      } else if (error.code === -32003) {
        errorMessage = 'Wallet is locked. Please unlock your wallet and try again.';
      } else if (error.code === 4900) {
        errorMessage = 'Wallet not connected to any network. Please connect to a network.';
      } else if (error.code === 4901) {
        errorMessage = 'Request rejected by user. Please try again.';
      } else if (error.message?.includes('User rejected')) {
        errorMessage = 'Connection rejected by user. Please approve the connection request.';
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

  useEffect(() => {
    let mounted = true;

    const handleAccountsChanged = (accounts: string[]) => {
      if (!mounted) return;
      
      console.log('👤 Accounts changed:', accounts);
      if (accounts.length === 0) {
        // User disconnected wallet
        disconnectWallet();
      } else if (accounts[0] !== account) {
        // Account switched
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainId: string) => {
      if (!mounted) return;
      
      console.log('🔗 Chain changed:', chainId);
      const numericChainId = parseInt(chainId, 16);
      setChainId(numericChainId);
      
      // Update current chain based on chainId
      const chainConfig = Object.values(CHAIN_CONFIGS).find(
        config => config.chainId === numericChainId
      );
      if (chainConfig) {
        const chainKey = Object.keys(CHAIN_CONFIGS).find(
          key => CHAIN_CONFIGS[key as SupportedChain].chainId === numericChainId
        );
        if (chainKey) {
          setCurrentChain(chainKey as SupportedChain);
        }
      }
    };

    const handleConnect = (connectInfo: { chainId: string }) => {
      if (!mounted) return;
      console.log('🔗 Wallet connected:', connectInfo);
    };

    const handleDisconnect = (error: { code: number; message: string }) => {
      if (!mounted) return;
      console.log('🔌 Wallet disconnected:', error);
      disconnectWallet();
    };

    // Add event listeners
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('connect', handleConnect);
      window.ethereum.on('disconnect', handleDisconnect);
    }

    // Cleanup function
    return () => {
      mounted = false;
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
        window.ethereum.removeListener('connect', handleConnect);
        window.ethereum.removeListener('disconnect', handleDisconnect);
      }
    };
  }, [account, disconnectWallet]); // Add dependencies

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
    isManualConnection,
    
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