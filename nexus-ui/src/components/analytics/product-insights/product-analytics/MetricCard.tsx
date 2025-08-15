import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  iconBgColor?: string;
  valueColor?: string;
  formatValue?: (value: string | number) => string;
  onClick?: () => void;
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon = "📊",
  iconBgColor = "bg-blue-100 dark:bg-blue-900/30",
  valueColor = "text-blue-600",
  formatValue,
  onClick
}: MetricCardProps) {
  const displayValue = formatValue ? formatValue(value) : value;
  const isClickable = !!onClick;

  return (
    <Card className={`group transition-all duration-200 hover:shadow-lg border-0 hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-750 rounded-xl ${isClickable ? 'cursor-pointer' : ''}`}
          onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
              <span className="text-2xl">{icon}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-xl font-semibold text-gray-900 dark:text-white mb-2 transition-colors ${isClickable ? 'group-hover:text-blue-600' : ''}`}>
              {title}
            </h3>
            <div className={`text-3xl font-bold ${valueColor} mb-1`}>
              {displayValue}
            </div>
            {subtitle && (
              <p className="text-gray-600 dark:text-gray-300 font-medium">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}