import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Users } from "lucide-react";
import { Template } from "@/types/chat";
import { cn } from "@/lib/utils";

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
  variant?: "grid" | "list";
  showActions?: boolean;
  className?: string;
}

export function TemplateCard({ 
  template, 
  onSelect, 
  variant = "grid",
  showActions = true,
  className 
}: TemplateCardProps) {
  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "text-primary bg-primary/10 hover:bg-primary/20",
      green: "text-accent bg-accent/10 hover:bg-accent/20", 
      purple: "text-secondary bg-secondary/10 hover:bg-secondary/20",
      indigo: "text-primary bg-primary/10 hover:bg-primary/20",
      yellow: "text-accent bg-accent/10 hover:bg-accent/20",
      red: "text-secondary bg-secondary/10 hover:bg-secondary/20",
      pink: "text-secondary bg-secondary/10 hover:bg-secondary/20",
    };
    return colorMap[color] || colorMap.blue;
  };

  const getImageUrl = (subcategory: string) => {
    const imageMap: Record<string, string> = {
      ecommerce: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      service: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      content: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      productivity: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      health: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      finance: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
      home: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200",
    };
    return imageMap[subcategory] || imageMap.productivity;
  };

  if (variant === "list") {
    return (
      <Card className={cn(
        "group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        "bg-card/50 border-border/50 hover:border-primary/50",
        getColorClass(template.color),
        className
      )}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <img 
              src={getImageUrl(template.subcategory)}
              alt={template.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <i className={cn(template.icon, "text-sm")} />
                <h3 className="font-semibold">{template.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {template.category}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
              
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{template.timesSaved}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3 text-yellow-400" />
                  <span>{template.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{template.userCount.toLocaleString()} users</span>
                </div>
              </div>
            </div>
            
            {showActions && (
              <Button 
                size="sm"
                onClick={() => onSelect(template)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Select
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
        "bg-card/50 border-border/50 hover:border-primary/50",
        getColorClass(template.color),
        className
      )}
      onClick={() => onSelect(template)}
    >
      <CardContent className="p-4">
        {/* Template Image */}
        <img 
          src={getImageUrl(template.subcategory)}
          alt={template.name}
          className="w-full h-24 object-cover rounded-lg mb-3"
        />
        
        {/* Template Header */}
        <div className="flex items-center mb-2">
          <i className={cn(template.icon, "text-lg mr-2")} />
          <h3 className="font-semibold text-sm">{template.name}</h3>
        </div>
        
        {/* Description */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {template.description}
        </p>
        
        {/* Stats */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span className="text-muted-foreground">{template.timesSaved}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400" />
              <span className="text-muted-foreground">{template.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <Badge variant="outline" className="text-xs py-0 px-2">
              {template.category}
            </Badge>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{template.userCount.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* Hover Actions */}
        {showActions && (
          <Button 
            size="sm" 
            className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(template);
            }}
          >
            Select Template
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
