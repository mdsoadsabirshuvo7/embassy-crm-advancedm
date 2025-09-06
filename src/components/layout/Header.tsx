import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Search, LogOut, Settings, User, Command } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { SyncStatus } from '@/components/ui/sync-status';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { isSearchOpen, setIsSearchOpen, openSearch } = useGlobalSearch();

  return (
    <>
      <GlobalSearch open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <header className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="outline"
              className="relative max-w-md justify-start text-sm text-muted-foreground bg-background hover:bg-accent"
              onClick={openSearch}
            >
              <Search className="w-4 h-4 mr-2" />
              Search clients, invoices, employees...
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
          </div>

        <div className="flex items-center gap-4">
          <SyncStatus />
          
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-accent">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {user?.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs text-muted-foreground">{user?.role.replace('_', ' ')}</div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover border-border shadow-lg z-50">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="w-4 h-4 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    </>
  );
};