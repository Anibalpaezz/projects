import { useState, useEffect } from "react";
import { Navigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Upload, 
  Camera, 
  ArrowLeft,
  Shield,
  Bell,
  Palette,
  Globe,
  CreditCard,
  Download,
  Settings,
  Smartphone,
  Eye,
  EyeOff,
  Key,
  Monitor,
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Mail,
  Share2,
  Users,
  Link2,
  Webhook,
  Calendar,
  FileText,
  Database,
  ExternalLink,
  Plus,
  Copy,
  Pencil,
  BarChart3,
  Clock,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSettings } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string;
}

interface SecurityEvent {
  id: string;
  type: 'login' | 'password_change' | '2fa_enabled' | '2fa_disabled' | 'email_change';
  timestamp: Date;
  details: string;
  ip?: string;
  device?: string;
}

interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActivity: Date;
  current: boolean;
}

interface CalendarInfo {
  id: string;
  name: string;
  color: string;
  shared: boolean;
  shareUrl?: string;
  permissions: 'owner' | 'editor' | 'viewer';
}

interface ConnectedApp {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  lastSync?: Date;
  icon: string;
}

interface BillingInfo {
  plan: 'free' | 'pro';
  status: 'active' | 'cancelled' | 'past_due';
  nextBilling?: Date;
  amount?: number;
}

