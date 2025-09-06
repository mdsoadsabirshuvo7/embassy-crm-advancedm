import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  UserCheck, 
  FileText, 
  CheckSquare, 
  BarChart3, 
  Receipt, 
  CreditCard,
  Settings
} from 'lucide-react';
import { useModules } from '../../contexts/ModuleContext';
import type { ModuleConfig } from '../../contexts/ModuleContext';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../contexts/I18nContext';

const iconMap = {
  LayoutDashboard,
  Users,
  Calculator,
  UserCheck,
  FileText,
  CheckSquare,
  BarChart3,
  Receipt,
  CreditCard,
  Settings
};

const ModuleManagement: React.FC = () => {
  const { modules, toggleModule, getModulesByCategory } = useModules();
  const { user } = useAuth();
  const { t } = useI18n();

  const hasPermission = (requiredRoles?: string[]) => {
    if (!user || !requiredRoles) return true;
    return requiredRoles.includes(user.role);
  };

  // Reuse existing ModuleConfig type from context instead of redefining a UI copy
  const renderModuleCard = (module: ModuleConfig) => {
    const IconComponent = iconMap[module.icon as keyof typeof iconMap] || Settings;
    const canToggle = hasPermission(module.requiredRole);
    
    return (
      <Card key={module.id} className="border-0 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                module.enabled ? 'bg-primary/10' : 'bg-muted'
              }`}>
                <IconComponent className={`w-5 h-5 ${
                  module.enabled ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">{module.name}</h4>
                  <Badge 
                    variant={module.category === 'core' ? 'default' : 
                            module.category === 'business' ? 'secondary' : 'outline'}
                  >
                    {module.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{module.description}</p>
                
                {module.requiredRole && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-muted-foreground">Required roles:</span>
                    {module.requiredRole.map((role: string) => (
                      <Badge key={role} variant="outline" className="text-xs">
                        {role.replace('_', ' ')}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={module.enabled}
                onCheckedChange={() => canToggle && toggleModule(module.id)}
                disabled={!canToggle}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">{t('modules.title')}</h2>
        <p className="text-muted-foreground">
          {t('modules.description')}
        </p>
      </div>

      {/* Core Modules */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{t('modules.core')}</h3>
          <Badge variant="default">Essential</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getModulesByCategory('core').map(renderModuleCard)}
        </div>
      </div>

      <Separator />

      {/* Business Modules */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{t('modules.business')}</h3>
          <Badge variant="secondary">Professional</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getModulesByCategory('business').map(renderModuleCard)}
        </div>
      </div>

      <Separator />

      {/* Advanced Modules */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">{t('modules.advanced')}</h3>
          <Badge variant="outline">Enterprise</Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {getModulesByCategory('advanced').map(renderModuleCard)}
        </div>
      </div>

      {/* Module Statistics */}
      <Card className="border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Module Statistics</CardTitle>
          <CardDescription>Overview of enabled modules</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {modules.filter(m => m.enabled).length}
              </div>
              <div className="text-sm text-muted-foreground">Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">
                {modules.filter(m => !m.enabled).length}
              </div>
              <div className="text-sm text-muted-foreground">Disabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">
                {modules.length}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModuleManagement;