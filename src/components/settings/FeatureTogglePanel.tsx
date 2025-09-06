import React from 'react';
import { FeatureRegistry, FeatureFlag } from '@/features/FeatureRegistry';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

export const FeatureTogglePanel: React.FC = () => {
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => FeatureRegistry.subscribe(() => force()), []);
  const features = FeatureRegistry.list();
  return (
    <Card className="border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Feature Flags (Experimental)</CardTitle>
        <CardDescription>Enable scaffolded advanced domains (no backend yet).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {features.map(f => {
          const enabled = FeatureRegistry.isEnabled(f.key);
          return (
            <div key={f.key} className="flex items-start justify-between gap-4 p-3 border rounded-md bg-muted/30">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{f.label}</span>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-wide">{f.status}</Badge>
                  {f.dependsOn && f.dependsOn.length > 0 && (
                    <span className="text-[10px] text-muted-foreground">Deps: {f.dependsOn.join(', ')}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground max-w-md leading-snug">{f.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Switch
                  checked={enabled}
                  onCheckedChange={() => FeatureRegistry.toggle(f.key as FeatureFlag)}
                  disabled={f.dependsOn?.some(dep => !FeatureRegistry.isEnabled(dep))}
                />
                {f.dependsOn?.some(dep => !FeatureRegistry.isEnabled(dep)) && (
                  <span className="text-[10px] text-muted-foreground">Enable deps first</span>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default FeatureTogglePanel;
