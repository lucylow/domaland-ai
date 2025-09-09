import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
        {/* Hero Section */}
        <section className="pt-8 pb-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="mb-8 flex justify-center">
            <Logo size="xl" showText={true} showTagline={true} variant="full" className="animate-float" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
            Transform Domains into Digital Assets
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
            Tokenize, trade, and leverage your domain portfolio with blockchain technology. 
            Unlock liquidity and new revenue streams from your digital real estate.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1">
                <div className="flex items-center gap-2">
                  <span>🚀</span>
                  Start Tokenizing
                </div>
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-10 py-6 border-2 hover:bg-primary/10 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center gap-2">
                <span>📚</span>
                Learn More
              </div>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-card/30 to-card/10 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '3s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Powerful DomainFi Features
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover how our platform revolutionizes domain ownership and investment
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🔗",
                title: "Instant Tokenization",
                description: "Convert any domain into a blockchain-based asset in minutes with our seamless tokenization process."
              },
              {
                icon: "📈",
                title: "Liquidity Marketplace",
                description: "Trade domain tokens on our secure marketplace with instant settlements and transparent pricing."
              },
              {
                icon: "🎯",
                title: "Fractional Ownership",
                description: "Enable fractional investments in high-value domains, making premium assets accessible to everyone."
              },
              {
                icon: "🔒",
                title: "Secure Ownership",
                description: "Leverage blockchain technology for immutable proof of ownership and transfer history."
              },
              {
                icon: "💰",
                title: "Royalty Management",
                description: "Automatically distribute royalties and payments to fractional owners with smart contracts."
              },
              {
                icon: "🌐",
                title: "Cross-Chain Support",
                description: "Access your domain tokens across multiple blockchain networks for maximum flexibility."
              }
            ].map((feature, index) => (
              <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-8 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-2">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -top-2 -left-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
                
                <div className="relative z-10">
                  <div className="text-5xl mb-6 animate-float" style={{animationDelay: `${index * 0.5}s`}}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-background to-card/20 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2.5s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              How DomainFi Works
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Simple steps to transform your domains into liquid digital assets
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Connect Wallet",
                description: "Link your Web3 wallet to access the tokenization platform.",
                icon: "🔗"
              },
              {
                step: "2",
                title: "Select Domain",
                description: "Choose a domain from your portfolio to tokenize.",
                icon: "🌐"
              },
              {
                step: "3",
                title: "Configure Terms",
                description: "Set pricing, royalties, and fractionalization options.",
                icon: "⚙️"
              },
              {
                step: "4",
                title: "Tokenize & Trade",
                description: "Mint your domain token and start trading on our marketplace.",
                icon: "🚀"
              }
            ].map((step, index) => (
              <div key={index} className="group text-center relative">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto shadow-lg shadow-primary/25 group-hover:shadow-xl group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-110">
                    {step.step}
                  </div>
                  <div className="absolute -top-2 -right-2 text-2xl animate-float" style={{animationDelay: `${index * 0.3}s`}}>
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                  {step.description}
                </p>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-10 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-card/30 to-card/10 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-20 right-20 w-80 h-80 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Success Stories
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              See how domain owners are leveraging DomainFi technology
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "DomainFi helped me unlock $50,000 in liquidity from domains I was just holding. The process was seamless and secure.",
                author: "John Daniels",
                role: "Domain Investor",
                avatar: "JD"
              },
              {
                text: "Fractional ownership allowed me to diversify my portfolio with premium domains I couldn't afford outright. Game changer!",
                author: "Sarah Reynolds",
                role: "Crypto Investor",
                avatar: "SR"
              },
              {
                text: "The royalty system automatically distributes earnings from my domain developments. Set it and forget it revenue streams.",
                author: "Mike Johnson",
                role: "Domain Developer",
                avatar: "MJ"
              }
            ].map((testimonial, index) => (
              <div key={index} className="group relative overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-8 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-2">
                {/* Shimmer effect */}
                <div className="absolute inset-0 -top-2 -left-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer"></div>
                
                <div className="relative z-10">
                  <div className="text-4xl mb-4 opacity-20">💬</div>
                  <p className="text-muted-foreground italic mb-6 group-hover:text-foreground/80 transition-colors duration-300 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary text-white rounded-full flex items-center justify-center font-semibold mr-4 shadow-lg shadow-primary/25 group-hover:shadow-xl group-hover:shadow-primary/40 transition-all duration-300">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold group-hover:text-primary transition-colors duration-300">
                        {testimonial.author}
                      </h4>
                      <p className="text-sm text-muted-foreground group-hover:text-foreground/70 transition-colors duration-300">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto text-white">
            <div className="mb-8">
              <span className="text-6xl animate-float">🚀</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Ready to Transform Your Domains?
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90 leading-relaxed">
              Join thousands of domain owners who are already leveraging blockchain technology to unlock new value from their digital assets.
            </p>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg" className="text-lg px-12 py-6 bg-white text-primary hover:bg-white/90 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-white/25 hover:-translate-y-1">
                <div className="flex items-center gap-2">
                  <span>⚡</span>
                  Start Tokenizing Now
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-t border-border/50 py-16 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-48 h-48 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <Logo size="md" showText={true} showTagline={false} variant="default" />
              <p className="text-muted-foreground leading-relaxed">
                Transforming domain ownership through blockchain technology and decentralized finance.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-foreground">Platform</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/marketplace" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>🏪</span> Marketplace</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>🔗</span> Tokenization</Link></li>
                <li><Link to="/fractional" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>🎯</span> Fractional Ownership</Link></li>
                <li><Link to="/analytics" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>💰</span> Analytics</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-foreground">Resources</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>📚</span> Documentation</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>🎓</span> Tutorials</Link></li>
                <li><Link to="/analytics" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>📝</span> Blog</Link></li>
                <li><Link to="/marketplace" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>🔧</span> API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-6 text-foreground">Company</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li><Link to="/dashboard" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>👥</span> About Us</Link></li>
                <li><Link to="/dashboard" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>💼</span> Careers</Link></li>
                <li><Link to="/marketplace" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>📧</span> Contact</Link></li>
                <li><Link to="/analytics" className="hover:text-primary transition-colors duration-300 flex items-center gap-2"><span>⚖️</span> Legal</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 text-center">
            <p className="text-muted-foreground">
              &copy; 2024 DomainFi. All rights reserved. Built with ❤️ for the decentralized web.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;