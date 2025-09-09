/**
 * Cross-Chain Bridge Service for DomaLand.AI
 * Implements cross-chain asset movement using Chainlink CCIP, Axelar, and other protocols
 */

import { ethers } from 'ethers';
import { SupportedChain, CHAIN_CONFIGS } from '../contexts/Web3Context';

export interface BridgeConfig {
  sourceChain: SupportedChain;
  targetChain: SupportedChain;
  assetType: 'domain' | 'token' | 'nft';
  assetId: string;
  amount?: string;
  recipientAddress: string;
  gasLimit?: string;
  maxFee?: string;
}

export interface BridgeQuote {
  sourceChain: SupportedChain;
  targetChain: SupportedChain;
  estimatedTime: number; // in minutes
  estimatedFee: string;
  feeToken: string;
  slippage: number;
  minimumReceived: string;
  route: {
    protocol: 'chainlink' | 'axelar' | 'wormhole' | 'layerzero';
    steps: Array<{
      chain: SupportedChain;
      action: string;
      estimatedTime: number;
    }>;
  };
}

export interface BridgeTransaction {
  id: string;
  sourceChain: SupportedChain;
  targetChain: SupportedChain;
  assetType: string;
  assetId: string;
  amount: string;
  recipientAddress: string;
  status: 'pending' | 'confirmed' | 'bridging' | 'completed' | 'failed';
  sourceTxHash?: string;
  targetTxHash?: string;
  estimatedCompletion?: string;
  actualCompletion?: string;
  fees: {
    source: string;
    target: string;
    bridge: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BridgeStatus {
  isActive: boolean;
  supportedChains: SupportedChain[];
  supportedAssets: Array<{
    type: 'domain' | 'token' | 'nft';
    chains: SupportedChain[];
    contractAddresses: Record<SupportedChain, string>;
  }>;
  fees: Record<SupportedChain, {
    native: string;
    usdc: string;
    usdt: string;
  }>;
  limits: {
    minAmount: string;
    maxAmount: string;
    dailyLimit: string;
  };
}

class CrossChainBridgeService {
  private apiEndpoint: string;
  private apiKey: string;
  private bridgeContracts: Record<string, string> = {
    // Chainlink CCIP contracts
    'chainlink-ethereum': '0x...',
    'chainlink-polygon': '0x...',
    'chainlink-bsc': '0x...',
    
    // Axelar contracts
    'axelar-ethereum': '0x...',
    'axelar-polygon': '0x...',
    'axelar-bsc': '0x...',
    
    // Wormhole contracts
    'wormhole-ethereum': '0x...',
    'wormhole-polygon': '0x...',
    'wormhole-bsc': '0x...',
    'wormhole-solana': '0x...',
    
    // LayerZero contracts
    'layerzero-ethereum': '0x...',
    'layerzero-polygon': '0x...',
    'layerzero-bsc': '0x...'
  };

  constructor() {
    this.apiEndpoint = process.env.REACT_APP_BRIDGE_API || 'https://api.domaland.ai/bridge';
    this.apiKey = process.env.REACT_APP_BRIDGE_API_KEY || '';
  }

  /**
   * Get bridge status and supported configurations
   */
  async getBridgeStatus(): Promise<BridgeStatus> {
    try {
      const response = await fetch(`${this.apiEndpoint}/status`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Bridge status API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting bridge status:', error);
      return this.getFallbackBridgeStatus();
    }
  }

  /**
   * Get quote for cross-chain bridge operation
   */
  async getBridgeQuote(config: BridgeConfig): Promise<BridgeQuote> {
    try {
      const payload = {
        source_chain: config.sourceChain,
        target_chain: config.targetChain,
        asset_type: config.assetType,
        asset_id: config.assetId,
        amount: config.amount,
        recipient_address: config.recipientAddress
      };

      const response = await fetch(`${this.apiEndpoint}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Bridge quote API error: ${response.statusText}`);
      }

      const result = await response.json();
      return this.formatBridgeQuote(result);
    } catch (error) {
      console.error('Error getting bridge quote:', error);
      return this.getFallbackQuote(config);
    }
  }

  /**
   * Initiate cross-chain bridge transaction
   */
  async initiateBridge(
    config: BridgeConfig,
    signer: ethers.Signer
  ): Promise<BridgeTransaction> {
    try {
      // Get quote first
      const quote = await this.getBridgeQuote(config);
      
      // Prepare transaction data
      const bridgeContract = this.getBridgeContract(config.sourceChain, quote.route.protocol);
      const contract = new ethers.Contract(bridgeContract, this.getBridgeABI(), signer);

      // Build transaction parameters
      const txParams = await this.buildBridgeTransaction(config, quote, contract);

      // Execute transaction
      const tx = await contract.bridgeAsset(...txParams);
      const receipt = await tx.wait();

      // Create bridge transaction record
      const bridgeTx: BridgeTransaction = {
        id: this.generateTransactionId(),
        sourceChain: config.sourceChain,
        targetChain: config.targetChain,
        assetType: config.assetType,
        assetId: config.assetId,
        amount: config.amount || '1',
        recipientAddress: config.recipientAddress,
        status: 'confirmed',
        sourceTxHash: receipt.transactionHash,
        estimatedCompletion: new Date(Date.now() + quote.estimatedTime * 60000).toISOString(),
        fees: {
          source: quote.estimatedFee,
          target: '0',
          bridge: quote.estimatedFee
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Store transaction record
      await this.storeBridgeTransaction(bridgeTx);

      return bridgeTx;
    } catch (error) {
      console.error('Error initiating bridge transaction:', error);
      throw error;
    }
  }

  /**
   * Get bridge transaction status
   */
  async getBridgeTransactionStatus(transactionId: string): Promise<BridgeTransaction> {
    try {
      const response = await fetch(`${this.apiEndpoint}/transaction/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Bridge transaction API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting bridge transaction status:', error);
      throw error;
    }
  }

  /**
   * Get user's bridge transaction history
   */
  async getBridgeHistory(
    userAddress: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<BridgeTransaction[]> {
    try {
      const response = await fetch(
        `${this.apiEndpoint}/history/${userAddress}?limit=${limit}&offset=${offset}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Bridge history API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.transactions;
    } catch (error) {
      console.error('Error getting bridge history:', error);
      return [];
    }
  }

  /**
   * Cancel pending bridge transaction
   */
  async cancelBridgeTransaction(
    transactionId: string,
    signer: ethers.Signer
  ): Promise<boolean> {
    try {
      const transaction = await this.getBridgeTransactionStatus(transactionId);
      
      if (transaction.status !== 'pending' && transaction.status !== 'confirmed') {
        throw new Error('Transaction cannot be cancelled');
      }

      const bridgeContract = this.getBridgeContract(transaction.sourceChain, 'chainlink');
      const contract = new ethers.Contract(bridgeContract, this.getBridgeABI(), signer);

      const tx = await contract.cancelBridge(transactionId);
      await tx.wait();

      // Update transaction status
      await this.updateBridgeTransactionStatus(transactionId, 'cancelled');

      return true;
    } catch (error) {
      console.error('Error cancelling bridge transaction:', error);
      return false;
    }
  }

  /**
   * Get optimal bridge route for given parameters
   */
  async getOptimalRoute(
    sourceChain: SupportedChain,
    targetChain: SupportedChain,
    assetType: string,
    amount: string
  ): Promise<{
    protocol: string;
    estimatedTime: number;
    estimatedFee: string;
    steps: Array<{
      chain: SupportedChain;
      action: string;
      estimatedTime: number;
    }>;
  }> {
    try {
      const payload = {
        source_chain: sourceChain,
        target_chain: targetChain,
        asset_type: assetType,
        amount: amount
      };

      const response = await fetch(`${this.apiEndpoint}/route`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Route optimization API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting optimal route:', error);
      return this.getFallbackRoute(sourceChain, targetChain);
    }
  }

  /**
   * Monitor bridge transaction progress
   */
  async monitorBridgeTransaction(
    transactionId: string,
    onUpdate: (transaction: BridgeTransaction) => void,
    interval: number = 30000
  ): Promise<void> {
    const monitor = async () => {
      try {
        const transaction = await this.getBridgeTransactionStatus(transactionId);
        onUpdate(transaction);

        if (transaction.status === 'completed' || transaction.status === 'failed') {
          return;
        }

        setTimeout(monitor, interval);
      } catch (error) {
        console.error('Error monitoring bridge transaction:', error);
        setTimeout(monitor, interval);
      }
    };

    monitor();
  }

  /**
   * Get bridge contract address for given chain and protocol
   */
  private getBridgeContract(chain: SupportedChain, protocol: string): string {
    const key = `${protocol}-${chain}`;
    return this.bridgeContracts[key] || '';
  }

  /**
   * Get bridge contract ABI
   */
  private getBridgeABI(): any[] {
    return [
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "asset",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amount",
            "type": "uint256"
          },
          {
            "internalType": "uint16",
            "name": "destinationChain",
            "type": "uint16"
          },
          {
            "internalType": "bytes",
            "name": "recipient",
            "type": "bytes"
          }
        ],
        "name": "bridgeAsset",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "string",
            "name": "transactionId",
            "type": "string"
          }
        ],
        "name": "cancelBridge",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      }
    ];
  }

  /**
   * Build bridge transaction parameters
   */
  private async buildBridgeTransaction(
    config: BridgeConfig,
    quote: BridgeQuote,
    contract: ethers.Contract
  ): Promise<any[]> {
    const targetChainId = CHAIN_CONFIGS[config.targetChain].chainId;
    const recipientBytes = ethers.utils.defaultAbiCoder.encode(
      ['address'],
      [config.recipientAddress]
    );

    return [
      config.assetId, // asset address
      config.amount || '1', // amount
      targetChainId, // destination chain
      recipientBytes // recipient
    ];
  }

  /**
   * Store bridge transaction record
   */
  private async storeBridgeTransaction(transaction: BridgeTransaction): Promise<void> {
    try {
      await fetch(`${this.apiEndpoint}/transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(transaction)
      });
    } catch (error) {
      console.error('Error storing bridge transaction:', error);
    }
  }

  /**
   * Update bridge transaction status
   */
  private async updateBridgeTransactionStatus(
    transactionId: string,
    status: string
  ): Promise<void> {
    try {
      await fetch(`${this.apiEndpoint}/transaction/${transactionId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error('Error updating bridge transaction status:', error);
    }
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    return `bridge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Format bridge quote from API response
   */
  private formatBridgeQuote(apiResponse: any): BridgeQuote {
    return {
      sourceChain: apiResponse.source_chain,
      targetChain: apiResponse.target_chain,
      estimatedTime: apiResponse.estimated_time,
      estimatedFee: apiResponse.estimated_fee,
      feeToken: apiResponse.fee_token,
      slippage: apiResponse.slippage,
      minimumReceived: apiResponse.minimum_received,
      route: {
        protocol: apiResponse.route.protocol,
        steps: apiResponse.route.steps
      }
    };
  }

  /**
   * Get fallback bridge status
   */
  private getFallbackBridgeStatus(): BridgeStatus {
    return {
      isActive: true,
      supportedChains: [SupportedChain.ETHEREUM, SupportedChain.POLYGON, SupportedChain.BSC],
      supportedAssets: [
        {
          type: 'domain',
          chains: [SupportedChain.ETHEREUM, SupportedChain.POLYGON, SupportedChain.BSC],
          contractAddresses: {
            [SupportedChain.ETHEREUM]: '0x...',
            [SupportedChain.POLYGON]: '0x...',
            [SupportedChain.BSC]: '0x...',
            [SupportedChain.SOLANA]: '0x...'
          }
        }
      ],
      fees: {
        [SupportedChain.ETHEREUM]: { native: '0.01', usdc: '5', usdt: '5' },
        [SupportedChain.POLYGON]: { native: '0.1', usdc: '1', usdt: '1' },
        [SupportedChain.BSC]: { native: '0.01', usdc: '2', usdt: '2' },
        [SupportedChain.SOLANA]: { native: '0.01', usdc: '1', usdt: '1' }
      },
      limits: {
        minAmount: '1',
        maxAmount: '1000000',
        dailyLimit: '10000000'
      }
    };
  }

  /**
   * Get fallback quote
   */
  private getFallbackQuote(config: BridgeConfig): BridgeQuote {
    return {
      sourceChain: config.sourceChain,
      targetChain: config.targetChain,
      estimatedTime: 15, // 15 minutes
      estimatedFee: '0.01',
      feeToken: 'ETH',
      slippage: 0.5,
      minimumReceived: config.amount || '1',
      route: {
        protocol: 'chainlink',
        steps: [
          {
            chain: config.sourceChain,
            action: 'Lock assets',
            estimatedTime: 2
          },
          {
            chain: config.targetChain,
            action: 'Mint assets',
            estimatedTime: 13
          }
        ]
      }
    };
  }

  /**
   * Get fallback route
   */
  private getFallbackRoute(
    sourceChain: SupportedChain,
    targetChain: SupportedChain
  ): any {
    return {
      protocol: 'chainlink',
      estimatedTime: 15,
      estimatedFee: '0.01',
      steps: [
        {
          chain: sourceChain,
          action: 'Lock assets',
          estimatedTime: 2
        },
        {
          chain: targetChain,
          action: 'Mint assets',
          estimatedTime: 13
        }
      ]
    };
  }
}

// Export singleton instance
export const crossChainBridgeService = new CrossChainBridgeService();
export default CrossChainBridgeService;
