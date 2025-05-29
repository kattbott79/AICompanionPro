import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ColorPicker } from "./color-picker";
import { SimpleGradientPicker } from "./simple-gradient-picker";
import { useTheme } from "./theme-provider";
import { 
  Palette, 
  Save, 
  Download, 
  Upload, 
  RefreshCw, 
  Eye,
  Sparkles,
  Sun,
  Moon
} from "lucide-react";

interface CustomTheme {
  name: string;
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    muted: string;
    card: string;
    border: string;
  };
  gradients?: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
}

interface ThemeCustomizerProps {
  onClose?: () => void;
}

export function ThemeCustomizer({ onClose }: ThemeCustomizerProps) {
  const { theme, setTheme } = useTheme();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [themeName, setThemeName] = useState("My Custom Theme");
  
  const [customTheme, setCustomTheme] = useState<CustomTheme>({
    name: "My Custom Theme",
    colors: {
      background: "#ffffff",
      foreground: "#0f172a",
      primary: "#3b82f6",
      secondary: "#64748b",
      accent: "#8b5cf6",
      muted: "#f1f5f9",
      card: "#ffffff",
      border: "#e2e8f0"
    },
    gradients: {
      primary: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      secondary: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
      accent: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
      background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
    }
  });

  const [savedThemes, setSavedThemes] = useState<CustomTheme[]>([]);

  // Load saved themes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("custom-themes");
    if (saved) {
      try {
        setSavedThemes(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading saved themes:", error);
      }
    }
  }, []);

  // Apply theme preview
  useEffect(() => {
    if (isPreviewMode) {
      const root = document.documentElement;
      Object.entries(customTheme.colors).forEach(([key, value]) => {
        // Convert hex to HSL for CSS variables
        const hsl = hexToHsl(value);
        root.style.setProperty(`--${key}`, `${hsl.h} ${hsl.s}% ${hsl.l}%`);
      });
    }
  }, [customTheme, isPreviewMode]);

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

  const updateThemeColor = (colorKey: keyof CustomTheme['colors'], color: string) => {
    setCustomTheme(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: color
      }
    }));
  };

  const updateThemeGradient = (gradientKey: keyof NonNullable<CustomTheme['gradients']>, gradient: string) => {
    setCustomTheme(prev => ({
      ...prev,
      gradients: {
        ...prev.gradients!,
        [gradientKey]: gradient
      }
    }));
  };

  const saveTheme = () => {
    const newTheme = { ...customTheme, name: themeName };
    const updatedThemes = [...savedThemes, newTheme];
    setSavedThemes(updatedThemes);
    localStorage.setItem("custom-themes", JSON.stringify(updatedThemes));
  };

  const loadTheme = (theme: CustomTheme) => {
    setCustomTheme(theme);
    setThemeName(theme.name);
  };

  const deleteTheme = (index: number) => {
    const updatedThemes = savedThemes.filter((_, i) => i !== index);
    setSavedThemes(updatedThemes);
    localStorage.setItem("custom-themes", JSON.stringify(updatedThemes));
  };

  const resetToDefault = () => {
    setCustomTheme({
      name: "Default Theme",
      colors: {
        background: "#ffffff",
        foreground: "#0f172a",
        primary: "#3b82f6",
        secondary: "#64748b",
        accent: "#8b5cf6",
        muted: "#f1f5f9",
        card: "#ffffff",
        border: "#e2e8f0"
      },
      gradients: {
        primary: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        secondary: "linear-gradient(135deg, #64748b 0%, #475569 100%)",
        accent: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
      }
    });
  };

  const exportTheme = () => {
    const dataStr = JSON.stringify(customTheme, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${customTheme.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const presetThemes: CustomTheme[] = [
    {
      name: "Ocean Blue",
      colors: {
        background: "#f0f9ff",
        foreground: "#0c4a6e",
        primary: "#0ea5e9",
        secondary: "#0369a1",
        accent: "#06b6d4",
        muted: "#e0f2fe",
        card: "#ffffff",
        border: "#bae6fd"
      }
    },
    {
      name: "Forest Green",
      colors: {
        background: "#f0fdf4",
        foreground: "#14532d",
        primary: "#22c55e",
        secondary: "#16a34a",
        accent: "#10b981",
        muted: "#dcfce7",
        card: "#ffffff",
        border: "#bbf7d0"
      }
    },
    {
      name: "Sunset Orange",
      colors: {
        background: "#fff7ed",
        foreground: "#9a3412",
        primary: "#f97316",
        secondary: "#ea580c",
        accent: "#fb923c",
        muted: "#fed7aa",
        card: "#ffffff",
        border: "#fdba74"
      }
    },
    {
      name: "Purple Dream",
      colors: {
        background: "#faf5ff",
        foreground: "#581c87",
        primary: "#8b5cf6",
        secondary: "#7c3aed",
        accent: "#a855f7",
        muted: "#e9d5ff",
        card: "#ffffff",
        border: "#c4b5fd"
      }
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Palette className="w-5 h-5 text-primary" />
            <CardTitle>Theme Customizer</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {isPreviewMode ? "Stop Preview" : "Preview"}
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ×
              </Button>
            )}
          </div>
        </div>
        <CardDescription>
          Create your personalized color theme. Changes will be applied in real-time when preview is enabled.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="customize" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customize">Colors</TabsTrigger>
            <TabsTrigger value="gradients">Gradients</TabsTrigger>
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="saved">Saved</TabsTrigger>
          </TabsList>

          <TabsContent value="customize" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="Enter theme name"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ColorPicker
                  label="Background"
                  color={customTheme.colors.background}
                  onChange={(color) => updateThemeColor('background', color)}
                />
                <ColorPicker
                  label="Text Color"
                  color={customTheme.colors.foreground}
                  onChange={(color) => updateThemeColor('foreground', color)}
                />
                <ColorPicker
                  label="Primary"
                  color={customTheme.colors.primary}
                  onChange={(color) => updateThemeColor('primary', color)}
                />
                <ColorPicker
                  label="Secondary"
                  color={customTheme.colors.secondary}
                  onChange={(color) => updateThemeColor('secondary', color)}
                />
                <ColorPicker
                  label="Accent"
                  color={customTheme.colors.accent}
                  onChange={(color) => updateThemeColor('accent', color)}
                />
                <ColorPicker
                  label="Muted"
                  color={customTheme.colors.muted}
                  onChange={(color) => updateThemeColor('muted', color)}
                />
                <ColorPicker
                  label="Card Background"
                  color={customTheme.colors.card}
                  onChange={(color) => updateThemeColor('card', color)}
                />
                <ColorPicker
                  label="Border"
                  color={customTheme.colors.border}
                  onChange={(color) => updateThemeColor('border', color)}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                <Button onClick={saveTheme} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Theme
                </Button>
                <Button onClick={exportTheme} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button onClick={resetToDefault} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gradients" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme-name">Theme Name</Label>
                <Input
                  id="theme-name"
                  value={themeName}
                  onChange={(e) => setThemeName(e.target.value)}
                  placeholder="Enter theme name"
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SimpleGradientPicker
                  label="Primary Gradient"
                  gradient={customTheme.gradients?.primary || ""}
                  onChange={(gradient) => updateThemeGradient('primary', gradient)}
                />
                <SimpleGradientPicker
                  label="Secondary Gradient"
                  gradient={customTheme.gradients?.secondary || ""}
                  onChange={(gradient) => updateThemeGradient('secondary', gradient)}
                />
                <SimpleGradientPicker
                  label="Accent Gradient"
                  gradient={customTheme.gradients?.accent || ""}
                  onChange={(gradient) => updateThemeGradient('accent', gradient)}
                />
                <SimpleGradientPicker
                  label="Background Gradient"
                  gradient={customTheme.gradients?.background || ""}
                  onChange={(gradient) => updateThemeGradient('background', gradient)}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-4">
                <Button onClick={saveTheme} size="sm">
                  <Save className="w-4 h-4 mr-2" />
                  Save Theme
                </Button>
                <Button onClick={exportTheme} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button onClick={resetToDefault} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {presetThemes.map((preset, index) => (
                <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {preset.name}
                      <div className="flex space-x-1">
                        {Object.values(preset.colors).slice(0, 4).map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => loadTheme(preset)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Apply Theme
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="space-y-4">
            {savedThemes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No saved themes yet. Create and save your first custom theme!</p>
              </div>
            ) : (
              <ScrollArea className="h-96">
                <div className="space-y-3">
                  {savedThemes.map((savedTheme, index) => (
                    <Card key={index}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex space-x-1">
                            {Object.values(savedTheme.colors).slice(0, 4).map((color, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded border"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div>
                            <h4 className="font-medium">{savedTheme.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Custom theme
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => loadTheme(savedTheme)}
                            variant="outline"
                            size="sm"
                          >
                            Load
                          </Button>
                          <Button
                            onClick={() => deleteTheme(index)}
                            variant="destructive"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}