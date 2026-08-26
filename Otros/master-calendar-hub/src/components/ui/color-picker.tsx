import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Palette, AlertTriangle } from 'lucide-react';
import { colorPresets, rainbowColorPresets, getContrastRatio, meetsAccessibilityStandards, getTextColor, hslToHex } from '@/lib/colorPresets';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  disabled?: boolean;
  showContrastWarning?: boolean;
}

export function ColorPicker({ 
  value, 
  onChange, 
  className, 
  disabled = false,
  showContrastWarning = true 
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customHex, setCustomHex] = useState(value);
  const [hsl, setHsl] = useState({ h: 0, s: 50, l: 50 });

  const textColor = getTextColor(value);
  const contrastRatio = getContrastRatio(value, textColor);
  const hasGoodContrast = meetsAccessibilityStandards(value, textColor);

  const handlePresetSelect = useCallback((color: string) => {
    onChange(color);
    setCustomHex(color);
    setIsOpen(false);
  }, [onChange]);

  const handleCustomHexChange = useCallback((hex: string) => {
    setCustomHex(hex);
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
      onChange(hex);
    }
  }, [onChange]);

  const handleHslChange = useCallback((component: 'h' | 's' | 'l', newValue: number) => {
    const newHsl = { ...hsl, [component]: newValue };
    setHsl(newHsl);
    const hexColor = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    setCustomHex(hexColor);
    onChange(hexColor);
  }, [hsl, onChange]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: value }}
            />
            <Palette className="h-4 w-4" />
            <span>Choose Color</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Tabs defaultValue="presets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="rainbow">Rainbow</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
          
          <TabsContent value="presets" className="p-4">
            <div className="grid grid-cols-6 gap-2">
              {colorPresets.filter(preset => !preset.isRainbow).map((preset) => (
                <button
                  key={preset.name}
                  className="w-8 h-8 rounded border-2 border-border hover:border-ring transition-colors"
                  style={{ backgroundColor: preset.value }}
                  onClick={() => handlePresetSelect(preset.value)}
                  title={preset.name}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="rainbow" className="p-4">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {rainbowColorPresets.map((preset) => (
                <button
                  key={preset.name}
                  className="w-8 h-8 rounded border-2 border-border hover:border-ring transition-colors"
                  style={{ backgroundColor: preset.value }}
                  onClick={() => handlePresetSelect(preset.value)}
                  title={preset.name}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Rainbow colors (ROYGBIV)
            </p>
          </TabsContent>
          
          <TabsContent value="custom" className="p-4 space-y-4">
            <div>
              <Label htmlFor="hex-input">Hex Color</Label>
              <Input
                id="hex-input"
                value={customHex}
                onChange={(e) => handleCustomHexChange(e.target.value)}
                placeholder="#000000"
                className="font-mono"
              />
            </div>
            
            <div className="space-y-3">
              <div>
                <Label>Hue: {hsl.h}°</Label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hsl.h}
                  onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-purple-500 to-red-500 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <Label>Saturation: {hsl.s}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsl.s}
                  onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-gray-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <Label>Lightness: {hsl.l}%</Label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hsl.l}
                  onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-black via-gray-500 to-white rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Live Preview */}
        <div className="p-4 border-t">
          <div 
            className="w-full h-12 rounded flex items-center justify-center text-sm font-medium mb-2"
            style={{ 
              backgroundColor: value,
              color: textColor
            }}
          >
            Preview Text
          </div>
          
          {showContrastWarning && !hasGoodContrast && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                Low contrast ratio ({contrastRatio.toFixed(1)}:1). Consider a different color for better accessibility.
              </AlertDescription>
            </Alert>
          )}
          
          {hasGoodContrast && (
            <p className="text-xs text-muted-foreground text-center">
              Good contrast ratio: {contrastRatio.toFixed(1)}:1
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}