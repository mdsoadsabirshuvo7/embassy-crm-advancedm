import React from 'react';
import { FeatureRegistry } from '@/features/FeatureRegistry';
import FeatureTogglePanel from './FeatureTogglePanel';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const statusColor: Record<string,string> = {
  planned: 'bg-secondary text-secondary-foreground',
  'in-progress': 'bg-blue-500 text-white',
  experimental: 'bg-amber-500 text-white',
  released: 'bg-green-600 text-white'
};

export const AdvancedRoadmapPanel: React.FC = () => {
  const features = FeatureRegistry.list();
  return (
  <Card className="border-0 bg-card/80 backdrop-blur-sm space-y-6">
      <CardHeader>
        <CardTitle>Advanced / Premium Roadmap</CardTitle>
        <CardDescription>Pluggable enterprise capabilities (not yet active).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          {features.map(f => (
            <button
              key={f.key}
              type="button"
              onClick={() => { window.location.href = `/advanced/${f.key}`; }}
              className="text-left p-3 rounded-md border border-border/60 bg-muted/30 space-y-1 hover:border-primary/60 hover:bg-accent/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm">{f.label}</span>
                <Badge className={statusColor[f.status] || 'bg-secondary'}>{f.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-snug">{f.description}</p>
              {f.dependsOn && f.dependsOn.length > 0 && (
                <p className="text-[10px] text-muted-foreground">Depends on: {f.dependsOn.join(', ')}</p>
              )}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">These flags are placeholders; enabling will require backend services in future iterations.</p>
        <div className="pt-2">
          <FeatureTogglePanel />
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedRoadmapPanel;
