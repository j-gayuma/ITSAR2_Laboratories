import { Link, router } from '@inertiajs/react';
import { ChevronRight, Search, Grid3X3 } from 'lucide-react';
import { useState, useRef } from 'react';
import LibraryLayout from '@/layouts/library-layout';
import type { Book, Category, PaginatedData } from '@/types/library';

type DiscoverProps = {
    categories: Category[];
    recommendedBooks: Book[];
    searchResults: PaginatedData<Book> | null;
    filters: {
        search: string | null;
        category: string | null;
    };
};

// Placeholder cover image colors for books without images
const placeholderColors = [
    'bg-amber-100',
    'bg-emerald-100',
    'bg-sky-100',
    'bg-rose-100',
    'bg-violet-100',
    'bg-orange-100',
];

function BookCard({ book, index }: { book: Book; index: number }) {
    const coverColor = placeholderColors[index % placeholderColors.length];

    return (
        <Link
            href={`/library/books/${book.id}`}
            className="group flex-shrink-0"
        >
            <div className={`relative h-56 w-40 overflow-hidden rounded-lg shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:-translate-y-2 ${!book.cover_image ? coverColor : ''}`}>
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

                {/* Hover overlay — title + author centered */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <p className="text-center text-sm font-bold text-white leading-tight">{book.title}</p>
                    <p className="mt-1 text-center text-xs text-gray-300">{book.author}</p>
                </div>
            </div>
        </Link>
    );
}

function CategoryIcon({ category, index }: { category: Category; index: number }) {
    const colors = [
        'bg-purple-100',
        'bg-blue-100',
        'bg-green-100',
        'bg-yellow-100',
        'bg-red-100',
        'bg-pink-100',
    ];
    const bgColor = colors[index % colors.length];

    return (
        <Link
            href={`/library/categories/${category.id}`}
            className="group flex flex-col items-center gap-3"
        >
            <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${bgColor} transition-all duration-300 group-hover:scale-115 group-hover:shadow-lg group-hover:-translate-y-1`}>
                <span className="text-2xl">{category.icon || '📚'}</span>
            </div>
            <span className="text-center text-sm font-medium text-gray-700 transition-colors duration-200 group-hover:text-[#4a6741] group-hover:font-semibold">
                {category.name}
            </span>
        </Link>
    );
}

export default function Discover({
    categories,
    recommendedBooks,
    searchResults,
    filters,
}: DiscoverProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/library', {
            search: searchQuery || undefined,
            category: selectedCategory || undefined,
        }, { preserveState: true });
    };

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <LibraryLayout title="Discover">
            {/* Page Title */}
            <h1 className="mb-8 text-4xl font-bold text-gray-900">Discover</h1>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-10 flex items-center gap-3">
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
                        placeholder="Find the book you like..."
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

            {/* Search Results */}
            {searchResults && (
                <section className="mb-10">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">
                        Search Results ({searchResults.total})
                    </h2>
                    {searchResults.data.length > 0 ? (
                        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                            {searchResults.data.map((book, index) => (
                                <BookCard key={book.id} book={book} index={index} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">No books found matching your search.</p>
                    )}
                </section>
            )}

            {/* Book Recommendation */}
            <section className="mb-10">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Book Recommendation
                    </h2>
                    <Link
                        href="/library/books"
                        className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 transition-all duration-200 hover:bg-[#4a6741] hover:text-white hover:border-[#4a6741] hover:shadow-md"
                    >
                        View all
                        <ChevronRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="relative">
                    <div
                        ref={scrollRef}
                        className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {recommendedBooks.map((book, index) => (
                            <BookCard key={book.id} book={book} index={index} />
                        ))}
                    </div>
                    {recommendedBooks.length > 4 && (
                        <button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow-lg transition-colors hover:bg-gray-100"
                        >
                            <ChevronRight className="h-5 w-5 text-gray-600" />
                        </button>
                    )}
                </div>
            </section>

            {/* Book Category */}
            <section>
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                        Book Category
                    </h2>
                    <Link
                        href="/library/categories"
                        className="rounded-lg border border-gray-200 bg-white p-2 transition-colors hover:bg-gray-50"
                    >
                        <Grid3X3 className="h-5 w-5 text-gray-600" />
                    </Link>
                </div>

                <div className="flex flex-wrap gap-8">
                    {categories.map((category, index) => (
                        <CategoryIcon
                            key={category.id}
                            category={category}
                            index={index}
                        />
                    ))}
                </div>
            </section>
        </LibraryLayout>
    );
}
