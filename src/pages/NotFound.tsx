import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      
      <div className="text-center relative z-10">
        <div className="mb-8 flex justify-center">
          <Logo size="xl" showText={true} showTagline={false} variant="full" className="animate-float" />
        </div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-1">
            <div className="flex items-center gap-2">
              <span>🏠</span>
              Return to Home
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
