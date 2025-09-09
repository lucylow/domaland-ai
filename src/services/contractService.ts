import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';

// Contract ABIs (simplified versions - in production, use full ABIs)
const DOMA_LAND_OFFER_MANAGER_ABI = [
  "function createOffer(address nftContract, uint256 tokenId, address paymentToken, uint256 amount, uint256 duration) external payable",
  "function acceptOffer(uint256 offerId) external",
  "function cancelOffer(uint256 offerId) external",
  "function withdrawExpiredOffers(uint256[] calldata offerIds) external",
  "function getDomainOffers(address nftContract, uint256 tokenId) external view returns (tuple(address buyer, address paymentToken, uint256 amount, uint256 expirationTime, bool fulfilled, bool canceled, uint256 protocolFee, bytes32 domainId)[])",
  "function getActiveDomainOffers(address nftContract, uint256 tokenId) external view returns (tuple(address buyer, address paymentToken, uint256 amount, uint256 expirationTime, bool fulfilled, bool canceled, uint256 protocolFee, bytes32 domainId)[])",
  "function generateDomainId(address nftContract, uint256 tokenId) external pure returns (bytes32)",
  "function isDomainListed(address nftContract, uint256 tokenId) external view returns (bool)",
  "function getTotalOffers() external view returns (uint256)",
  "event OfferCreated(uint256 indexed offerId, bytes32 indexed domainId, address indexed buyer, address paymentToken, uint256 amount, uint256 expirationTime, uint256 protocolFee)",
  "event OfferAccepted(uint256 indexed offerId, bytes32 indexed domainId, address indexed seller, uint256 amount, uint256 protocolFee)",
  "event OfferCanceled(uint256 indexed offerId, bytes32 indexed domainId, address indexed buyer)"
];

const DOMA_LAND_PAGE_REGISTRY_ABI = [
  "function registerPage(bytes32 domainId, string memory pageUri) external",
  "function updatePageUri(bytes32 domainId, string memory newPageUri) external",
  "function deactivatePage(bytes32 domainId) external",
  "function reactivatePage(bytes32 domainId) external",
  "function transferPageOwnership(bytes32 domainId, address newOwner) external",
  "function getFullPageUri(bytes32 domainId) external view returns (string memory)",
  "function isPageActive(bytes32 domainId) external view returns (bool)",
  "function getPageInfo(bytes32 domainId) external view returns (tuple(string pageUri, address owner, uint256 createdAt, uint256 updatedAt, bool active))",
  "event PageRegistered(bytes32 indexed domainId, address indexed owner, string pageUri, uint256 createdAt)",
  "event PageUpdated(bytes32 indexed domainId, address indexed owner, string newPageUri, uint256 updatedAt)"
];

// Contract addresses (from deployment)
const CONTRACT_ADDRESSES = {
  DOMA_LAND_OFFER_MANAGER: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Replace with actual address
  DOMA_LAND_PAGE_REGISTRY: '0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c', // Replace with actual address
  USDC_TOKEN: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  DOMA_MARKETPLACE: '0x6fC21092DA55B392b745d0B6c49543c4e30fC2b3'
};

export interface Offer {
  buyer: string;
  paymentToken: string;
  amount: string;
  expirationTime: string;
  fulfilled: boolean;
  canceled: boolean;
  protocolFee: string;
  domainId: string;
}

export interface PageInfo {
  pageUri: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
}

export interface CreateOfferParams {
  nftContract: string;
  tokenId: string;
  paymentToken: string;
  amount: string;
  duration: number; // in seconds
}

export class ContractService {
  private offerManagerContract: ethers.Contract | null = null;
  private pageRegistryContract: ethers.Contract | null = null;
  private provider: ethers.providers.Provider | null = null;
  private signer: ethers.Signer | null = null;

