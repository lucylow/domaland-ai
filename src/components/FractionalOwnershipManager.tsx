import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  PieChart, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign,
  Clock,
  Shield,
  Zap,
  BarChart3,
  Activity
} from 'lucide-react';
import { useWeb3 } from '../contexts/Web3Context';
import { Domain } from '../types/domain';

interface FractionalOwnershipData {
  domainTokenId: number;
  totalShares: number;
  sharePrice: number;
  minimumInvestment: number;
  buyoutPrice: number;
  buyoutDeadline: string;
  isBuyoutTriggered: boolean;
  isBuyoutCompleted: boolean;
  buyoutInitiator?: string;
  buyoutAmount?: number;
  currentPrice: number;
  domainTokenReserve: number;
  baseTokenReserve: number;
  totalLiquidity: number;
  userShares: number;
  userLiquidity: number;
  claimableRevenue: number;
  totalRevenue: number;
}

interface GovernanceProposal {
  id: string;
  title: string;
  description: string;
  type: 'buyout' | 'revenue_distribution' | 'domain_management' | 'other';
  proposer: string;
  votesFor: number;
  votesAgainst: number;
  totalVotingPower: number;
  status: 'active' | 'passed' | 'failed' | 'executed';
  deadline: string;
  userVote?: 'for' | 'against' | null;
}

interface TradeQuote {
  inputToken: string;
  outputToken: string;
  inputAmount: number;
  outputAmount: number;
  priceImpact: number;
  feeAmount: number;
  minimumOutput: number;
  validUntil: string;
}

