import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Volume2, MousePointer, Type, Contrast, Zap } from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: number;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  colorBlindSupport: boolean;
  focusIndicators: boolean;
}

const EnhancedAccessibility: React.FC = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    fontSize: 16,
    reducedMotion: false,
    screenReader: false,
    keyboardNavigation: true,
    colorBlindSupport: false,
    focusIndicators: true,
  });

  const [isOpen, setIsOpen] = useState(false);

  // Apply accessibility settings to the document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Font size
    root.style.fontSize = `${settings.fontSize}px`;

    // Reduced motion
    if (settings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--animation-iteration-count', '1');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--animation-iteration-count');
    }

    // Focus indicators
    if (settings.focusIndicators) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }

    // Color blind support
    if (settings.colorBlindSupport) {
      root.classList.add('colorblind-support');
    } else {
      root.classList.remove('colorblind-support');
    }

  }, [settings]);

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      highContrast: false,
      fontSize: 16,
      reducedMotion: false,
      screenReader: false,
      keyboardNavigation: true,
      colorBlindSupport: false,
      focusIndicators: true,
    });
  };

  const accessibilityFeatures = [
    {
      icon: <Contrast className="h-5 w-5" />,
      title: "High Contrast",
      description: "Increase contrast for better visibility",
      setting: 'highContrast' as keyof AccessibilitySettings,
      type: 'boolean' as const,
    },
    {
      icon: <Type className="h-5 w-5" />,
      title: "Font Size",
      description: "Adjust text size for readability",
      setting: 'fontSize' as keyof AccessibilitySettings,
      type: 'range' as const,
      min: 12,
      max: 24,
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Reduced Motion",
      description: "Minimize animations and transitions",
      setting: 'reducedMotion' as keyof AccessibilitySettings,
      type: 'boolean' as const,
    },
    {
      icon: <Volume2 className="h-5 w-5" />,
      title: "Screen Reader",
      description: "Optimize for screen readers",
      setting: 'screenReader' as keyof AccessibilitySettings,
      type: 'boolean' as const,
    },
    {
      icon: <MousePointer className="h-5 w-5" />,
      title: "Keyboard Navigation",
      description: "Enhanced keyboard support",
      setting: 'keyboardNavigation' as keyof AccessibilitySettings,
      type: 'boolean' as const,
    },
    {
      icon: <Eye className="h-5 w-5" />,
      title: "Color Blind Support",
      description: "Alternative color schemes",
      setting: 'colorBlindSupport' as keyof AccessibilitySettings,
      type: 'boolean' as const,
    },
  ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        variant="glass"
        size="icon-lg"
        className="fixed bottom-6 left-6 z-50 animate-bounce-in shadow-lg hover:shadow-xl"
        title="Accessibility Settings"
      >
        <Eye className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 glass-card border-gradient-dark animate-scale-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-gradient-primary flex items-center gap-2">
              <Eye className="h-6 w-6" />
              Accessibility Settings
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              ✕
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {accessibilityFeatures.map((feature, index) => (
              <div
                key={feature.setting}
                className="flex items-center justify-between p-4 glass-card rounded-lg border-gradient-dark animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {feature.type === 'boolean' ? (
                    <Switch
                      checked={settings[feature.setting] as boolean}
                      onCheckedChange={(checked) => updateSetting(feature.setting, checked)}
                    />
                  ) : feature.type === 'range' ? (
                    <div className="w-32">
                      <Slider
                        value={[settings[feature.setting] as number]}
                        onValueChange={([value]) => updateSetting(feature.setting, value)}
                        min={feature.min}
                        max={feature.max}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-xs text-center text-muted-foreground mt-1">
                        {settings[feature.setting]}px
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <Button
              variant="outline"
              onClick={resetSettings}
              className="hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive"
            >
              Reset Settings
            </Button>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="animate-pulse">
                {Object.values(settings).filter(Boolean).length} Active
              </Badge>
              <Button
                variant="gradient"
                onClick={() => setIsOpen(false)}
                className="animate-pulse-glow"
              >
                Apply Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedAccessibility;
