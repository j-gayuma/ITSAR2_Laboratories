import { Head } from '@inertiajs/react';
import LibrarySidebar from '@/components/library/library-sidebar';
import LibraryHeader from '@/components/library/library-header';
import type { ReactNode } from 'react';

type LibraryLayoutProps = {
    children: ReactNode;
    title?: string;
};

export default function LibraryLayout({ children, title }: LibraryLayoutProps) {
    return (
        <div className="library-app flex min-h-screen bg-[#f5f0e8]">
            <Head title={title} />
            <LibrarySidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
                <LibraryHeader />
                <main className="flex-1 overflow-y-auto px-8 pb-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
