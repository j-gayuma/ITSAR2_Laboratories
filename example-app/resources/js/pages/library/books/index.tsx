import { Link } from '@inertiajs/react';
import LibraryLayout from '@/layouts/library-layout';
import type { Book, PaginatedData, Category } from '@/types/library';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';

type BooksIndexProps = {
    books: PaginatedData<Book>;
    categories: Category[];
    filters: {
        search: string | null;
        category: string | null;
    };
};

const placeholderColors = [
    'bg-amber-100',
    'bg-emerald-100',
    'bg-sky-100',
    'bg-rose-100',
    'bg-violet-100',
    'bg-orange-100',
];

export default function BooksIndex({ books, categories, filters }: BooksIndexProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/library/books', {
            search: searchQuery || undefined,
            category: selectedCategory || undefined,
        }, { preserveState: true });
    };

    return (
        <LibraryLayout title="All Books">
            <h1 className="mb-8 text-4xl font-bold text-gray-900">All Books</h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8 flex items-center gap-3">
                <div className="relative flex items-center rounded-full border border-gray-200 bg-white shadow-sm">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none rounded-l-full border-r border-gray-200 bg-transparent py-3 pl-5 pr-8 text-sm text-gray-600 focus:outline-none"
                    >
                        <option value="">All Categories</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <div className="flex items-center px-3">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64 border-none bg-transparent py-3 pr-5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-full bg-[#4a6741] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3d5636]"
                >
                    Search
                </button>
            </form>

            {/* Books Grid */}
            {books.data.length > 0 ? (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {books.data.map((book, index) => {
                        const coverColor = placeholderColors[index % placeholderColors.length];
                        return (
                            <Link
                                key={book.id}
                                href={`/library/books/${book.id}`}
                                className="group"
                            >
                                <div className={`relative h-56 w-full overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:-translate-y-2 ${!book.cover_image ? coverColor : ''}`}>
                                    {book.cover_image ? (
                                        <img
                                            src={`/storage/${book.cover_image}`}
                                            alt={book.title}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                                            <p className="text-sm font-bold text-gray-700">{book.title}</p>
                                            <p className="mt-2 text-xs text-gray-500">{book.author}</p>
                                        </div>
                                    )}
                                </div>
                                <h3 className="mt-2 text-sm font-medium text-gray-800 line-clamp-1 transition-colors duration-200 group-hover:text-[#4a6741]">{book.title}</h3>
                                <p className="text-xs text-gray-500 transition-colors duration-200 group-hover:text-gray-700">{book.author}</p>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-lg text-gray-500">No books found.</p>
                    <Link
                        href="/library/books/create"
                        className="mt-4 rounded-full bg-[#4a6741] px-6 py-3 text-sm font-semibold text-white"
                    >
                        Add a Book
                    </Link>
                </div>
            )}

            {/* Pagination */}
            {books.last_page > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                    {books.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`rounded-lg px-4 py-2 text-sm ${
                                link.active
                                    ? 'bg-[#4a6741] text-white'
                                    : 'bg-white text-gray-600 hover:bg-gray-100'
                            } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </LibraryLayout>
    );
}