const ProfileSettings = () => {
  const { user, loading } = useAuth();
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  
  // Security-related state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [recoveryCodesVisible, setRecoveryCodesVisible] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  
  // Additional state for other sections
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reminders: true,
    weeklyDigest: false,
    eventUpdates: true
  });
  const [calendarsData, setCalendarsData] = useState<CalendarInfo[]>([]);
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({ plan: 'free', status: 'active' });
  const [webhookUrl, setWebhookUrl] = useState('');

  // Get active section from URL
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 2 && pathParts[1] === 'profile') {
      setActiveSection(pathParts[2] || 'overview');
    } else if (location.pathname === '/profile') {
      // Handle base /profile route - default to overview
      setActiveSection('overview');
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadSecurityData();
      loadAdditionalData();
    }
  }, [user]);

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(newPassword));
  }, [newPassword]);

  // Redirect to auth if not authenticated - AFTER all hooks are called
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: t('common.error'),
        description: "Failed to load profile",
        variant: "destructive"
      });
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user!.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', user!.id);

      if (updateError) {
        throw updateError;
      }

      setProfile(prev => prev ? { ...prev, avatar_url: data.publicUrl } : null);

      toast({
        title: t('common.success'),
        description: "Avatar updated successfully"
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: t('common.error'),
        description: error.message || "Failed to upload avatar",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Mock recovery codes
  const recoveryCodes = [
    '8a9b-c0d1-e2f3-g4h5',
    'i6j7-k8l9-m0n1-o2p3',
    'q4r5-s6t7-u8v9-w0x1',
    'y2z3-a4b5-c6d7-e8f9',
    'g0h1-i2j3-k4l5-m6n7',
    'o8p9-q0r1-s2t3-u4v5',
    'w6x7-y8z9-a0b1-c2d3',
    'e4f5-g6h7-i8j9-k0l1'
  ];

  const loadSecurityData = async () => {
    // Mock data - replace with actual API calls
    setSecurityEvents([
      {
        id: '1',
        type: 'login',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        details: 'Successful login from Chrome on Windows',
        ip: '192.168.1.1',
        device: 'Desktop - Chrome'
      },
      {
        id: '2',
        type: 'password_change',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        details: 'Password changed',
        ip: '192.168.1.1',
        device: 'Desktop - Chrome'
      }
    ]);

    setActiveSessions([
      {
        id: '1',
        device: 'Desktop',
        browser: 'Chrome 120.0',
        ip: '192.168.1.1',
        location: 'Madrid, Spain',
        lastActivity: new Date(),
        current: true
      },
      {
        id: '2',
        device: 'Mobile',
        browser: 'Safari 17.0',
        ip: '192.168.1.50',
        location: 'Madrid, Spain',
        lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
        current: false
      }
    ]);
  };

  const loadAdditionalData = async () => {
    // Load calendars data
    setCalendarsData([
      {
        id: '1',
        name: 'Personal',
        color: '#3B82F6',
        shared: false,
        permissions: 'owner'
      },
      {
        id: '2',
        name: 'Work',
        color: '#EF4444',
        shared: true,
        shareUrl: 'https://calendar.app/shared/work-abc123',
        permissions: 'owner'
      },
      {
        id: '3',
        name: 'Family',
        color: '#22C55E',
        shared: true,
        shareUrl: 'https://calendar.app/shared/family-def456',
        permissions: 'editor'
      }
    ]);

    // Load connected apps
    setConnectedApps([
      {
        id: 'google',
        name: 'Google Calendar',
        description: 'Sync with your Google Calendar',
        connected: true,
        lastSync: new Date(Date.now() - 1000 * 60 * 30),
        icon: '📅'
      },
      {
        id: 'outlook',
        name: 'Microsoft Outlook',
        description: 'Sync with Outlook calendar',
        connected: false,
        icon: '📧'
      },
      {
        id: 'zapier',
        name: 'Zapier',
        description: 'Automate workflows with Zapier',
        connected: false,
        icon: '⚡'
      },
      {
        id: 'slack',
        name: 'Slack',
        description: 'Get calendar notifications in Slack',
        connected: false,
        icon: '💬'
      }
    ]);
  };

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 12.5;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 12.5;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive'
      });
      return;
    }

    if (passwordStrength < 75) {
      toast({
        title: 'Error',
        description: 'Password is too weak. Please use a stronger password.',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      // Mock password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'Password changed successfully'
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to change password',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleEnable2FA = async () => {
    setSaving(true);
    try {
      // Mock 2FA setup
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==');
      
      toast({
        title: 'Success',
        description: '2FA setup initiated. Scan the QR code with your authenticator app.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to enable 2FA',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({
        title: 'Error',
        description: 'Please enter a valid 6-digit code',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      // Mock verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIs2FAEnabled(true);
      setQrCode('');
      setVerificationCode('');
      
      toast({
        title: 'Success',
        description: '2FA enabled successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid verification code',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDisable2FA = async () => {
    setSaving(true);
    try {
      // Mock disable 2FA
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIs2FAEnabled(false);
      
      toast({
        title: 'Success',
        description: '2FA disabled successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to disable 2FA',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      
      toast({
        title: 'Success',
        description: 'Session revoked successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to revoke session',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOutAll = async () => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: 'Signed out from all devices'
      });
      
      // Keep only current session
      setActiveSessions(prev => prev.filter(session => session.current));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out from all devices',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const downloadRecoveryCodes = () => {
    const content = recoveryCodes.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPasswordStrengthColor = (strength: number): string => {
    if (strength < 25) return 'bg-destructive';
    if (strength < 50) return 'bg-orange-500';
    if (strength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = (strength: number): string => {
    if (strength < 25) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleShareCalendar = async (calendarId: string) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const shareUrl = `https://calendar.app/shared/${calendarId}-${Math.random().toString(36).substr(2, 9)}`;
      
      setCalendarsData(prev => prev.map(cal => 
        cal.id === calendarId 
          ? { ...cal, shared: true, shareUrl }
          : cal
      ));
      
      toast({
        title: 'Success',
        description: 'Calendar shared successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share calendar',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleConnectApp = async (appId: string) => {
    setSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConnectedApps(prev => prev.map(app => 
        app.id === appId 
          ? { ...app, connected: true, lastSync: new Date() }
          : app
      ));
      
      toast({
        title: 'Success',
        description: 'App connected successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect app',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTriggerWebhook = async () => {
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your webhook URL",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          triggered_from: window.location.origin,
        }),
      });

      toast({
        title: "Webhook Triggered",
        description: "The webhook was sent successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to trigger webhook",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    setSaving(true);
    try {
      // Mock export - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const exportData = {
        calendars: calendarsData,
        events: [], // Would include actual events
        settings: settings,
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'calendar-export.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'Your data has been exported successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export data',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    // In real app, this would require additional confirmation
    toast({
      title: 'Account Deletion',
      description: 'Please contact support to delete your account',
      variant: 'destructive'
    });
  };

  const handleSaveProfile = async () => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: profile.full_name,
          timezone: profile.timezone,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully'
      });
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save profile',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const sidebarSections = [
    {
      id: 'overview',
      name: 'Account Overview',
      icon: User,
      description: 'Basic account information'
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Password and authentication'
    },
    {
      id: 'preferences',
      name: 'Preferences',
      icon: Settings,
      description: 'Theme, language, and display'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Email and push notifications'
    },
    {
      id: 'calendars',
      name: 'Calendars & Sharing',
      icon: Palette,
      description: 'Calendar management and sharing'
    },
    {
      id: 'billing',
      name: 'Billing',
      icon: CreditCard,
      description: 'Subscription and payments'
    },
    {
      id: 'data',
      name: 'Data & Privacy',
      icon: Download,
      description: 'Import, export, and backups'
    },
    {
      id: 'integrations',
      name: 'Connected Apps',
      icon: Smartphone,
      description: 'Third-party integrations'
    }
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <span>Account Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback className="text-lg">
                      {profile?.full_name ? getInitials(profile.full_name) : 
                       user?.email ? getInitials(user.email) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <Label
                    htmlFor="avatar-upload"
                    className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                    <Input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={uploadAvatar}
                      disabled={uploading}
                      className="hidden"
                    />
                  </Label>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {profile?.full_name || "No name set"}
                  </h3>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Badge variant="outline" className="mt-2">Free Plan</Badge>
                  {uploading && (
                    <p className="text-sm text-primary flex items-center mt-2">
                      <Upload className="h-4 w-4 mr-1 animate-pulse" />
                      Uploading...
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Profile Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profile?.full_name || ""}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, full_name: e.target.value } : null)}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed from here
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select 
                    value={profile?.timezone || "Europe/Madrid"}
                    onValueChange={(value) => setProfile(prev => prev ? { ...prev, timezone: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Madrid">Europe/Madrid</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                      <SelectItem value="America/Los_Angeles">America/Los_Angeles</SelectItem>
                      <SelectItem value="Europe/London">Europe/London</SelectItem>
                      <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                      <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/40">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <Tabs defaultValue="password" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="2fa">Two-Factor Auth</TabsTrigger>
                <TabsTrigger value="sessions">Sessions</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              {/* Password Change */}
              <TabsContent value="password">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Key className="h-5 w-5 mr-2" />
                      Change Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {newPassword && (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Password Strength</span>
                            <span className={passwordStrength >= 75 ? 'text-green-600' : 'text-orange-600'}>
                              {getPasswordStrengthText(passwordStrength)}
                            </span>
                          </div>
                          <Progress value={passwordStrength} className="h-2" />
                        </div>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>

                    <Button 
                      onClick={handlePasswordChange}
                      disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                      className="w-full"
                    >
                      {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                      Change Password
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Two-Factor Authentication */}
              <TabsContent value="2fa">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Smartphone className="h-5 w-5 mr-2" />
                      Two-Factor Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Status</p>
                        <p className="text-sm text-muted-foreground">
                          {is2FAEnabled ? 'Two-factor authentication is enabled' : 'Two-factor authentication is disabled'}
                        </p>
                      </div>
                      <Badge variant={is2FAEnabled ? 'default' : 'secondary'}>
                        {is2FAEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>

                    {!is2FAEnabled && !qrCode && (
                      <Button onClick={handleEnable2FA} disabled={saving}>
                        {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                        Enable 2FA
                      </Button>
                    )}

                    {qrCode && (
                      <div className="space-y-4">
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                          </AlertDescription>
                        </Alert>
                        
                        <div className="flex justify-center">
                          <img src={qrCode} alt="2FA QR Code" className="border rounded" />
                        </div>
                        
                        <div>
                          <Label htmlFor="verification-code">Enter verification code</Label>
                          <Input
                            id="verification-code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="000000"
                            maxLength={6}
                          />
                        </div>
                        
                        <Button onClick={handleVerify2FA} disabled={saving || verificationCode.length !== 6}>
                          {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                          Verify & Enable
                        </Button>
                      </div>
                    )}

                    {is2FAEnabled && (
                      <div className="space-y-4">
                        <Alert>
                          <CheckCircle className="h-4 w-4" />
                          <AlertDescription>
                            Two-factor authentication is active and protecting your account.
                          </AlertDescription>
                        </Alert>

                        <div className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium">Recovery Codes</h4>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setRecoveryCodesVisible(!recoveryCodesVisible)}
                              >
                                {recoveryCodesVisible ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                {recoveryCodesVisible ? 'Hide' : 'Show'}
                              </Button>
                              <Button variant="outline" size="sm" onClick={downloadRecoveryCodes}>
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                          
                          {recoveryCodesVisible && (
                            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                              {recoveryCodes.map((code, index) => (
                                <div key={index} className="bg-muted p-2 rounded">
                                  {code}
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <p className="text-sm text-muted-foreground mt-2">
                            Save these codes in a secure location. They can be used to access your account if you lose your authenticator device.
                          </p>
                        </div>

                        <Button variant="destructive" onClick={handleDisable2FA} disabled={saving}>
                          {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                          Disable 2FA
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Active Sessions */}
              <TabsContent value="sessions">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Monitor className="h-5 w-5 mr-2" />
                      Active Sessions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-end">
                      <Button variant="outline" onClick={handleSignOutAll} disabled={saving}>
                        {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                        Sign Out All Devices
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {activeSessions.map((session) => (
                        <div key={session.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Monitor className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium">{session.device} - {session.browser}</span>
                                  {session.current && (
                                    <Badge variant="secondary" className="text-xs">Current</Badge>
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {session.location} • {session.ip}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Last active: {session.lastActivity.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            
                            {!session.current && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRevokeSession(session.id)}
                                disabled={saving}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Revoke
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Activity */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Security Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {securityEvents.map((event) => (
                        <div key={event.id} className="border rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            {event.type === 'login' && <Shield className="h-5 w-5 text-green-600 mt-0.5" />}
                            {event.type === 'password_change' && <Key className="h-5 w-5 text-blue-600 mt-0.5" />}
                            {event.type === '2fa_enabled' && <Smartphone className="h-5 w-5 text-green-600 mt-0.5" />}
                            {event.type === '2fa_disabled' && <Smartphone className="h-5 w-5 text-orange-600 mt-0.5" />}
                            {event.type === 'email_change' && <Mail className="h-5 w-5 text-blue-600 mt-0.5" />}
                            
                            <div className="flex-1">
                              <div className="font-medium">{event.details}</div>
                              <div className="text-sm text-muted-foreground">
                                {event.timestamp.toLocaleString()}
                                {event.ip && ` • ${event.ip}`}
                                {event.device && ` • ${event.device}`}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch 
                    checked={notifications.email}
                    onCheckedChange={() => handleToggleNotification('email')}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch 
                    checked={notifications.push}
                    onCheckedChange={() => handleToggleNotification('push')}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Event Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded about upcoming events</p>
                  </div>
                  <Switch 
                    checked={notifications.reminders}
                    onCheckedChange={() => handleToggleNotification('reminders')}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Weekly Digest</Label>
                    <p className="text-sm text-muted-foreground">Weekly summary of your calendar</p>
                  </div>
                  <Switch 
                    checked={notifications.weeklyDigest}
                    onCheckedChange={() => handleToggleNotification('weeklyDigest')}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Event Updates</Label>
                    <p className="text-sm text-muted-foreground">Notifications when events are modified</p>
                  </div>
                  <Switch 
                    checked={notifications.eventUpdates}
                    onCheckedChange={() => handleToggleNotification('eventUpdates')}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/40">
                <Button className="bg-gradient-primary hover:opacity-90">
                  Save Notification Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'calendars':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Calendars & Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {calendarsData.map((calendar) => (
                  <div key={calendar.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: calendar.color }}
                        />
                        <div>
                          <h4 className="font-medium">{calendar.name}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {calendar.permissions}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        {calendar.permissions === 'owner' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleShareCalendar(calendar.id)}
                            disabled={saving}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            {calendar.shared ? 'Shared' : 'Share'}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {calendar.shared && calendar.shareUrl && (
                      <div className="bg-secondary/30 rounded p-3 mt-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">Share URL</p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {calendar.shareUrl}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigator.clipboard.writeText(calendar.shareUrl!)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-border/40">
                <Button className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'billing':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold capitalize">{billingInfo.plan} Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      {billingInfo.plan === 'free' ? 'Free forever' : `$9.99/month`}
                    </p>
                  </div>
                  <Badge variant={billingInfo.status === 'active' ? 'default' : 'destructive'}>
                    {billingInfo.status}
                  </Badge>
                </div>
                
                {billingInfo.plan === 'free' ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      You're currently on the free plan. Upgrade to Pro for advanced features.
                    </p>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <Zap className="h-4 w-4 mr-2" />
                      Upgrade to Pro
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Next billing date: {billingInfo.nextBilling?.toLocaleDateString()}
                    </p>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        View Invoices
                      </Button>
                      <Button variant="outline">
                        Update Payment Method
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium mb-3">Usage This Month</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Events Created</span>
                    <span>24 / Unlimited</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Calendars</span>
                    <span>3 / Unlimited</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Storage Used</span>
                    <span>1.2 MB / 1 GB</span>
                  </div>
                </div>
              </div>

              {billingInfo.plan === 'pro' && (
                <div className="pt-4 border-t border-border/40">
                  <Button variant="outline" className="text-destructive hover:text-destructive">
                    Cancel Subscription
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );

      case 'data':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Data & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Export Your Data</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download all your calendar data, including events, settings, and preferences.
                  </p>
                  <Button 
                    onClick={handleExportData}
                    disabled={saving}
                    variant="outline"
                  >
                    {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Import Data</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Import calendar data from other applications (Google Calendar, Outlook, etc.).
                  </p>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Calendar Data
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Data Usage</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Events</span>
                      <span>127</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Storage Used</span>
                      <span>1.2 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Created</span>
                      <span>January 2024</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium text-destructive">Danger Zone</h4>
                <div className="border border-destructive/20 rounded-lg p-4">
                  <h5 className="font-medium mb-2">Delete Account</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'integrations':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Connected Apps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {connectedApps.map((app) => (
                  <div key={app.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{app.icon}</div>
                        <div>
                          <h4 className="font-medium">{app.name}</h4>
                          <p className="text-sm text-muted-foreground">{app.description}</p>
                          {app.connected && app.lastSync && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Last sync: {app.lastSync.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={app.connected ? 'default' : 'secondary'}>
                          {app.connected ? 'Connected' : 'Not Connected'}
                        </Badge>
                        <Button
                          variant={app.connected ? 'outline' : 'default'}
                          size="sm"
                          onClick={() => handleConnectApp(app.id)}
                          disabled={saving}
                        >
                          {app.connected ? 'Disconnect' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Webhook Integration</h4>
                <div className="border rounded-lg p-4">
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input
                        id="webhook-url"
                        value={webhookUrl}
                        onChange={(e) => setWebhookUrl(e.target.value)}
                        placeholder="https://hooks.zapier.com/hooks/catch/..."
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Add your Zapier webhook URL to trigger automations
                      </p>
                    </div>
                    <Button 
                      onClick={handleTriggerWebhook}
                      disabled={saving || !webhookUrl}
                      variant="outline"
                    >
                      {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
                      <Webhook className="h-4 w-4 mr-2" />
                      Test Webhook
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">API Access</h4>
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Generate API keys to access your calendar data programmatically.
                  </p>
                  <Button variant="outline">
                    <Key className="h-4 w-4 mr-2" />
                    Generate API Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 'preferences':
        return (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-primary" />
                <span>Preferences</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Theme</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <Select value={settings.theme} onValueChange={(value: any) => updateSettings({ theme: value })}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">{t('settings.system')}</SelectItem>
                      <SelectItem value="light">{t('settings.light')}</SelectItem>
                      <SelectItem value="dark">{t('settings.dark')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Language</Label>
                    <p className="text-sm text-muted-foreground">Select your preferred language</p>
                  </div>
                  <Select value={i18n.language} onValueChange={(value) => i18n.changeLanguage(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Time Format</Label>
                    <p className="text-sm text-muted-foreground">Choose between 12-hour and 24-hour format</p>
                  </div>
                  <Select value={settings.timeFormat} onValueChange={(value: any) => updateSettings({ timeFormat: value })}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour</SelectItem>
                      <SelectItem value="24h">24-hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Week Starts On</Label>
                    <p className="text-sm text-muted-foreground">Choose the first day of the week</p>
                  </div>
                  <Select value={settings.weekStartsOn.toString()} onValueChange={(value) => updateSettings({ weekStartsOn: parseInt(value) as 0 | 1 })}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/40">
                <Button className="bg-gradient-primary hover:opacity-90">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">This section is coming soon!</p>
            </CardContent>
          </Card>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <User className="h-8 w-8 text-primary animate-pulse mx-auto mb-2" />
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/calendar">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.backToCalendar')}
              </Button>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <User className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Profile Settings</h1>
          </div>
          
          <div></div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 p-6 border-r border-border/40 bg-background/50 min-h-screen">
          <nav className="space-y-2">
            {sidebarSections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              
              return (
                <Link
                  key={section.id}
                  to={`/profile/${section.id}`}
                  className={`
                    flex items-start space-x-3 p-3 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'hover:bg-secondary/50 text-foreground'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 mt-0.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div>
                    <div className={`font-medium text-sm ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {section.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {section.description}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-2xl">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
