import { ReactNode } from 'react';

export type MetricTrend = 'up' | 'down' | 'neutral';

export interface StatMetric {
  id: string;
  title: string;
  value: string | number;
  previousValue?: string | number;
  changePercent?: number;
  trend?: MetricTrend;
  period?: string;
  supportingText?: string;
  icon?: string;
  sparkline?: number[];
  category?: 'revenue' | 'users' | 'projects' | 'orders' | 'conversion' | 'growth';
  currencyPrefix?: string;
  unit?: string;
}

export type TimeRangeOption = '7D' | '30D' | '90D' | '1Y';

export interface AnalyticsDataPoint {
  date: string;
  label: string;
  revenue: number;
  orders: number;
  growth: number;
  users: number;
}

export interface ActivityItem {
  id: string;
  type: 'user' | 'project' | 'payment' | 'completed' | 'verification' | 'proposal' | 'order';
  title: string;
  description: string;
  entityName?: string;
  entityId?: string;
  timestamp: string;
  relativeTime: string;
  status?: 'completed' | 'in_progress' | 'pending' | 'success' | 'alert';
  avatar?: string;
  userInitials?: string;
  amount?: number;
}

export interface ProgressGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  percentage: number;
  unit?: string;
  category?: 'profile' | 'project' | 'monthly_goal' | 'revenue_goal' | 'verification';
  supportingNote?: string;
  color?: string;
}

export interface QuickActionItem {
  id: string;
  label: string;
  description?: string;
  icon: string;
  action: () => void;
  badge?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'order' | 'security' | 'payment' | 'milestone' | 'system';
  timestamp: string;
  read: boolean;
  priority?: 'normal' | 'high' | 'urgent';
  actionUrl?: string;
}

export interface SystemServiceStatus {
  key: 'api' | 'database' | 'auth' | 'payments' | 'storage' | 'notifications';
  name: string;
  status: 'operational' | 'warning' | 'offline';
  latencyMs?: number;
  uptime?: string;
  lastChecked?: string;
}

export interface ProfileSummaryData {
  name: string;
  username: string;
  email?: string;
  avatar: string;
  role: string;
  isVerified: boolean;
  completionPercentage: number;
  stats: Array<{
    label: string;
    value: string | number;
  }>;
  rating?: number;
  reviewsCount?: number;
}

export interface ProjectOrderItem {
  id: string;
  name: string;
  clientOrFreelancer: string;
  avatar?: string;
  status: 'active' | 'in_progress' | 'completed' | 'in_review' | 'pending';
  amount: number;
  date: string;
  category?: string;
  actionLabel?: string;
}

export interface AIInsightItem {
  id: string;
  type: 'growth' | 'revenue' | 'milestone' | 'warning' | 'recommendation';
  title: string;
  insight: string;
  highlightMetric?: string;
  recommendedAction?: string;
  confidenceScore?: number;
  timestamp?: string;
}
