import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Bell, Search, LogOut, Settings, User, Command } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { ChevronsUpDown, Building2 } from 'lucide-react';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { SyncStatus } from '@/components/ui/sync-status';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { organization, organizations, switchOrg, currentOrgId } = useTenant();
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
          {/* Tenant Switcher */}
          {organizations.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2 max-w-[200px] truncate">
                  <Building2 className="w-4 h-4" />
                  <span className="truncate text-sm">{organization?.name || 'Select Org'}</span>
                  <ChevronsUpDown className="w-3 h-3 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 max-h-72 overflow-auto">
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {organizations.map(o => (
                  <DropdownMenuItem 
                    key={o.id} 
                    onClick={() => switchOrg(o.id)}
                    className={o.id === currentOrgId ? 'font-semibold' : ''}
                  >
                    {o.name}
                    {o.id === currentOrgId && <span className="ml-auto text-xs text-primary">Active</span>}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
                  <div className="text-xs text-muted-foreground">{user?.role.replace('_', ' ')}{organization ? ` • ${organization.subdomain}` : ''}</div>
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