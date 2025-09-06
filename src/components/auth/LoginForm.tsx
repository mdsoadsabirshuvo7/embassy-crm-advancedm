import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      toast({
        title: "Login successful",
        description: "Welcome back to Embassy CRM",
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive"
      });
    }
  };

  const demoAccounts = [
    { email: 'superadmin@demo.com', role: 'Super Admin', name: 'Sarah Wilson' },
    { email: 'admin@demo.com', role: 'Admin', name: 'Michael Chen' },
    { email: 'accountant@demo.com', role: 'Accountant', name: 'Emily Rodriguez' },
    { email: 'hr@demo.com', role: 'HR Manager', name: 'David Kim' },
    { email: 'employee@demo.com', role: 'Employee', name: 'Jessica Thompson' }
  ];

  const handleDemoLogin = (email: string) => {
    setEmail(email);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Embassy CRM</h1>
          <p className="text-muted-foreground">Enterprise Management System</p>
        </div>

        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="space-y-3">
                <p className="text-sm font-medium text-center">Demo Accounts</p>
                <p className="text-xs text-muted-foreground text-center">
                  Click any role below to auto-fill credentials (Password: demo123)
                </p>
                <div className="grid gap-2">
                  {demoAccounts.map((account) => (
                    <Button
                      key={account.email}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => handleDemoLogin(account.email)}
                      type="button"
                    >
                      <div className="flex flex-col items-start w-full">
                        <span className="font-medium">{account.name}</span>
                        <span className="text-muted-foreground">{account.role}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};