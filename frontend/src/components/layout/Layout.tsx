import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Database, Home } from 'lucide-react';
import { Button } from '../ui/button';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header Navigation */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex">
                        <button
                            onClick={() => navigate('/')}
                            className="mr-6 flex items-center space-x-2 font-semibold"
                        >
                            <span className="text-lg">BlindBench</span>
                        </button>
                    </div>
                    <nav className="flex items-center space-x-1 text-sm font-medium">
                        <Button
                            variant={isActive('/') && !isActive('/models') ? 'secondary' : 'ghost'}
                            size="sm"
                            className="gap-2"
                            onClick={() => navigate('/')}
                        >
                            <Home className="h-4 w-4" />
                            Home
                        </Button>
                        <Button
                            variant={isActive('/models') ? 'secondary' : 'ghost'}
                            size="sm"
                            className="gap-2"
                            onClick={() => navigate('/models')}
                        >
                            <Database className="h-4 w-4" />
                            Models
                        </Button>
                        {/* Future navigation items can be added here:
            <Button
              variant={isActive('/benchmarks') ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2"
              onClick={() => navigate('/benchmarks')}
            >
              <BarChart className="h-4 w-4" />
              Benchmarks
            </Button>
            */}
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}

