import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWeb3 } from '@/contexts/Web3Context';
import { useDoma } from '@/contexts/DomaContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle, ShoppingCart, Share2, Heart, Star, TrendingUp, Users, Globe, Shield, Zap } from 'lucide-react';

interface DomainLandingPageProps {
  domainName?: string;
}

const DomainLandingPage: React.FC<DomainLandingPageProps> = ({ domainName }) => {
  const { domain } = useParams<{ domain: string }>();
  const navigate = useNavigate();
  const { isConnected, account, connectWallet } = useWeb3();
  const { marketplaceDomains, buyDomain } = useDoma();
  const { toast } = useToast();
  
  const [currentDomain, setCurrentDomain] = useState<any>(null);
  const [offerAmount, setOfferAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [analytics, setAnalytics] = useState({
    views: Math.floor(Math.random() * 1000) + 500,
    offers: Math.floor(Math.random() * 20) + 5,
    watchers: Math.floor(Math.random() * 50) + 10,
    lastViewed: new Date(Date.now() - Math.random() * 86400000).toISOString()
  });

  const targetDomain = domainName || domain;

  useEffect(() => {
    if (targetDomain) {
      // Find domain in marketplace or create mock data
      const foundDomain = marketplaceDomains.find(d => d.name === targetDomain);
      if (foundDomain) {
        setCurrentDomain(foundDomain);
      } else {
        // Create mock domain data for demo
        setCurrentDomain({
          tokenId: Math.random().toString(36).substring(7),
          name: targetDomain,
          owner: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
          price: (Math.random() * 20 + 1).toFixed(2),
          isListed: true,
          category: 'Premium',
          listedAt: new Date(Date.now() - Math.random() * 2592000000).toISOString(),
          metadata: {
            description: `Premium domain ${targetDomain} - Perfect for your next project`,
            image: `https://api.doma.xyz/thumbnail/${targetDomain}`,
            seo: {
              title: `${targetDomain} - Premium Domain for Sale | DomaLand`,
              description: `Buy ${targetDomain} - A premium domain perfect for business, technology, or personal use. Secure ownership through blockchain technology.`,
              keywords: [targetDomain, 'domain for sale', 'premium domain', 'blockchain domain', 'web3 domain']
            }
          }
        });
      }
    }
  }, [targetDomain, marketplaceDomains]);

  const handleBuyNow = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!currentDomain) return;

    setIsLoading(true);
    try {
      await buyDomain(currentDomain.tokenId, currentDomain.price);
      toast({
        title: "Domain Purchased!",
        description: `Successfully purchased ${currentDomain.name} for ${currentDomain.price} ETH`,
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!offerAmount) {
      toast({
        title: "Invalid Offer",
        description: "Please enter a valid offer amount",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate offer submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Offer Submitted!",
        description: `Your offer of ${offerAmount} ETH for ${currentDomain.name} has been sent to the owner`,
      });
      
      setShowOfferDialog(false);
      setOfferAmount('');
    } catch (error) {
      toast({
        title: "Offer Failed",
        description: "Failed to submit offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Empty Message",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate message sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Message Sent!",
        description: `Your message has been sent to the owner of ${currentDomain.name}`,
      });
      
      setShowMessageDialog(false);
      setMessage('');
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const shareDomain = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied!",
      description: "Domain link copied to clipboard",
    });
  };

  if (!currentDomain) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold mb-2">Domain Not Found</h2>
          <p className="text-muted-foreground">The domain you're looking for doesn't exist or isn't available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* SEO Meta Tags - These would be dynamically set in a real implementation */}
      <head>
        <title>{currentDomain.metadata?.seo?.title || `${currentDomain.name} - Domain for Sale | DomaLand`}</title>
        <meta name="description" content={currentDomain.metadata?.seo?.description || `Buy ${currentDomain.name} - Premium domain available on DomaLand marketplace`} />
        <meta name="keywords" content={currentDomain.metadata?.seo?.keywords?.join(', ') || `${currentDomain.name}, domain for sale, premium domain`} />
        <meta property="og:title" content={`${currentDomain.name} - Domain for Sale`} />
        <meta property="og:description" content={currentDomain.metadata?.seo?.description} />
        <meta property="og:image" content={currentDomain.metadata?.image} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${currentDomain.name} - Domain for Sale`} />
        <meta name="twitter:description" content={currentDomain.metadata?.seo?.description} />
        <meta name="twitter:image" content={currentDomain.metadata?.image} />
      </head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <button onClick={() => navigate('/marketplace')} className="hover:text-primary transition-colors">
              Marketplace
            </button>
            <span>/</span>
            <span className="text-foreground">{currentDomain.name}</span>
          </div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gradient mb-2">
                {currentDomain.name}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>Premium Domain</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  <span>Blockchain Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Instant Transfer</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={shareDomain} className="flex items-center gap-2">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Watch
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Domain Overview */}
            <Card className="card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Domain Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Domain Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Domain Name:</span>
                        <span className="font-medium">{currentDomain.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge variant="outline">{currentDomain.category}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Listed:</span>
                        <span>{new Date(currentDomain.listedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Token ID:</span>
                        <span className="font-mono text-xs">{currentDomain.tokenId}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Owner Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Owner:</span>
                        <span className="font-mono text-xs">{currentDomain.owner?.slice(0, 6)}...{currentDomain.owner?.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Verified:</span>
                        <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                          ✓ Verified
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Reputation:</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="ml-1 text-xs">4.9</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {currentDomain.metadata?.description || `This premium domain ${currentDomain.name} is perfect for your next business venture, personal project, or investment portfolio. With its memorable name and strong brand potential, this domain offers excellent value and growth opportunities.`}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Analytics */}
            <Card className="card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Domain Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{analytics.views}</div>
                    <div className="text-sm text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{analytics.offers}</div>
                    <div className="text-sm text-muted-foreground">Offers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{analytics.watchers}</div>
                    <div className="text-sm text-muted-foreground">Watchers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">24h</div>
                    <div className="text-sm text-muted-foreground">Last Viewed</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Domains */}
            <Card className="card-interactive">
              <CardHeader>
                <CardTitle>Similar Domains</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {marketplaceDomains.slice(0, 4).map((domain) => (
                    <div key={domain.tokenId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">{domain.name}</div>
                        <div className="text-sm text-muted-foreground">{domain.price} ETH</div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/domain/${domain.name}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Purchase Card */}
            <Card className="card-interactive sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Purchase Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {currentDomain.price} ETH
                  </div>
                  <div className="text-muted-foreground">
                    ≈ ${(parseFloat(currentDomain.price) * 2000).toFixed(0)} USD
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handleBuyNow}
                    disabled={isLoading}
                    className="w-full bg-foreground text-background hover:bg-foreground/90 font-medium py-3"
                    size="lg"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Buy Now
                      </div>
                    )}
                  </Button>

                  <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          Make Offer
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Make an Offer</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Offer Amount (ETH)</label>
                          <Input
                            type="number"
                            placeholder="Enter your offer"
                            value={offerAmount}
                            onChange={(e) => setOfferAmount(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleMakeOffer} disabled={isLoading} className="flex-1">
                            {isLoading ? 'Submitting...' : 'Submit Offer'}
                          </Button>
                          <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          Contact Owner
                        </div>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Send Message to Owner</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Message</label>
                          <Textarea
                            placeholder="Ask questions about this domain..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="mt-1"
                            rows={4}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSendMessage} disabled={isLoading} className="flex-1">
                            {isLoading ? 'Sending...' : 'Send Message'}
                          </Button>
                          <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="text-xs text-muted-foreground text-center space-y-1">
                  <div>✓ Instant ownership transfer</div>
                  <div>✓ Blockchain verified</div>
                  <div>✓ Secure escrow protection</div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Stats */}
            <Card className="card-interactive">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Owner Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domains Sold:</span>
                  <span className="font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Volume:</span>
                  <span className="font-medium">1,234 ETH</span>
                </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time:</span>
                    <span className="font-medium text-emerald-600">&lt; 1 hour</span>
                  </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since:</span>
                  <span className="font-medium">2023</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DomainLandingPage;
