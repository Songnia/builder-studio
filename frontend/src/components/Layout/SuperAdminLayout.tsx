import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { SuperAdminSidebar } from './SuperAdminSidebar';
import { SuperAdminNavbar } from './SuperAdminNavbar';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';
import vandaLogo from '@/template/assets/logo/vanda_logo.png';

const SuperAdminLayout: React.FC = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="superadmin-app flex flex-col h-screen bg-slate-50 dark:bg-zinc-950">
            <Toaster richColors position="top-right" />
            
            {/* Mobile Topbar */}
            <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <img src={vandaLogo} alt="Vanda Studio" className="h-8 w-auto object-contain" />
                    <span className="font-bold text-slate-800 dark:text-zinc-100">Administration Vanda</span>
                </div>
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="w-6 h-6 text-slate-600 dark:text-zinc-400" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r w-64 z-[60]">
                        <SuperAdminSidebar />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <div className="hidden md:block group z-50">
                    <SuperAdminSidebar className="h-full w-[88px] group-hover:w-[280px] transition-all duration-300 ease-in-out border-r border-slate-200 overflow-x-hidden bg-white shadow-none group-hover:shadow-[4px_0_24px_rgba(0,0,0,0.08)]" />
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <SuperAdminNavbar />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth bg-slate-50/50 dark:bg-zinc-950/50 text-slate-900 dark:text-zinc-50">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminLayout;
