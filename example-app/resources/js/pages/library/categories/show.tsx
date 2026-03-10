import { Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import LibraryLayout from '@/layouts/library-layout';
import type { Book, Category, PaginatedData } from '@/types/library';

type CategoryShowProps = {
    category: Category;
    books: PaginatedData<Book>;
};

const placeholderColors = [
    'bg-amber-100',
    'bg-emerald-100',
    'bg-sky-100',
    'bg-rose-100',
    'bg-violet-100',
    'bg-orange-100',
];

export default function CategoryShow({ category, books }: CategoryShowProps) {
    return (
        <LibraryLayout title={category.name}>
            <Link
                href="/library/categories"
                className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Categories
            </Link>

            <h1 className="mb-2 text-4xl font-bold text-gray-900">{category.name}</h1>
            <p className="mb-8 text-gray-500">{books.total} {books.total === 1 ? 'book' : 'books'} in this category</p>

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
                <p className="py-20 text-center text-gray-500">No books in this category yet.</p>
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
