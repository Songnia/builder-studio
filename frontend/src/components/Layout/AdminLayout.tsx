import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { AdminNavbar } from './AdminNavbar';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';

const AdminLayout: React.FC = () => {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-slate-50">
            <Toaster richColors position="top-right" />
            {/* Top Navigation Bar */}
            <AdminNavbar onMenuClick={() => setIsMobileOpen(true)} />

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <Sidebar showLogo={false} className="hidden md:flex w-64 border-r border-slate-200 bg-white" />

                {/* Mobile Sidebar (Sheet) */}
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetContent side="left" className="p-0 border-r w-64 z-[60]">
                        <Sidebar />
                    </SheetContent>
                </Sheet>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* We keep AdminHeader for page-specific actions/titles if needed, 
                        or we can integrate it better. For now, let's keep it but 
                        it might look redundant with the new Navbar. 
                        Let's render it for functionality preservation. */}
                    {/* Scrollable Content */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
