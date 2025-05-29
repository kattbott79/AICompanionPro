import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
  className?: string;
}

const hexToHsl = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
};

export function ColorPicker({ color, onChange, label, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hsl, setHsl] = useState(() => hexToHsl(color));

  useEffect(() => {
    setHsl(hexToHsl(color));
  }, [color]);

  const hslToHex = (h: number, s: number, l: number) => {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const updateColor = (newHsl: { h: number; s: number; l: number }) => {
    setHsl(newHsl);
    const hex = hslToHex(newHsl.h, newHsl.s, newHsl.l);
    onChange(hex);
  };

  const presetColors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FECA57",
    "#FF9FF3", "#54A0FF", "#5F27CD", "#00D2D3", "#FF9F43",
    "#EE5A24", "#0ABDE3", "#10AC84", "#F79F1F", "#A3CB38"
  ];

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-10 px-3"
          >
            <div
              className="w-6 h-6 rounded border mr-2 flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-mono">{color.toUpperCase()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            {/* Color Preview */}
            <div className="flex items-center space-x-3">
              <div
                className="w-16 h-16 rounded-lg border-2 border-gray-200"
                style={{ backgroundColor: color }}
              />
              <div className="flex-1">
                <Label htmlFor="hex-input" className="text-sm font-medium">
                  Hex Color
                </Label>
                <Input
                  id="hex-input"
                  value={color}
                  onChange={(e) => {
                    let hex = e.target.value;
                    // Add # if missing
                    if (!hex.startsWith('#')) {
                      hex = '#' + hex;
                    }
                    // Allow partial typing and validate on complete hex
                    if (hex.length <= 7) {
                      onChange(hex);
                      // Only update HSL if it's a complete valid hex
                      if (/^#[0-9A-F]{6}$/i.test(hex)) {
                        setHsl(hexToHsl(hex));
                      }
                    }
                  }}
                  className="font-mono mt-1"
                  placeholder="#000000"
                  maxLength={7}
                />
              </div>
            </div>

            {/* HSL Sliders */}
            <div className="space-y-3">
              <div>
                <Label className="text-sm text-gray-600">Hue: {hsl.h}°</Label>
                <Slider
                  value={[hsl.h]}
                  onValueChange={([h]) => updateColor({ ...hsl, h })}
                  max={360}
                  step={1}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">Saturation: {hsl.s}%</Label>
                <Slider
                  value={[hsl.s]}
                  onValueChange={([s]) => updateColor({ ...hsl, s })}
                  max={100}
                  step={1}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-gray-600">Lightness: {hsl.l}%</Label>
                <Slider
                  value={[hsl.l]}
                  onValueChange={([l]) => updateColor({ ...hsl, l })}
                  max={100}
                  step={1}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Preset Colors */}
            <div>
              <Label className="text-sm text-gray-600 mb-2 block">Quick Colors</Label>
              <div className="grid grid-cols-5 gap-2">
                {presetColors.map((presetColor) => (
                  <button
                    key={presetColor}
                    className="w-8 h-8 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: presetColor }}
                    onClick={() => {
                      onChange(presetColor);
                      setHsl(hexToHsl(presetColor));
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}