import { useNavigate } from 'react-router-dom';
import { Database, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <div className="container mx-auto py-16 px-4 max-w-6xl">
                <div className="flex flex-col items-center text-center gap-8">
                    {/* Hero Section */}
                    <div className="space-y-4 max-w-3xl">
                        <h1 className="text-5xl font-bold tracking-tight">
                            Welcome to BlindBench
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            Your platform for managing and benchmarking language models
                        </p>
                    </div>

                    {/* Feature Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full mt-8">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/models')}>
                            <CardHeader>
                                <Database className="h-8 w-8 mb-2 text-primary" />
                                <CardTitle>Language Models</CardTitle>
                                <CardDescription>
                                    Manage your collection of language models with full CRUD operations
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" className="w-full gap-2">
                                    Open Models
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="opacity-60">
                            <CardHeader>
                                <CardTitle>Benchmarks</CardTitle>
                                <CardDescription>
                                    Coming soon: Run and compare model benchmarks
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" disabled className="w-full">
                                    Coming Soon
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="opacity-60">
                            <CardHeader>
                                <CardTitle>Analytics</CardTitle>
                                <CardDescription>
                                    Coming soon: View insights and performance metrics
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button variant="ghost" disabled className="w-full">
                                    Coming Soon
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-4 mt-8">
                        <Button size="lg" onClick={() => navigate('/models')} className="gap-2">
                            Get Started
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

