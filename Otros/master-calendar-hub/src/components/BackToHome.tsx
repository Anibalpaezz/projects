import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface BackToHomeProps {
  variant?: 'home' | 'back';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function BackToHome({ 
  variant = 'home', 
  size = 'md', 
  className,
  text 
}: BackToHomeProps) {
  const navigate = useNavigate();
  
  const isBack = variant === 'back';
  const Icon = isBack ? ArrowLeft : Home;
  const defaultText = isBack ? 'Back to Home' : 'Home';
  const buttonText = text || defaultText;
  
  const sizeClasses = {
    sm: 'text-sm px-3 py-2',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3'
  };

  return (
    <Button
      variant="outline"
      onClick={() => navigate('/')}
      className={cn(
        "shadow-soft hover:shadow-medium transition-all duration-300 group",
        sizeClasses[size],
        className
      )}
      aria-label={`Navigate to home page`}
    >
      <Icon className={cn(
        "h-4 w-4 mr-2",
        isBack && "group-hover:-translate-x-1 transition-transform"
      )} />
      {buttonText}
    </Button>
  );
}