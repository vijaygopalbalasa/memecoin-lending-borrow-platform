// components/StatCard.tsx
import type { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';

interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: LucideIcon;
}

export const StatCard = ({ title, value, subtitle, icon: Icon }: StatCardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <Icon className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-gray-500">{subtitle}</p>
        </CardContent>
    </Card>
);