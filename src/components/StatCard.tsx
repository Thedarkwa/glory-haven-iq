import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, className }: StatCardProps) {
  return (
    <div className={`stat-card animate-fade-in ${className || ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 font-medium ${trendUp ? "text-success" : "text-destructive"}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent" />
        </div>
      </div>
    </div>
  );
}
