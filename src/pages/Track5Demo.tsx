import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  MessageCircle, 
  ShoppingCart, 
  Search, 
  Zap, 
  Shield, 
  TrendingUp,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Eye,
  Heart,
  Share2
} from 'lucide-react';

const Track5Demo: React.FC = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState('landing');

  const demoFeatures = [
    {
      id: 'landing',
      title: 'Automated Landing Pages',
      icon: Globe,
      description: 'SEO-optimized landing pages generated instantly for every tokenized domain',
      features: [
        'Dynamic SEO meta tags and structured data',
        'Real-time domain information display',
        'Integrated purchase and offer buttons',
        'Social media optimization',
        'Mobile-responsive design',
        'Analytics and tracking'
      ],
      demoUrl: '/domain/crypto.com'
    },
    {
      id: 'orderbook',
      title: 'Doma Orderbook Integration',
      icon: ShoppingCart,
      description: 'Seamless integration with Doma Protocol orderbook for live pricing and instant purchases',
      features: [
        'Real-time price updates',
        'One-click purchase execution',
        'Offer management system',
        'Transaction history tracking',
        'Gas optimization',
        'Multi-currency support'
      ],
      demoUrl: '/marketplace'
    },
    {
      id: 'messaging',
      title: 'XMTP Messaging Interface',
      icon: MessageCircle,
      description: 'Secure, encrypted messaging between buyers and sellers with offer integration',
      features: [
        'End-to-end encryption via XMTP',
        'Structured offer messages',
        'Real-time notifications',
        'Message templates',
        'Transaction integration',
        'Multi-device sync'
      ],
      demoUrl: '/chat?domain=crypto.com'
    },
    {
      id: 'seo',
      title: 'Advanced SEO Optimization',
      icon: Search,
      description: 'Comprehensive SEO implementation for maximum domain visibility and discoverability',
      features: [
        'AI-generated content optimization',
        'Schema.org structured data',
        'Dynamic meta tags',
        'Social media cards',
        'Sitemap generation',
        'Performance monitoring'
      ],
      demoUrl: '/domain/web3.org'
    }
  ];

  const track5Benefits = [
    {
      icon: Zap,
      title: 'Instant Page Generation',
      description: 'Landing pages are created automatically the moment a domain is tokenized',
      metric: '< 2 seconds'
    },
    {
      icon: TrendingUp,
      title: 'Enhanced Visibility',
      description: 'SEO optimization increases domain discoverability by up to 300%',
      metric: '+300%'
    },
    {
      icon: Shield,
      title: 'Secure Transactions',
      description: 'Blockchain-verified ownership and secure escrow for all transactions',
      metric: '100% secure'
    },
    {
      icon: Users,
      title: 'Reduced Friction',
      description: 'Streamlined purchase flow reduces transaction abandonment by 60%',
      metric: '-60%'
    }
  ];

  const currentDemo = demoFeatures.find(demo => demo.id === activeDemo);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2 text-sm">
            🏆 Track 5: Landing Pages & Messaging Interfaces
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-gradient mb-6">
            DomaLand Track 5 Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience how DomaLand revolutionizes domain sales through automated landing pages, 
            seamless orderbook integration, and secure messaging interfaces.
          </p>
        </div>

        {/* Benefits Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {track5Benefits.map((benefit, index) => (
            <Card key={index} className="card-interactive text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{benefit.description}</p>
                <div className="text-2xl font-bold text-primary">{benefit.metric}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interactive Demo */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Interactive Feature Demo</CardTitle>
            <p className="text-center text-muted-foreground">
              Click on each feature to see it in action
            </p>
          </CardHeader>
          <CardContent>
            <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                {demoFeatures.map((demo) => (
                  <TabsTrigger key={demo.id} value={demo.id} className="flex items-center gap-2">
                    <demo.icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{demo.title}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {demoFeatures.map((demo) => (
                <TabsContent key={demo.id} value={demo.id} className="mt-6">
                  <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                          <demo.icon className="w-6 h-6 text-primary" />
                          {demo.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">{demo.description}</p>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold">Key Features:</h4>
                        {demo.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={() => navigate(demo.demoUrl)}
                        className="w-full lg:w-auto"
                        size="lg"
                      >
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Live Demo
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </Button>
                    </div>
                    
                    <div className="bg-muted/30 rounded-lg p-6">
                      <h4 className="font-semibold mb-4">Demo Preview</h4>
                      <div className="space-y-4">
                        {demo.id === 'landing' && (
                          <div className="space-y-3">
                            <div className="bg-background rounded-lg p-4 border">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="w-4 h-4 text-primary" />
                                <span className="font-medium">crypto.com</span>
                                <Badge variant="outline">Premium</Badge>
                              </div>
                              <div className="text-2xl font-bold text-primary mb-2">10.5 ETH</div>
                              <div className="flex gap-2">
                                <Button size="sm" className="flex-1">Buy Now</Button>
                                <Button size="sm" variant="outline">Make Offer</Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ✓ SEO optimized • ✓ Mobile responsive • ✓ Real-time pricing
                            </div>
                          </div>
                        )}
                        
                        {demo.id === 'orderbook' && (
                          <div className="space-y-3">
                            <div className="bg-background rounded-lg p-4 border">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">Live Orderbook</span>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Best Bid:</span>
                                  <span className="font-medium">9.8 ETH</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Best Ask:</span>
                                  <span className="font-medium">10.5 ETH</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span>Volume 24h:</span>
                                  <span className="font-medium">45.2 ETH</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ✓ Real-time updates • ✓ Instant execution • ✓ Gas optimized
                            </div>
                          </div>
                        )}
                        
                        {demo.id === 'messaging' && (
                          <div className="space-y-3">
                            <div className="bg-background rounded-lg p-4 border">
                              <div className="flex items-center gap-2 mb-3">
                                <MessageCircle className="w-4 h-4 text-primary" />
                                <span className="font-medium">Secure Chat</span>
                                <Shield className="w-3 h-3 text-emerald-500" />
                              </div>
                              <div className="space-y-2">
                                <div className="bg-primary/10 rounded p-2 text-sm">
                                  Hi! I'm interested in crypto.com. Would you consider 9.5 ETH?
                                </div>
                                <div className="bg-muted rounded p-2 text-sm">
                                  Thanks for your interest! I could do 10.0 ETH.
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ✓ XMTP encrypted • ✓ Offer integration • ✓ Real-time sync
                            </div>
                          </div>
                        )}
                        
                        {demo.id === 'seo' && (
                          <div className="space-y-3">
                            <div className="bg-background rounded-lg p-4 border">
                              <div className="flex items-center gap-2 mb-2">
                                <Search className="w-4 h-4 text-primary" />
                                <span className="font-medium">SEO Optimization</span>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Title Tag:</span>
                                  <span className="text-xs">✓ Optimized</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Meta Description:</span>
                                  <span className="text-xs">✓ Optimized</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Structured Data:</span>
                                  <span className="text-xs">✓ Schema.org</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Social Cards:</span>
                                  <span className="text-xs">✓ Generated</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ✓ AI-generated content • ✓ Dynamic optimization • ✓ Performance tracking
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Technical Implementation */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Technical Implementation</CardTitle>
            <p className="text-center text-muted-foreground">
              How DomaLand achieves Track 5 objectives through innovative technology
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Core Technologies</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>React + TypeScript for dynamic UI</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Doma Protocol smart contracts</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>XMTP for encrypted messaging</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>AI-powered SEO optimization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span>Real-time blockchain integration</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Track 5 Achievements</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span>Automated landing page generation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span>SEO optimization for visibility</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span>Orderbook integration for transactions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span>Secure messaging interface</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                      <span>Reduced friction in domain sales</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Experience Track 5?</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Explore the full DomaLand platform and see how we're revolutionizing domain sales 
                through automated landing pages, seamless orderbook integration, and secure messaging.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/marketplace')}
                  size="lg"
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Explore Marketplace
                  </div>
                </Button>
                <Button 
                  onClick={() => navigate('/domain/crypto.com')}
                  variant="outline"
                  size="lg"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    View Landing Page
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Track5Demo;
