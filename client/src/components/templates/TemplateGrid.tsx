import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Filter, 
  Building2, 
  Home, 
  Grid3X3, 
  List,
  TrendingUp,
  Star
} from "lucide-react";
import { TemplateCard } from "./TemplateCard";
import { Template } from "@/types/chat";
import { aiService } from "@/lib/aiService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TemplateGridProps {
  onTemplateSelect: (template: Template) => void;
  selectedCategory?: "business" | "personal" | "all";
  variant?: "grid" | "list";
  showFilters?: boolean;
  className?: string;
}

export function TemplateGrid({ 
  onTemplateSelect, 
  selectedCategory = "all",
  variant = "grid",
  showFilters = true,
  className 
}: TemplateGridProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>(selectedCategory);
  const [viewMode, setViewMode] = useState<"grid" | "list">(variant);
  const [sortBy, setSortBy] = useState<"popular" | "rating" | "name">("popular");

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const data = activeCategory === "all" 
          ? await aiService.getTemplates() 
          : await aiService.getTemplates(activeCategory);
        setTemplates(data);
      } catch (error) {
        console.error("Failed to load templates:", error);
        toast({
          title: "Loading Error",
          description: "Failed to load templates. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadTemplates();
  }, [activeCategory, toast]);

  const filteredTemplates = templates
    .filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.userCount - a.userCount;
        case "rating":
          return b.rating - a.rating;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const businessTemplates = filteredTemplates.filter(t => t.category === "business");
  const personalTemplates = filteredTemplates.filter(t => t.category === "personal");

  const getTemplateStats = () => {
    return {
      total: templates.length,
      business: templates.filter(t => t.category === "business").length,
      personal: templates.filter(t => t.category === "personal").length,
      avgRating: templates.length > 0 ? 
        (templates.reduce((sum, t) => sum + t.rating, 0) / templates.length).toFixed(1) : "0",
    };
  };

  const stats = getTemplateStats();

  if (loading) {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading templates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-100">Automation Templates</h2>
          <p className="text-gray-400">
            {stats.total} templates • {stats.avgRating}★ average rating
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-blue-400 border-blue-400/30">
            <Building2 className="w-3 h-3 mr-1" />
            {stats.business} Business
          </Badge>
          <Badge variant="outline" className="text-green-400 border-green-400/30">
            <Home className="w-3 h-3 mr-1" />
            {stats.personal} Personal
          </Badge>
        </div>
      </div>

      {/* Filters and controls */}
      {showFilters && (
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-gray-900/50 border-gray-700/50"
                  />
                </div>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Sort:</span>
                <Button
                  variant={sortBy === "popular" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy("popular")}
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Popular
                </Button>
                <Button
                  variant={sortBy === "rating" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy("rating")}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Rating
                </Button>
                <Button
                  variant={sortBy === "name" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy("name")}
                >
                  Name
                </Button>
              </div>

              {/* View mode */}
              <div className="flex items-center space-x-1 border border-gray-700/50 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="h-8 w-8 p-0"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="h-8 w-8 p-0"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Templates */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="business">
            <Building2 className="w-4 h-4 mr-2" />
            Business
          </TabsTrigger>
          <TabsTrigger value="personal">
            <Home className="w-4 h-4 mr-2" />
            Personal
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {businessTemplates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-400" />
                Business Templates
              </h3>
              <div className={cn(
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {businessTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={onTemplateSelect}
                    variant={viewMode}
                  />
                ))}
              </div>
            </div>
          )}

          {personalTemplates.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                <Home className="w-5 h-5 mr-2 text-green-400" />
                Personal Templates
              </h3>
              <div className={cn(
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {personalTemplates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onSelect={onTemplateSelect}
                    variant={viewMode}
                  />
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="business">
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          )}>
            {businessTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onTemplateSelect}
                variant={viewMode}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="personal">
          <div className={cn(
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-3"
          )}>
            {personalTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onTemplateSelect}
                variant={viewMode}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Empty state */}
      {filteredTemplates.length === 0 && !loading && (
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardContent className="py-12">
            <div className="text-center">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-300 mb-2">
                No templates found
              </h3>
              <p className="text-gray-400 mb-4">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setActiveCategory("all");
              }}>
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
