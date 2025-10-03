import { FC } from 'react';
import { useXMTP } from '@/contexts/XMTPContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export const MessagingTab: FC = () => {
  const { conversations, isConnected: isXMTPConnected, connectXMTP, getUnreadCount } = useXMTP();
  const unreadCount = getUnreadCount();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Secure Messaging</h2>
      
      {!isXMTPConnected ? (
        <Card className="bg-background/10 border-border/20 text-white">
          <CardHeader>
            <CardTitle>Connect XMTP</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/70">
              Connect to XMTP to enable secure, decentralized messaging with other domain traders.
            </p>
            <Button onClick={connectXMTP} className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              Connect XMTP
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card className="bg-background/10 border-border/20 text-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conversations</CardTitle>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                    {unreadCount} unread
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {conversations.length === 0 ? (
                <p className="text-white/70">No conversations yet</p>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div key={conv.peerAddress} className="p-3 bg-background/5 rounded cursor-pointer hover:bg-background/10">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{conv.peerAddress.slice(0, 6)}...{conv.peerAddress.slice(-4)}</span>
                        <span className="text-xs text-white/70">{new Date(conv.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