const FractionalOwnershipManager: React.FC<{ domain: Domain }> = ({ domain }) => {
  const { account, signer, isConnected } = useWeb3();
  const [fractionalData, setFractionalData] = useState<FractionalOwnershipData | null>(null);
  const [governanceProposals, setGovernanceProposals] = useState<GovernanceProposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Trade state
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState('');
  const [tradeQuote, setTradeQuote] = useState<TradeQuote | null>(null);
  const [isTrading, setIsTrading] = useState(false);
  
  // Liquidity state
  const [liquidityAmount, setLiquidityAmount] = useState('');
  const [isAddingLiquidity, setIsAddingLiquidity] = useState(false);
  
  // Buyout state
  const [buyoutAmount, setBuyoutAmount] = useState('');
  const [isInitiatingBuyout, setIsInitiatingBuyout] = useState(false);

  useEffect(() => {
    if (domain.is_fractionalized && domain.fraction_contract_address) {
      fetchFractionalData();
      fetchGovernanceProposals();
    }
  }, [domain]);

  const fetchFractionalData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/fractional/${domain.fraction_contract_address}`);
      const data = await response.json();
      setFractionalData(data);
    } catch (error) {
      console.error('Error fetching fractional data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGovernanceProposals = async () => {
    try {
      const response = await fetch(`/api/governance/${domain.fraction_contract_address}/proposals`);
      const data = await response.json();
      setGovernanceProposals(data.proposals);
    } catch (error) {
      console.error('Error fetching governance proposals:', error);
    }
  };

  const getTradeQuote = async (amount: string, type: 'buy' | 'sell') => {
    if (!amount || !fractionalData) return;

    try {
      const response = await fetch('/api/fractional/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractAddress: domain.fraction_contract_address,
          amount: amount,
          type: type
        })
      });

      const quote = await response.json();
      setTradeQuote(quote);
    } catch (error) {
      console.error('Error getting trade quote:', error);
    }
  };

  const executeTrade = async () => {
    if (!tradeQuote || !signer || !fractionalData) return;

    try {
      setIsTrading(true);
      
      // This would interact with the actual smart contract
      const contract = new ethers.Contract(
        domain.fraction_contract_address!,
        fractionalOwnershipABI,
        signer
      );

      let tx;
      if (tradeType === 'buy') {
        tx = await contract.purchaseShares(
          tradeQuote.inputAmount,
          tradeQuote.minimumOutput,
          { value: tradeQuote.inputAmount }
        );
      } else {
        tx = await contract.sellShares(
          tradeQuote.inputAmount,
          tradeQuote.minimumOutput
        );
      }

      await tx.wait();
      
      // Refresh data
      await fetchFractionalData();
      setTradeAmount('');
      setTradeQuote(null);
    } catch (error) {
      console.error('Error executing trade:', error);
    } finally {
      setIsTrading(false);
    }
  };

  const addLiquidity = async () => {
    if (!liquidityAmount || !signer || !fractionalData) return;

    try {
      setIsAddingLiquidity(true);
      
      const contract = new ethers.Contract(
        domain.fraction_contract_address!,
        fractionalOwnershipABI,
        signer
      );

      const tx = await contract.addLiquidity(
        liquidityAmount,
        liquidityAmount * fractionalData.currentPrice,
        { value: liquidityAmount }
      );

      await tx.wait();
      
      // Refresh data
      await fetchFractionalData();
      setLiquidityAmount('');
    } catch (error) {
      console.error('Error adding liquidity:', error);
    } finally {
      setIsAddingLiquidity(false);
    }
  };

  const initiateBuyout = async () => {
    if (!buyoutAmount || !signer || !fractionalData) return;

    try {
      setIsInitiatingBuyout(true);
      
      const contract = new ethers.Contract(
        domain.fraction_contract_address!,
        fractionalOwnershipABI,
        signer
      );

      const tx = await contract.initiateBuyout(
        buyoutAmount,
        { value: buyoutAmount }
      );

      await tx.wait();
      
      // Refresh data
      await fetchFractionalData();
      setBuyoutAmount('');
    } catch (error) {
      console.error('Error initiating buyout:', error);
    } finally {
      setIsInitiatingBuyout(false);
    }
  };

  const voteOnProposal = async (proposalId: string, vote: 'for' | 'against') => {
    if (!signer) return;

    try {
      const contract = new ethers.Contract(
        domain.fraction_contract_address!,
        fractionalOwnershipABI,
        signer
      );

      const tx = await contract.vote(proposalId, vote === 'for');
      await tx.wait();
      
      // Refresh proposals
      await fetchGovernanceProposals();
    } catch (error) {
      console.error('Error voting on proposal:', error);
    }
  };

  const claimRevenue = async () => {
    if (!signer || !fractionalData) return;

    try {
      const contract = new ethers.Contract(
        domain.fraction_contract_address!,
        fractionalOwnershipABI,
        signer
      );

      const tx = await contract.claimRevenue();
      await tx.wait();
      
      // Refresh data
      await fetchFractionalData();
    } catch (error) {
      console.error('Error claiming revenue:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!fractionalData) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-600">This domain is not fractionalized yet.</p>
          <Button className="mt-4" onClick={() => setActiveTab('fractionalize')}>
            Fractionalize Domain
          </Button>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getVotingPower = () => {
    if (!fractionalData) return 0;
    return (fractionalData.userShares / fractionalData.totalShares) * 100;
  };

  const getBuyoutProgress = () => {
    if (!fractionalData || !fractionalData.isBuyoutTriggered) return 0;
    const timeRemaining = new Date(fractionalData.buyoutDeadline).getTime() - Date.now();
    const totalTime = 7 * 24 * 60 * 60 * 1000; // 7 days
    return Math.max(0, (totalTime - timeRemaining) / totalTime * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <PieChart className="w-5 h-5 mr-2" />
                Fractional Ownership: {domain.name}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {fractionalData.totalShares.toLocaleString()} shares • {formatCurrency(fractionalData.sharePrice)} per share
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatCurrency(fractionalData.currentPrice)}</p>
              <p className="text-sm text-gray-600">Current Price</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trade">Trade</TabsTrigger>
          <TabsTrigger value="liquidity">Liquidity</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Your Shares</p>
                    <p className="text-xl font-bold">{fractionalData.userShares.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{formatPercent(getVotingPower())} voting power</p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
                    <p className="text-xl font-bold">{formatCurrency(fractionalData.userShares * fractionalData.sharePrice)}</p>
                    <p className="text-sm text-green-600">+5.2% today</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Liquidity Pool</p>
                    <p className="text-xl font-bold">{formatCurrency(fractionalData.totalLiquidity)}</p>
                    <p className="text-sm text-gray-600">Your share: {formatCurrency(fractionalData.userLiquidity)}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Claimable Revenue</p>
                    <p className="text-xl font-bold">{formatCurrency(fractionalData.claimableRevenue)}</p>
                    <Button size="sm" onClick={claimRevenue} disabled={fractionalData.claimableRevenue === 0}>
                      Claim
                    </Button>
                  </div>
                  <DollarSign className="w-8 h-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Buyout Status */}
          {fractionalData.isBuyoutTriggered && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Buyout in Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Buyout Progress</span>
                    <span>{formatPercent(getBuyoutProgress())}</span>
                  </div>
                  <Progress value={getBuyoutProgress()} className="w-full" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Initiator</p>
                      <p className="font-medium">{fractionalData.buyoutInitiator}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Amount</p>
                      <p className="font-medium">{formatCurrency(fractionalData.buyoutAmount || 0)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Deadline</p>
                      <p className="font-medium">{new Date(fractionalData.buyoutDeadline).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <Badge variant={fractionalData.isBuyoutCompleted ? 'default' : 'secondary'}>
                        {fractionalData.isBuyoutCompleted ? 'Completed' : 'Active'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Trade Tab */}
        <TabsContent value="trade" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trade Shares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Button
                    variant={tradeType === 'buy' ? 'default' : 'outline'}
                    onClick={() => setTradeType('buy')}
                  >
                    Buy
                  </Button>
                  <Button
                    variant={tradeType === 'sell' ? 'default' : 'outline'}
                    onClick={() => setTradeType('sell')}
                  >
                    Sell
                  </Button>
                </div>

                <div>
                  <Label htmlFor="tradeAmount">
                    {tradeType === 'buy' ? 'ETH Amount' : 'Shares to Sell'}
                  </Label>
                  <Input
                    id="tradeAmount"
                    type="number"
                    value={tradeAmount}
                    onChange={(e) => {
                      setTradeAmount(e.target.value);
                      getTradeQuote(e.target.value, tradeType);
                    }}
                    placeholder={tradeType === 'buy' ? '0.1' : '100'}
                  />
                </div>

                {tradeQuote && (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>You {tradeType === 'buy' ? 'receive' : 'pay'}</span>
                      <span className="font-medium">
                        {tradeType === 'buy' ? tradeQuote.outputAmount.toLocaleString() : formatCurrency(tradeQuote.outputAmount)} shares
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price Impact</span>
                      <span className={tradeQuote.priceImpact > 5 ? 'text-red-600' : 'text-green-600'}>
                        {formatPercent(tradeQuote.priceImpact)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fee</span>
                      <span>{formatCurrency(tradeQuote.feeAmount)}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={executeTrade}
                  disabled={!tradeQuote || isTrading}
                  className="w-full"
                >
                  {isTrading ? 'Trading...' : `${tradeType === 'buy' ? 'Buy' : 'Sell'} Shares`}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Current Price</span>
                    <span className="font-medium">{formatCurrency(fractionalData.currentPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24h Volume</span>
                    <span className="font-medium">{formatCurrency(125000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Supply</span>
                    <span className="font-medium">{fractionalData.totalShares.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Market Cap</span>
                    <span className="font-medium">{formatCurrency(fractionalData.totalShares * fractionalData.sharePrice)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Price Chart</h4>
                  <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
                    <span className="text-gray-500">Price chart would go here</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Liquidity Tab */}
        <TabsContent value="liquidity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Liquidity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="liquidityAmount">ETH Amount</Label>
                <Input
                  id="liquidityAmount"
                  type="number"
                  value={liquidityAmount}
                  onChange={(e) => setLiquidityAmount(e.target.value)}
                  placeholder="1.0"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">You will provide:</p>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>ETH</span>
                    <span>{liquidityAmount || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domain Shares</span>
                    <span>{liquidityAmount ? (parseFloat(liquidityAmount) * fractionalData.currentPrice).toLocaleString() : '0'}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={addLiquidity}
                disabled={!liquidityAmount || isAddingLiquidity}
                className="w-full"
              >
                {isAddingLiquidity ? 'Adding Liquidity...' : 'Add Liquidity'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Governance Tab */}
        <TabsContent value="governance" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Governance Proposals</h3>
            <Button>Create Proposal</Button>
          </div>

          <div className="space-y-4">
            {governanceProposals.map((proposal) => (
              <Card key={proposal.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{proposal.title}</h4>
                      <Badge variant={proposal.status === 'active' ? 'default' : 'secondary'}>
                        {proposal.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600">{proposal.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-sm">
                        <span className="text-green-600">For: {proposal.votesFor}</span>
                        <span className="text-red-600">Against: {proposal.votesAgainst}</span>
                      </div>
                      <div className="flex space-x-2">
                        {proposal.status === 'active' && (
                          <>
                            <Button
                              size="sm"
                              variant={proposal.userVote === 'for' ? 'default' : 'outline'}
                              onClick={() => voteOnProposal(proposal.id, 'for')}
                            >
                              For
                            </Button>
                            <Button
                              size="sm"
                              variant={proposal.userVote === 'against' ? 'default' : 'outline'}
                              onClick={() => voteOnProposal(proposal.id, 'against')}
                            >
                              Against
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Revenue</span>
                    <span className="font-medium">{formatCurrency(fractionalData.totalRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Claimable</span>
                    <span className="font-medium text-green-600">{formatCurrency(fractionalData.claimableRevenue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Your Share</span>
                    <span className="font-medium">{formatPercent(getVotingPower())}</span>
                  </div>
                </div>

                <Button onClick={claimRevenue} disabled={fractionalData.claimableRevenue === 0} className="w-full">
                  Claim Revenue
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { date: '2024-01-15', amount: 1250, type: 'Advertising' },
                    { date: '2024-01-10', amount: 800, type: 'Leasing' },
                    { date: '2024-01-05', amount: 2100, type: 'Partnership' }
                  ].map((revenue, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium">{revenue.type}</p>
                        <p className="text-xs text-gray-600">{revenue.date}</p>
                      </div>
                      <span className="font-medium">{formatCurrency(revenue.amount)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FractionalOwnershipManager;
