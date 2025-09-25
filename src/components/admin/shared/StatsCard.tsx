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
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <IconComponent className="w-6 h-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;