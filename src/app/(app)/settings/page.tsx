
'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/use-auth';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Moon, Sun, Laptop, Loader2, Edit2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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

const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;


function ProfileForm() {
    const { user, updateUserProfile } = useAuth();
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
            });
        }
    }, [user, form]);
    
    const onSubmit = async (data: ProfileFormValues) => {
        await updateUserProfile(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                     <div className="space-y-1 mt-4">
                      <Label>Email</Label>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    <div className="space-y-1 mt-4">
                      <Label>Role</Label>
                      <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
                    </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                    </Button>
                </CardFooter>
            </form>
        </Form>
    );
}

function AvatarUploader() {
    const { user, uploadAvatar } = useAuth();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            await uploadAvatar(file);
            setIsUploading(false);
        }
    };
    
    const displayName = user?.firstName && user?.lastName ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}` : user?.email?.charAt(0).toUpperCase();

    return (
        <div className="flex items-center gap-4">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange}
                className="hidden" 
                accept="image/png, image/jpeg"
            />
            <Button
              variant="ghost"
              className="relative h-24 w-24 rounded-full group"
              onClick={handleAvatarClick}
              disabled={isUploading}
            >
                <Avatar className="h-24 w-24">
                    <AvatarImage
                        src={user?.avatarUrl}
                        alt="User"
                    />
                    <AvatarFallback className="text-3xl">{displayName}</AvatarFallback>
                </Avatar>
                 <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                    ) : (
                        <Edit2 className="h-8 w-8 text-white" />
                    )}
                 </div>
            </Button>
            <div className="space-y-1">
                <p className="font-medium">Profile Picture</p>
                <p className="text-sm text-muted-foreground">Click avatar to upload a new one.</p>
            </div>
        </div>
    );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <ProfileForm />
        </Card>

        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize the look and feel of the app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <AvatarUploader />
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
