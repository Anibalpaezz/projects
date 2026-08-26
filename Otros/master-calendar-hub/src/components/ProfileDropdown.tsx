import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  avatar_url: string | null;
  full_name: string | null;
}

export const ProfileDropdown: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);

  React.useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('profiles')
        .select('avatar_url, full_name')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) {
    return (
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/auth')}
        className="shadow-soft hover:shadow-medium transition-all duration-300"
      >
        <User className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    );
  }

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-primary/10 transition-all duration-300">
          <Avatar className="h-8 w-8">
            <AvatarImage src={profile?.avatar_url || ""} />
            <AvatarFallback className="text-xs">
              {getInitials(displayName)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">
            {displayName}
          </span>
        </Button>
      </DropdownMenuTrigger>
        
      <DropdownMenuContent align="end" className="w-48 shadow-strong border-border/40">
        <DropdownMenuItem 
          onClick={() => navigate('/profile/overview')}
          className="flex items-center space-x-2 hover:bg-primary/10 transition-colors"
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate('/profile/preferences')}
          className="flex items-center space-x-2 hover:bg-primary/10 transition-colors"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="flex items-center space-x-2 hover:bg-destructive/10 text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};