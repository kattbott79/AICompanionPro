import { Moon, Sun, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ui/theme-provider";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ThemeCustomizer } from "@/components/ui/theme-customizer";
import { useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="relative"
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      
      <Dialog open={isCustomizerOpen} onOpenChange={setIsCustomizerOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Palette className="h-4 w-4" />
            <span className="sr-only">Customize theme</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Theme Customizer</DialogTitle>
          <DialogDescription className="sr-only">
            Customize colors and gradients for your theme
          </DialogDescription>
          <ThemeCustomizer onClose={() => setIsCustomizerOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}