
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  CakeSlice,
  Calculator,
  LayoutDashboard,
  LineChart,
  Package,
  ShoppingCart,
  Users,
  PieChart,
  ShoppingBasket,
  LogOut,
  CreditCard,
  Check,
  Settings,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AuthGuard, useAuth } from '@/hooks/use-auth';
import { useNotifications } from '@/hooks/use-notifications';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

function AppLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const isExecutive = user?.role === 'executive';

  return (
    <AuthGuard>
        <SidebarProvider>
        <Sidebar>
            <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
                <CakeSlice className="text-primary size-8" />
                <h1 className="text-2xl font-bold font-headline">BakesNPlates</h1>
            </div>
            </SidebarHeader>
            <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link href="/">
                    <LayoutDashboard />
                    <span>Dashboard</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Orders">
                    <Link href="/orders">
                    <ShoppingCart />
                    <span>Orders</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Products">
                    <Link href="/products">
                    <ShoppingBasket />
                    <span>Products</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="POS">
                    <Link href="/pos">
                    <Calculator />
                    <span>POS</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Inventory">
                    <Link href="/inventory">
                    <Package />
                    <span>Inventory</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Customers">
                    <Link href="/customers">
                    <Users />
                    <span>Customers</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
                 <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Expenses">
                    <Link href="/expenses">
                    <CreditCard />
                    <span>Expenses</span>
                    </Link>
                </SidebarMenuButton>
                </SidebarMenuItem>
                {isExecutive && (
                    <>
                        <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Analytics">
                            <Link href="/analytics">
                            <PieChart />
                            <span>Analytics</span>
                            </Link>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Reports">
                            <Link href="/reports">
                            <LineChart />
                            <span>Reports</span>
                            </Link>
                        </SidebarMenuButton>
                        </SidebarMenuItem>
                    </>
                )}
            </SidebarMenu>
            </SidebarContent>
        </Sidebar>
        <SidebarInset>
            <header className="flex h-16 items-center justify-between border-b bg-background/50 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-10">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
                <NotificationMenu />
                <UserMenu />
            </div>
            </header>
            <main className="flex-1 p-4 md:p-6">
            {children}
            </main>
        </SidebarInset>
        </SidebarProvider>
    </AuthGuard>
  );
}

function NotificationMenu() {
    const { notifications, unreadCount, markAllAsRead } = useNotifications();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-destructive" />
                    )}
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 md:w-96" align="end">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="font-bold">Notifications</span>
                    {unreadCount > 0 && <Badge variant="secondary">{unreadCount} New</Badge>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center p-4">No notifications yet.</p>
                    ) : (
                        notifications.map(notification => (
                            <DropdownMenuItem key={notification.id} className={`flex items-start gap-3 p-3 ${!notification.read ? 'bg-secondary' : ''}`}>
                                <div className="mt-1">
                                    {!notification.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm">{notification.title}</p>
                                    <p className="text-xs text-muted-foreground">{notification.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(notification.date), { addSuffix: true })}</p>
                                </div>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>
                 {notifications.length > 0 && (
                    <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center" onSelect={markAllAsRead}>
                       <Check className="mr-2 h-4 w-4" /> Mark all as read
                    </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function UserMenu() {
    const { user, logout } = useAuth();
    // Add a key to force re-render of Avatar
    const [avatarKey, setAvatarKey] = useState(0);

    const refreshAvatar = () => {
        setAvatarKey(prev => prev + 1);
    }
    
    const displayName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : (user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Staff');

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                        <AvatarImage key={avatarKey} src={`https://picsum.photos/100/100?random=${avatarKey}`} alt="User" data-ai-hint="person face" width={40} height={40} />
                        <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default function AppPagesLayout({ children }: { children: React.ReactNode }) {
    return <AppLayout>{children}</AppLayout>;
}
