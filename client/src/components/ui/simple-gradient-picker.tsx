import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface SimpleGradientPickerProps {
  gradient: string;
  onChange: (gradient: string) => void;
  label?: string;
  className?: string;
}

export function SimpleGradientPicker({ gradient, onChange, label, className }: SimpleGradientPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

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
              style={{ background: gradient || presetGradients[0] }}
            />
            <span className="text-sm truncate">Gradient</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            {/* Gradient Preview */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Preview</Label>
              <div
                className="w-full h-16 rounded-lg border-2 border-gray-200"
                style={{ background: gradient || presetGradients[0] }}
              />
            </div>

            {/* Preset Gradients */}
            <div>
              <Label className="text-sm font-medium mb-2 block">Choose Gradient</Label>
              <div className="grid grid-cols-3 gap-2">
                {presetGradients.map((preset, index) => (
                  <button
                    key={index}
                    className="h-12 rounded border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ background: preset }}
                    onClick={() => {
                      onChange(preset);
                      setIsOpen(false);
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