  constructor(provider: ethers.providers.Provider, signer?: ethers.Signer) {
    this.provider = provider;
    this.signer = signer || null;
    
    if (this.signer) {
      this.offerManagerContract = new ethers.Contract(
        CONTRACT_ADDRESSES.DOMA_LAND_OFFER_MANAGER,
        DOMA_LAND_OFFER_MANAGER_ABI,
        this.signer
      );
      
      this.pageRegistryContract = new ethers.Contract(
        CONTRACT_ADDRESSES.DOMA_LAND_PAGE_REGISTRY,
        DOMA_LAND_PAGE_REGISTRY_ABI,
        this.signer
      );
    }
  }

  // Offer Management Functions
  async createOffer(params: CreateOfferParams): Promise<ethers.ContractTransaction> {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    const { nftContract, tokenId, paymentToken, amount, duration } = params;
    
    // Convert amount to wei if native token
    const value = paymentToken === ethers.constants.AddressZero 
      ? ethers.utils.parseEther(amount)
      : ethers.utils.parseUnits(amount, 6); // USDC has 6 decimals

    const tx = await this.offerManagerContract.createOffer(
      nftContract,
      tokenId,
      paymentToken,
      value,
      duration,
      paymentToken === ethers.constants.AddressZero ? { value } : {}
    );

    return tx;
  }

  async acceptOffer(offerId: string): Promise<ethers.ContractTransaction> {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    return await this.offerManagerContract.acceptOffer(offerId);
  }

  async cancelOffer(offerId: string): Promise<ethers.ContractTransaction> {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    return await this.offerManagerContract.cancelOffer(offerId);
  }

  async withdrawExpiredOffers(offerIds: string[]): Promise<ethers.ContractTransaction> {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    return await this.offerManagerContract.withdrawExpiredOffers(offerIds);
  }

  async getDomainOffers(nftContract: string, tokenId: string): Promise<Offer[]> {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    const offers = await this.offerManagerContract.getDomainOffers(nftContract, tokenId);
    return offers.map((offer: any) => ({
      buyer: offer.buyer,
      paymentToken: offer.paymentToken,
      amount: offer.amount.toString(),
      expirationTime: offer.expirationTime.toString(),
      fulfilled: offer.fulfilled,
      canceled: offer.canceled,
      protocolFee: offer.protocolFee.toString(),
      domainId: offer.domainId
    }));
  }

  async getActiveDomainOffers(nftContract: string, tokenId: string): Promise<Offer[]> {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    const offers = await this.offerManagerContract.getActiveDomainOffers(nftContract, tokenId);
    return offers.map((offer: any) => ({
      buyer: offer.buyer,
      paymentToken: offer.paymentToken,
      amount: offer.amount.toString(),
      expirationTime: offer.expirationTime.toString(),
      fulfilled: offer.fulfilled,
      canceled: offer.canceled,
      protocolFee: offer.protocolFee.toString(),
      domainId: offer.domainId
    }));
  }

  async generateDomainId(nftContract: string, tokenId: string): Promise<string> {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    return await this.offerManagerContract.generateDomainId(nftContract, tokenId);
  }

  async isDomainListed(nftContract: string, tokenId: string): Promise<boolean> {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    return await this.offerManagerContract.isDomainListed(nftContract, tokenId);
  }

  async getTotalOffers(): Promise<number> {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    const total = await this.offerManagerContract.getTotalOffers();
    return total.toNumber();
  }

  // Page Registry Functions
  async registerPage(domainId: string, pageUri: string): Promise<ethers.ContractTransaction> {
    if (!this.pageRegistryContract) {
      throw new Error('Contract not initialized');
    }

    return await this.pageRegistryContract.registerPage(domainId, pageUri);
  }

  async updatePageUri(domainId: string, newPageUri: string): Promise<ethers.ContractTransaction> {
    if (!this.pageRegistryContract) {
      throw new Error('Contract not initialized');
    }

    return await this.pageRegistryContract.updatePageUri(domainId, newPageUri);
  }

