import React from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as HeroIconsSolid from '@heroicons/react/24/solid';

export interface AppIconProps {
    name: string;
    size?: number;
    className?: string;
    variant?: 'outline' | 'solid';
}

export default function AppIcon({
    name,
    size = 24,
    className = '',
    variant = 'outline'
}: AppIconProps) {
    const IconLibrary = variant === 'solid' ? HeroIconsSolid : HeroIcons;
    const Icon = (IconLibrary as any)[name] || HeroIcons.QuestionMarkCircleIcon;

    return <Icon className={className} width={size} height={size} />;
}
