import { createContext, useContext, useEffect, useState, ReactNode, FC } from 'react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface Web3ContextType {
  account: string | null;
  provider: ethers.providers.Web3Provider | null;
  signer: ethers.Signer | null;
  isConnected: boolean;
  network: ethers.providers.Network | null;
  isMockMode: boolean;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => void;
  connectMockWallet: () => void;
  clearError: () => void;
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
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<ethers.providers.Network | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = async (): Promise<boolean> => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
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
    account,
    provider,
    signer,
    isConnected,
    network,
    isMockMode,
    isConnecting,
    error,
    connectWallet,
    disconnectWallet,
    connectMockWallet,
    clearError
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};