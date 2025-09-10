
'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { Label } from '@/components/ui/label';
import { Moon, Sun, Laptop } from 'lucide-react';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg bg-muted p-1">
      <Button
        variant={theme === 'light' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setTheme('light')}
      >
        <Sun className="mr-2 h-4 w-4" />
        Light
      </Button>
      <Button
        variant={theme === 'dark' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setTheme('dark')}
      >
        <Moon className="mr-2 h-4 w-4" />
        Dark
      </Button>
      <Button
        variant={theme === 'system' ? 'primary' : 'ghost'}
        size="sm"
        onClick={() => setTheme('system')}
      >
        <Laptop className="mr-2 h-4 w-4" />
        System
      </Button>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [avatarKey, setAvatarKey] = useState(0);

  const refreshAvatar = () => {
    setAvatarKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Your personal information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  key={avatarKey}
                  src={`https://picsum.photos/200/200?random=${avatarKey}`}
                  alt="User"
                  data-ai-hint="person face"
                  width={80}
                  height={80}
                />
                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Button variant="outline" onClick={refreshAvatar}>
                New Avatar
              </Button>
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <Label>Role</Label>
              <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
