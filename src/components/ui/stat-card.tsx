import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ElementType;
  positive?: boolean;
  loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon: Icon,
  positive = true,
  loading = false
}) => {
  if (loading) {
    return (
      <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
          <div className="w-4 h-4 bg-muted animate-pulse rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-muted animate-pulse rounded w-16 mb-2"></div>
          <div className="h-3 bg-muted animate-pulse rounded w-20"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm group cursor-pointer">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          {title}
        </CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <div className={`text-xs flex items-center gap-1 font-medium ${
          positive ? 'text-success' : 'text-destructive'
        }`}>
          {positive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {change} from last month
        </div>
      </CardContent>
    </Card>
  );
};