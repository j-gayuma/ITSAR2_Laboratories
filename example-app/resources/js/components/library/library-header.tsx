import { Link } from '@inertiajs/react';
import { PlusCircle } from 'lucide-react';

export default function LibraryHeader() {
    return (
        <header className="flex items-center justify-end gap-4 px-8 py-6">
            <Link
                href="/library/books/create"
                className="flex items-center gap-2 rounded-full bg-[#4a6741] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#3d5636] hover:shadow-md"
            >
                <PlusCircle className="h-4 w-4" />
                Add Book
            </Link>
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-300">
                <span className="text-sm font-bold text-gray-600">G</span>
            </div>
        </header>
    );
}
