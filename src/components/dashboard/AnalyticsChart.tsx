import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface AnalyticsChartProps {
  type: 'revenue' | 'clients' | 'tasks' | 'documents';
  title: string;
  description?: string;
  data: any[];
  timeRange?: string;
}

const COLORS = {
  primary: 'hsl(var(--primary))',
  success: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  destructive: 'hsl(var(--destructive))',
  muted: 'hsl(var(--muted-foreground))',
};

const PIE_COLORS = [
  COLORS.primary,
  COLORS.success,
  COLORS.warning,
  COLORS.destructive,
  COLORS.muted,
];

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  type,
  title,
  description,
  data,
  timeRange = '7 days'
}) => {
  const renderChart = () => {
    switch (type) {
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={COLORS.primary}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'clients':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="active" fill={COLORS.success} name="Active" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill={COLORS.warning} name="Pending" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inactive" fill={COLORS.muted} name="Inactive" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'tasks':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'documents':
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="documentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.success} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={COLORS.success} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => [value, 'Documents']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={COLORS.success}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#documentsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-0 bg-card/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            {timeRange}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {renderChart()}
      </CardContent>
    </Card>
  );
};