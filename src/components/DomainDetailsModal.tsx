import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, Eye, DollarSign, Calendar, Zap, BarChart3 } from "lucide-react";

interface DomainDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: {
    name: string;
    description: string;
    price: string;
    valuation: string;
    tags: string[];
    trend: string;
  } | null;
  onQuickBuy?: (domain: { name: string; price: string; currency: string }) => void;
}

export function DomainDetailsModal({ isOpen, onClose, domain, onQuickBuy }: DomainDetailsModalProps) {
  if (!domain) return null;

  const mockAnalytics = {
    monthlyVisits: "1.2K",
    conversionRate: "4.2%",
    estimatedRevenue: "$3.8K",
    pageAuthority: "84"
  };

  const mockOffers = [
    { buyer: "0x742d...4f44e", amount: "1.5 ETH", date: "2 days ago" },
    { buyer: "0x8a4e...2c1d", amount: "2.0 ETH", date: "1 day ago" }
  ];

  const handleBuyClick = () => {
    const priceValue = domain.price.replace(' ETH', '');
    if (onQuickBuy) {
      onQuickBuy({ name: domain.name, price: priceValue, currency: 'ETH' });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {domain.name}
              </DialogTitle>
              <DialogDescription className="text-base">
                {domain.description}
              </DialogDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1 text-lg px-3 py-1">
              <TrendingUp className="h-4 w-4" />
              {domain.trend}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {domain.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Pricing Section */}
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5">
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Listed Price
                  </p>
                  <p className="text-3xl font-bold text-primary">{domain.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    AI Valuation
                  </p>
                  <p className="text-3xl font-bold">{domain.valuation}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex gap-3">
                <Button 
                  size="lg" 
                  className="flex-1"
                  onClick={handleBuyClick}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="flex-1"
                  onClick={onClose}
                >
                  Make Offer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Grid */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Domain Analytics
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {mockAnalytics.monthlyVisits}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Eye className="h-3 w-3" />
                    Monthly Visits
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {mockAnalytics.conversionRate}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Conversion Rate
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {mockAnalytics.estimatedRevenue}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Est. Revenue
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {mockAnalytics.pageAuthority}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Page Authority
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Offers */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Recent Offers
            </h3>
            <div className="space-y-2">
              {mockOffers.map((offer, index) => (
                <Card key={index}>
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-medium">{offer.buyer}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {offer.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{offer.amount}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Demo Notice */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> This is mock data for demonstration purposes. Connect your wallet to interact with real blockchain domains and make actual transactions.
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
