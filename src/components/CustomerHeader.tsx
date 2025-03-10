
import { FC } from "react";
import { Link } from "react-router-dom";

export const CustomerHeader: FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/customer" className="font-semibold text-xl">
            Invitation Hub
          </Link>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
};
