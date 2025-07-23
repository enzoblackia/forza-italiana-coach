import { NavLink, useLocation } from "react-router-dom";
import {
  Calendar,
  Dumbbell,
  Apple,
  Users,
  Settings,
  ShoppingCart,
  Phone,
  Home,
  LogOut
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Planning", url: "/planning", icon: Calendar },
  { title: "Esercizi", url: "/esercizi", icon: Dumbbell },
  { title: "Nutrizione", url: "/nutrizione", icon: Apple },
  { title: "Portale Clienti", url: "/portale-clienti", icon: Users },
];

const shopItems = [
  { title: "Proteine & Barrette", url: "/shop", icon: ShoppingCart },
];

const serviceItems = [
  { title: "Nutrizionisti", url: "/nutrizionisti", icon: Phone },
];

const adminItems = [
  { title: "Gestione Staff", url: "/staff", icon: Users },
  { title: "Impostazioni", url: "/impostazioni", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut, profile, isAdmin } = useAuth();

  const isActive = (path: string) => currentPath === path;
  const collapsed = state === "collapsed";
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/50 transition-smooth !text-black dark:!text-white";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="bg-background border-r border-border">
        {/* Logo e Avatar */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            {/* Avatar utente */}
            {profile && (
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-fitness-gradient text-white text-sm font-medium">
                  {profile.first_name?.charAt(0) || ''}
                  {profile.last_name?.charAt(0) || ''}
                </AvatarFallback>
              </Avatar>
            )}
            
            {/* Logo */}
            <div className="w-8 h-8 bg-fitness-gradient rounded-lg flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            
            {!collapsed && (
              <div className="flex-1">
                <span className="text-xl font-bold bg-fitness-gradient bg-clip-text text-transparent">
                  FitnessPro
                </span>
                {profile && (
                  <p className="text-xs text-muted-foreground">
                    {profile.first_name} {profile.last_name}
                    {isAdmin && " (Admin)"}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 text-sm font-medium uppercase tracking-wide">Principale</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Shop Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 text-sm font-medium uppercase tracking-wide">Shop</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {shopItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Services Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-600 text-sm font-medium uppercase tracking-wide">Servizi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {serviceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section - Only show if user is admin */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-600 text-sm font-medium uppercase tracking-wide">Amministrazione</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink to={item.url} className={getNavCls}>
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Logout Section */}
        <div className="mt-auto p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Esci</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}