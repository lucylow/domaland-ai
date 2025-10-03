import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, FileText, Globe, Share2 } from 'lucide-react';

const MOCK_CONTENT = [
  {
    domain: 'crypto.ai',
    type: 'landing',
    status: 'generated',
    preview: 'Modern landing page with AI-powered crypto insights and analytics...',
    keywords: ['crypto', 'AI', 'blockchain', 'analytics']
  },
  {
    domain: 'nft.eth',
    type: 'seo',
    status: 'ready',
    preview: 'Comprehensive SEO content package including meta descriptions, keywords...',
    keywords: ['NFT', 'ethereum', 'digital art', 'marketplace']
  },
  {
    domain: 'web3.com',
    type: 'social',
    status: 'generating',
    preview: 'Social media content strategy with engaging posts and hashtags...',
    keywords: ['web3', 'decentralized', 'future', 'technology']
  }
];

export const ContentGenerationPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>AI Content Generator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {MOCK_CONTENT.map((content, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      {content.type === 'landing' && <Globe className="w-5 h-5 text-primary" />}
                      {content.type === 'seo' && <FileText className="w-5 h-5 text-primary" />}
                      {content.type === 'social' && <Share2 className="w-5 h-5 text-primary" />}
                    </div>
                    <div>
                      <h3 className="font-semibold">{content.domain}</h3>
                      <p className="text-sm text-muted-foreground capitalize">{content.type} Page</p>
                    </div>
                  </div>
                  <Badge 
                    className={
                      content.status === 'generated' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : content.status === 'ready'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }
                  >
                    {content.status}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">{content.preview}</p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {content.keywords.map((keyword, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
