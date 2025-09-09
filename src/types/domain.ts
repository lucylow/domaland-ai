// Domain Types
export interface Domain {
  id: number;
  name: string;
  sld: string;
  tld: string;
  owner_id: number;
  owner_address?: string;
  estimated_value: number;
  status: DomainStatus;
  token_id?: string;
  chain_id?: string;
  contract_address?: string;
  is_listed: boolean;
  listing_price?: number;
  is_fractionalized: boolean;
  fraction_contract_address?: string;
  total_shares?: number;
  share_price?: number;
  minimum_investment?: number;
  voucher_nonce?: string;
  proof_of_contacts_handle?: string;
  expiration_date?: string;
  created_at: string;
  updated_at: string;
}

export enum DomainStatus {
  REGISTERED = 'registered',
  TOKENIZED = 'tokenized',
  CLAIMED = 'claimed',
  LISTED = 'listed',
  SOLD = 'sold',
  FRACTIONALIZED = 'fractionalized'
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  wallet_address?: string;
  created_at: string;
  updated_at: string;
}

// Transaction Types
export interface DomainTransaction {
  id: number;
  domain_id: number;
  user_id: number;
  transaction_type: TransactionType;
  transaction_hash: string;
  status: TransactionStatus;
  gas_price?: string;
  gas_used?: number;
  block_number?: number;
  confirmed_at?: string;
  transaction_metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export enum TransactionType {
  REGISTER = 'register',
  TOKENIZE = 'tokenize',
  CLAIM = 'claim',
  BRIDGE = 'bridge',
  LIST = 'list',
  UNLIST = 'unlist',
  BUY = 'buy',
  SELL = 'sell',
  FRACTIONALIZE = 'fractionalize',
  SHARE_PURCHASE = 'share_purchase',
  CREATE_POOL = 'create_pool',
  ADD_LIQUIDITY = 'add_liquidity',
  REMOVE_LIQUIDITY = 'remove_liquidity',
  SWAP = 'swap',
  VOTE = 'vote',
  NFT_LOCK = 'nft_lock',
  TOKEN_MINT = 'token_mint'
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  CANCELLED = 'cancelled'
}

// AI Valuation Types
export interface AIValuation {
  domain_name: string;
  estimated_value: number;
  confidence_score: number;
  valuation_breakdown: {
    length_score: number;
    memorability_score: number;
    brandability_score: number;
    seo_potential: number;
    extension_value: number;
    market_trends: number;
    overall_score: number;
  };
  value_drivers: string[];
  comparable_sales: ComparableSale[];
  market_analysis: {
    analysis: string;
    market_segment: string;
    liquidity_score: number;
    risk_level: string;
  };
  investment_recommendation: {
    recommendation: string;
    reasoning: string;
    confidence: number;
    target_price_range: {
      low: number;
      high: number;
    };
  };
  valuation_date: string;
}

export interface ComparableSale {
  domain: string;
  sale_price: number;
  sale_date: string;
  pattern_match: string;
  relevance_score: number;
}

// Fractionalization Types
export interface FractionalizationProposal {
  domain_id: number;
  proposer_id: number;
  total_shares: number;
  share_price: number;
  minimum_investment: number;
  voting_threshold: number;
  proposal_expires: string;
  governance_model: string;
}

export interface FractionShare {
  domain_id: number;
  owner_id: number;
  share_percentage: number;
  share_tokens: number;
  purchase_price: number;
  purchase_date: string;
  voting_power: number;
}

export interface GovernanceProposal {
  proposal_id: string;
  domain_id: number;
  proposer_id: number;
  type: string;
  title: string;
  description: string;
  parameters: Record<string, any>;
  voting_starts: string;
  voting_ends: string;
  quorum_required: number;
  status: string;
  votes_for: number;
  votes_against: number;
  total_voting_power: number;
}

// AMM Types
export interface LiquidityPool {
  pool_id: string;
  domain_id: number;
  base_token: string;
  domain_token_reserve: number;
  base_token_reserve: number;
  total_liquidity_tokens: number;
  fee_rate: number;
  created_at: string;
  last_updated: string;
}

export interface LiquidityPosition {
  position_id: string;
  pool_id: string;
  user_id: number;
  liquidity_tokens: number;
  initial_domain_amount: number;
  initial_base_amount: number;
  created_at: string;
  rewards_earned: number;
}

export interface TradeQuote {
  input_token: string;
  output_token: string;
  input_amount: number;
  output_amount: number;
  price_impact: number;
  fee_amount: number;
  minimum_output: number;
  valid_until: string;
}

// Analytics Types
export interface DomainMetrics {
  domain_id: number;
  domain_name: string;
  current_value: number;
  value_change_24h: number;
  value_change_7d: number;
  value_change_30d: number;
  transaction_volume_24h: number;
  transaction_count_24h: number;
  liquidity_score: number;
  volatility_score: number;
  market_cap: number;
  holder_count: number;
  avg_holding_period: number;
}

export interface MarketTrend {
  trend_type: string;
  strength: number;
  duration_days: number;
  affected_domains: number[];
  trend_drivers: string[];
  confidence_score: number;
}

export interface BlockchainMetrics {
  chain_name: string;
  total_transactions: number;
  successful_transactions: number;
  failed_transactions: number;
  avg_gas_price: number;
  avg_confirmation_time: number;
  network_congestion: number;
  total_value_locked: number;
}

export interface DashboardData {
  timestamp: string;
  market_overview: {
    total_domains: number;
    tokenized_domains: number;
    total_market_cap: number;
    avg_domain_value: number;
    market_change_24h: number;
    active_traders: number;
    transaction_volume_24h: number;
    transaction_count_24h: number;
  };
  trending_domains: Array<{
    domain: Domain;
    trending_score: number;
    metrics: DomainMetrics;
  }>;
  blockchain_metrics: Record<string, BlockchainMetrics>;
  portfolio_metrics: any;
  market_trends: MarketTrend[];
  network_health: {
    overall_health: string;
    success_rate: number;
    avg_confirmation_time: number;
    network_congestion: number;
    total_transactions_24h: number;
  };
  alerts: Array<{
    type: string;
    severity: string;
    message: string;
    domain_id?: number;
    action_required: boolean;
  }>;
  recommendations: Array<{
    type: string;
    priority: string;
    title: string;
    description: string;
    action: string;
  }>;
}

// API Request/Response Types
export interface DomainRegistrationData {
  user_id: number;
  domain_name: string;
  owner_address?: string;
  estimated_value?: number;
  registrar_iana_id?: number;
}

export interface TokenizationData {
  chain_name: string;
  owner_address: string;
}

export interface ClaimData {
  token_id: number;
  registrant_handle: number;
}

export interface BridgeData {
  target_chain: string;
  target_address: string;
}

export interface ListingData {
  price: number;
}

export interface SharePurchaseData {
  share_amount: number;
  payment_details: {
    method: string;
    [key: string]: any;
  };
}

// Legacy Domain Interface (for backward compatibility)
export interface LegacyDomain {
  tokenId: string;
  name: string;
  owner: string;
  price?: string;
  isListed?: boolean;
  metadata?: any;
  category?: string;
  listedAt?: string;
}
