import { useEffect } from 'react';
import { useNotificationHelpers } from './EnhancedNotificationSystem';

const PWARegistration: React.FC = () => {
  const { showInfo, showSuccess } = useNotificationHelpers();

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('Service Worker registered successfully:', registration);
          
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  showInfo(
                    'App Update Available',
                    'A new version of DomaLand is available. Refresh to update.',
                    {
                      actions: [
                        {
                          label: 'Refresh',
                          action: () => window.location.reload(),
                          variant: 'default' as const
                        }
                      ]
                    }
                  );
                }
              });
            }
          });
        } catch (error) {
          console.error('Service Worker registration failed:', error);
        }
      });
    }

    // Handle PWA install prompt
    let deferredPrompt: any;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      
      showInfo(
        'Install DomaLand',
        'Install DomaLand for a better experience with offline access and faster loading.',
        {
          actions: [
            {
              label: 'Install',
              action: async () => {
                if (deferredPrompt) {
                  deferredPrompt.prompt();
                  const { outcome } = await deferredPrompt.userChoice;
                  
                  if (outcome === 'accepted') {
                    showSuccess('App Installed', 'DomaLand has been installed successfully!');
                  }
                  
                  deferredPrompt = null;
                }
              },
              variant: 'default' as const
            }
          ],
          persistent: true
        }
      );
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Handle app installed
    window.addEventListener('appinstalled', () => {
      showSuccess('App Installed', 'DomaLand has been installed successfully!');
    });

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [showInfo, showSuccess]);

  return null; // This component doesn't render anything
};

export default PWARegistration;
