import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColorPicker } from "./color-picker";
import { cn } from "@/lib/utils";
import { Plus, Trash2, Palette } from "lucide-react";

interface GradientStop {
  color: string;
  position: number;
}

interface GradientPickerProps {
  gradient: string;
  onChange: (gradient: string) => void;
  label?: string;
  className?: string;
}

export function GradientPicker({ gradient, onChange, label, className }: GradientPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [direction, setDirection] = useState("to right");
  const [stops, setStops] = useState<GradientStop[]>([
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 100 }
  ]);

  useEffect(() => {
    // Parse existing gradient if provided
    if (gradient && gradient.includes("linear-gradient")) {
      const match = gradient.match(/linear-gradient\(([^)]+)\)/);
      if (match) {
        const parts = match[1].split(',').map(p => p.trim());
        const directionPart = parts[0];
        if (directionPart.includes('deg') || directionPart.includes('to ')) {
          setDirection(directionPart);
          // Parse color stops from remaining parts
          const colorParts = parts.slice(1);
          const newStops: GradientStop[] = [];
          colorParts.forEach(part => {
            const colorMatch = part.match(/(#[0-9a-f]{6}|rgb\([^)]+\))\s*(\d+%)?/i);
            if (colorMatch) {
              const color = colorMatch[1];
              const position = colorMatch[2] ? parseInt(colorMatch[2]) : newStops.length * 50;
              newStops.push({ color, position });
            }
          });
          if (newStops.length >= 2) {
            setStops(newStops);
          }
        }
      }
    }
  }, [gradient]);

  const generateGradient = useCallback(() => {
    const sortedStops = [...stops].sort((a, b) => a.position - b.position);
    const stopStrings = sortedStops.map(stop => `${stop.color} ${stop.position}%`);
    return `linear-gradient(${direction}, ${stopStrings.join(', ')})`;
  }, [direction, stops]);

  const addStop = () => {
    const newPosition = stops.length > 0 ? Math.max(...stops.map(s => s.position)) + 10 : 50;
    const newStops = [...stops, { color: "#ff0000", position: Math.min(newPosition, 100) }];
    setStops(newStops);
  };

  const removeStop = (index: number) => {
    if (stops.length > 2) {
      const newStops = stops.filter((_, i) => i !== index);
      setStops(newStops);
    }
  };

  const updateStop = (index: number, updates: Partial<GradientStop>) => {
    const newStops = stops.map((stop, i) => 
      i === index ? { ...stop, ...updates } : stop
    );
    setStops(newStops);
    setTimeout(handleUpdate, 0);
  };

  // Update gradient when direction or stops change
  const handleUpdate = () => {
    const newGradient = generateGradient();
    onChange(newGradient);
  };

  const presetGradients = [
    "linear-gradient(to right, #667eea, #764ba2)",
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(to right, #f093fb, #f5576c)",
    "linear-gradient(45deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(to right, #4facfe, #00f2fe)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(to right, #a8edea, #fed6e3)",
    "linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)",
    "linear-gradient(to right, #ffecd2, #fcb69f)",
    "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
    "linear-gradient(to right, #c471ed, #f64f59)",
    "linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)"
  ];

  const directionOptions = [
    { value: "to right", label: "Left to Right" },
    { value: "to left", label: "Right to Left" },
    { value: "to bottom", label: "Top to Bottom" },
    { value: "to top", label: "Bottom to Top" },
    { value: "45deg", label: "Diagonal ↗" },
    { value: "135deg", label: "Diagonal ↘" },
    { value: "-45deg", label: "Diagonal ↖" },
    { value: "-135deg", label: "Diagonal ↙" },
  ];

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start h-12 px-3 overflow-hidden"
          >
            <div
              className="w-8 h-8 rounded border mr-3 flex-shrink-0"
              style={{ background: generateGradient() }}
            />
            <span className="text-sm truncate">Gradient</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4">
          <div className="space-y-4">
            {/* Gradient Preview */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Preview</Label>
              <div
                className="w-full h-16 rounded-lg border-2 border-gray-200"
                style={{ background: generateGradient() }}
              />
            </div>

            {/* Direction Selector */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Direction</Label>
              <Select value={direction} onValueChange={(value) => { setDirection(value); setTimeout(handleUpdate, 0); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {directionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Stops */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Color Stops</Label>
                <Button
                  onClick={addStop}
                  size="sm"
                  variant="outline"
                  className="h-8 w-8 p-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {stops.map((stop, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded">
                    <div
                      className="w-6 h-6 rounded border flex-shrink-0"
                      style={{ backgroundColor: stop.color }}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Input
                          value={stop.color}
                          onChange={(e) => updateStop(index, { color: e.target.value })}
                          className="font-mono text-xs h-7"
                          placeholder="#000000"
                        />
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                              <Palette className="w-3 h-3" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <ColorPicker
                              color={stop.color}
                              onChange={(color) => updateStop(index, { color })}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-xs w-12">Position:</Label>
                        <Slider
                          value={[stop.position]}
                          onValueChange={([position]) => updateStop(index, { position })}
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs w-8">{stop.position}%</span>
                      </div>
                    </div>
                    {stops.length > 2 && (
                      <Button
                        onClick={() => removeStop(index)}
                        size="sm"
                        variant="destructive"
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Preset Gradients */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Quick Gradients</Label>
              <div className="grid grid-cols-3 gap-2">
                {presetGradients.map((preset, index) => (
                  <button
                    key={index}
                    className="h-12 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ background: preset }}
                    onClick={() => onChange(preset)}
                  />
                ))}
              </div>
            </div>

            {/* CSS Output */}
            <div>
              <Label className="text-sm font-medium mb-2 block">CSS Value</Label>
              <Input
                value={generateGradient()}
                readOnly
                className="font-mono text-xs"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}