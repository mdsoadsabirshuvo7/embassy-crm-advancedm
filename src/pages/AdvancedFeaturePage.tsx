import React from 'react';
import { useParams } from 'react-router-dom';
import { FeatureRegistry, FeatureFlag } from '@/features/FeatureRegistry';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const AdvancedFeaturePage: React.FC = () => {
  const { feature } = useParams();
  const meta = FeatureRegistry.get(feature as FeatureFlag);
  if (!meta) return <div className="p-6 text-sm">Unknown feature: {feature}</div>;
  const enabled = FeatureRegistry.isEnabled(meta.key);
  return (
    <div className="p-6 space-y-6">
      <Card className="border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {meta.label}
            <Badge variant="outline" className="uppercase text-[10px] tracking-wide">{meta.status}</Badge>
            {enabled && <Badge className="bg-green-600 text-white">Enabled</Badge>}
          </CardTitle>
          <CardDescription>{meta.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {meta.dependsOn && meta.dependsOn.length > 0 && (
            <div>
              <p className="font-medium mb-1">Dependencies</p>
              <ul className="list-disc pl-5 space-y-0.5">
                {meta.dependsOn.map(d => <li key={d}>{d}</li>)}
              </ul>
            </div>
          )}
          <div className="flex gap-2">
            <Button size="sm" variant={enabled ? 'secondary' : 'default'} onClick={() => FeatureRegistry.toggle(meta.key)}>
              {enabled ? 'Disable' : 'Enable'} Feature
            </Button>
            <Button size="sm" variant="outline" onClick={() => alert('Coming soon: domain UI implementation')}>Open Domain UI</Button>
          </div>
          <p className="text-xs text-muted-foreground">This is a scaffold placeholder. Actual implementation will mount domain-specific components here once backend services exist.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedFeaturePage;
