// React
import React from 'react';

// Third-party
import { 
  BarChart3, 
  FileText, 
  Settings, 
  Users, 
  Code2, 
  Trophy, 
  Target, 
  Briefcase, 
  Zap, 
  Calendar, 
  Clock, 
  Star, 
  Award, 
  TrendingUp, 
  Globe, 
  Home, 
  Eye, 
  Edit 
} from 'lucide-react';

// Local components
import Card from '../../ui/Card';

// Icon mapping for dynamic icons
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  BarChart3,
  FileText,
  Settings,
  Users,
  Code2,
  Trophy,
  Target,
  Briefcase,
  Zap,
  Calendar,
  Clock,
  Star,
  Award,
  TrendingUp,
  Globe,
  Home,
  Eye,
  Edit,
};

interface StatsCardProps {
  icon: string | React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  label,
  value,
  className = '',
}) => {
  const IconComponent = typeof icon === 'string' ? iconMap[icon] || Code2 : icon;

  return (
    <Card className={`p-4 sm:p-6 ${className}`}>
      <div className="flex items-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
        </div>
        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{label}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;