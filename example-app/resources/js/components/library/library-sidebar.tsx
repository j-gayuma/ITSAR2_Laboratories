import { Link, usePage } from '@inertiajs/react';
import {
    Compass,
    FolderOpen,
    BookOpen,
    Download,
    Heart,
    Settings,
    HelpCircle,
    LayoutList,
} from 'lucide-react';
import type { ReactNode } from 'react';

type SidebarItem = {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    active?: boolean;
};

const menuItems: SidebarItem[] = [
    { label: 'Discover', href: '/library', icon: Compass },
    { label: 'Category', href: '/library/categories', icon: FolderOpen },
    { label: 'My Library', href: '/library/my-library', icon: BookOpen },
    { label: 'Manage Books', href: '/library/manage', icon: LayoutList },
    { label: 'Download', href: '#', icon: Download },
    { label: 'Favorite', href: '/library/favorites', icon: Heart },
];

const bottomItems: SidebarItem[] = [
    { label: 'Setting', href: '#', icon: Settings },
    { label: 'Help', href: '#', icon: HelpCircle },
];

export default function LibrarySidebar() {
    const { url } = usePage();

    return (
        <aside className="library-sidebar flex h-screen w-64 flex-col bg-white px-6 py-8">
            {/* Brand */}
            <div className="mb-10">
                <h1 className="text-xl font-bold tracking-tight text-gray-900">
                    THE BOOKS
                </h1>
            </div>

            {/* Menu label */}
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
                Menu
            </p>

            {/* Main nav */}
            <nav className="flex flex-1 flex-col">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive =
                            url === item.href ||
                            (item.href !== '#' && url.startsWith(item.href) && item.href !== '/library') ||
                            (item.href === '/library' && url === '/library');

                        return (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                                        isActive
                                            ? 'bg-[#c1504e] text-white shadow-md'
                                            : 'text-gray-600 hover:bg-[#c1504e]/10 hover:text-[#c1504e] hover:translate-x-1 hover:shadow-sm'
                                    }`}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Bottom nav items */}
                <ul className="mt-auto space-y-1">
                    {bottomItems.map((item) => (
                        <li key={item.label}>
                            <Link
                                href={item.href}
                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1"
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        </li>
                    ))}

                </ul>
            </nav>
        </aside>
    );
}