  async deactivatePage(domainId: string): Promise<ethers.ContractTransaction> {
    if (!this.pageRegistryContract) {
      throw new Error('Contract not initialized');
    }

    return await this.pageRegistryContract.deactivatePage(domainId);
  }

  async reactivatePage(domainId: string): Promise<ethers.ContractTransaction> {
    if (!this.pageRegistryContract) {
      throw new Error('Contract not initialized');
    }

    return await this.pageRegistryContract.reactivatePage(domainId);
  }

  async getFullPageUri(domainId: string): Promise<string> {
    if (!this.pageRegistryContract) {
      throw new Error('Contract not initialized');
    }

    return await this.pageRegistryContract.getFullPageUri(domainId);
  }

  async isPageActive(domainId: string): Promise<boolean> {
    if (!this.pageRegistryContract) {
      throw new Error('Contract not initialized');
    }

    return await this.pageRegistryContract.isPageActive(domainId);
  }

  async getPageInfo(domainId: string): Promise<PageInfo> {
    if (!this.pageRegistryContract) {
      throw new Error('Contract not initialized');
    }

    const pageInfo = await this.pageRegistryContract.getPageInfo(domainId);
    return {
      pageUri: pageInfo.pageUri,
      owner: pageInfo.owner,
      createdAt: pageInfo.createdAt.toString(),
      updatedAt: pageInfo.updatedAt.toString(),
      active: pageInfo.active
    };
  }

  // Event Listeners
  onOfferCreated(callback: (offerId: string, domainId: string, buyer: string, amount: string) => void) {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    this.offerManagerContract.on('OfferCreated', (offerId, domainId, buyer, paymentToken, amount) => {
      callback(offerId.toString(), domainId, buyer, amount.toString());
    });
  }

  onOfferAccepted(callback: (offerId: string, domainId: string, seller: string, amount: string) => void) {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    this.offerManagerContract.on('OfferAccepted', (offerId, domainId, seller, amount) => {
      callback(offerId.toString(), domainId, seller, amount.toString());
    });
  }

  onOfferCanceled(callback: (offerId: string, domainId: string, buyer: string) => void) {
    if (!this.offerManagerContract) {
      throw new Error('Contract not initialized');
    }

    this.offerManagerContract.on('OfferCanceled', (offerId, domainId, buyer) => {
      callback(offerId.toString(), domainId, buyer);
    });
  }

  onPageRegistered(callback: (domainId: string, owner: string, pageUri: string) => void) {
    if (!this.pageRegistryContract) {
      throw new Error('Contract not initialized');
    }

    this.pageRegistryContract.on('PageRegistered', (domainId, owner, pageUri) => {
      callback(domainId, owner, pageUri);
    });
  }

  // Utility Functions
  formatAmount(amount: string, token: string): string {
    if (token === ethers.constants.AddressZero) {
      return ethers.utils.formatEther(amount);
    } else {
      return ethers.utils.formatUnits(amount, 6); // USDC has 6 decimals
    }
  }

  parseAmount(amount: string, token: string): string {
    if (token === ethers.constants.AddressZero) {
      return ethers.utils.parseEther(amount).toString();
    } else {
      return ethers.utils.parseUnits(amount, 6).toString(); // USDC has 6 decimals
    }
  }

  getTokenSymbol(token: string): string {
    if (token === ethers.constants.AddressZero) {
      return 'ETH';
    } else if (token === CONTRACT_ADDRESSES.USDC_TOKEN) {
      return 'USDC';
    }
    return 'UNKNOWN';
  }

  // Cleanup
  removeAllListeners() {
    if (this.offerManagerContract) {
      this.offerManagerContract.removeAllListeners();
    }
    if (this.pageRegistryContract) {
      this.pageRegistryContract.removeAllListeners();
    }
  }
}

// Hook for using the contract service
export const useContractService = () => {
  const { provider, signer, isConnected } = useWeb3();
  
  if (!isConnected || !provider) {
    return null;
  }

  return new ContractService(provider, signer);
};
