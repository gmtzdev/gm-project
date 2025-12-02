export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  location?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date | string;
  lastLogin: Date | string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
}

export interface UserStats {
  totalActivities: number;
  tasksCompleted: number;
  paymentsCompleted: number;
  goalsAchieved: number;
  activityByDay?: ActivityByDay[];
  monthlyProgress?: MonthlyProgress;
}

export interface ActivityByDay {
  day: string;
  count: number;
}

export interface MonthlyProgress {
  current: number;
  target: number;
  percentage: number;
}

export interface UserActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date | string;
  metadata?: Record<string, any>;
}

export type ActivityType =
  | 'task_completed'
  | 'task_created'
  | 'payment_made'
  | 'debt_paid'
  | 'goal_achieved'
  | 'login'
  | 'profile_updated'
  | 'category_created'
  | 'subscription_added'
  | 'income_registered';

export interface QuickAction {
  icon: string;
  label: string;
  action: () => void;
  color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
  tooltip?: string;
}

export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
}

export interface AvatarUploadResponse {
  avatarUrl: string;
  message: string;
}

export interface UserDataExport {
  profile: UserProfile;
  stats: UserStats;
  activities: UserActivity[];
  exportDate: Date | string;
}
