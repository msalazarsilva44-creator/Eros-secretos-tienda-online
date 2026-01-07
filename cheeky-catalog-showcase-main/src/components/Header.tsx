import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { fetchApi } from "@/lib/api";
import { useEffect, useState } from "react";

const Header = () => {
  const { isLoggedIn, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoggedIn) {
        try {
          const userData = await fetchApi('/api/auth/profile');
          setIsAdmin((userData as any)?.role === 'admin');
        } catch (error) {
          setIsAdmin(false);
        }
      }
    };
    checkAuth();
  }, [isLoggedIn]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-black">
            Eros Secretos
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/">Inicio</Link>
          </Button>
          {isAdmin && (
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          )}
          {!isLoggedIn && (
            <Button variant="default" size="sm" asChild>
              <Link to="/login">Admin</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

