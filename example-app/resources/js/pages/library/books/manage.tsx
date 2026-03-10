import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import LibraryLayout from '@/layouts/library-layout';
import type { Book, Category, PaginatedData } from '@/types/library';

type ManageBooksProps = {
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

export default function ManageBooks({ books, categories, filters }: ManageBooksProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/library/manage', {
            search: searchQuery || undefined,
            category: selectedCategory || undefined,
        }, { preserveState: true });
    };

    const handleDelete = (book: Book) => {
        if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
            router.delete(`/library/books/${book.id}`, {
                onSuccess: () => router.reload(),
            });
        }
    };

    return (
        <LibraryLayout title="Manage Books">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-4xl font-bold text-gray-900">Manage Books</h1>
                <Link
                    href="/library/books/create"
                    className="flex items-center gap-2 rounded-full bg-[#4a6741] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3d5636]"
                >
                    <Plus className="h-4 w-4" />
                    Add Book
                </Link>
            </div>

            {/* Search & Filter Bar */}
            <form onSubmit={handleSearch} className="mb-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-sm">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="appearance-none rounded-l-xl border-r border-gray-200 bg-transparent py-2.5 pl-4 pr-8 text-sm text-gray-600 focus:outline-none"
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
                        placeholder="Search by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-60 border-none bg-transparent py-2.5 pr-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                    />
                </div>
                <button
                    type="submit"
                    className="rounded-xl bg-[#4a6741] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3d5636]"
                >
                    Search
                </button>
                {(filters.search || filters.category) && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchQuery('');
                            setSelectedCategory('');
                            router.get('/library/manage', {}, { preserveState: false });
                        }}
                        className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-colors hover:bg-gray-50"
                    >
                        Clear
                    </button>
                )}
                <span className="ml-auto text-sm text-gray-500">
                    {books.total} book{books.total !== 1 ? 's' : ''} total
                </span>
            </form>

            {/* Table */}
            {books.data.length > 0 ? (
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                <th className="px-6 py-4">Book</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Published</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {books.data.map((book, index) => {
                                const coverColor = placeholderColors[index % placeholderColors.length];
                                return (
                                    <tr
                                        key={book.id}
                                        className="group transition-colors duration-150 hover:bg-[#f5f0e8]/60"
                                    >
                                        {/* Book cover + title + author */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-14 w-10 flex-shrink-0 overflow-hidden rounded-lg shadow-sm ${!book.cover_image ? coverColor : ''}`}>
                                                    {book.cover_image ? (
                                                        <img
                                                            src={`/storage/${book.cover_image}`}
                                                            alt={book.title}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center">
                                                            <BookOpen className="h-4 w-4 text-gray-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <Link
                                                        href={`/library/books/${book.id}`}
                                                        className="font-semibold text-gray-900 hover:text-[#4a6741] hover:underline"
                                                    >
                                                        {book.title}
                                                    </Link>
                                                    <p className="text-xs text-gray-500">{book.author}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-6 py-4 text-gray-600">
                                            {book.category?.name ?? (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>

                                        {/* Published */}
                                        <td className="px-6 py-4 text-gray-600">
                                            {book.published_at
                                                ? new Date(book.published_at).toLocaleDateString('en-US', {
                                                      year: 'numeric',
                                                      month: 'short',
                                                      day: 'numeric',
                                                  })
                                                : <span className="text-gray-300">—</span>}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                                book.is_available
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {book.is_available ? 'Available' : 'Borrowed'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/library/books/${book.id}/edit`}
                                                    className="flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-[#4a6741] hover:text-white"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(book)}
                                                    className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-500 hover:text-white"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-20 shadow-sm">
                    <BookOpen className="mb-4 h-16 w-16 text-gray-300" />
                    <h3 className="mb-2 text-lg font-semibold text-gray-600">No books found</h3>
                    <p className="mb-6 text-sm text-gray-400">
                        {filters.search || filters.category
                            ? 'Try adjusting your search filters.'
                            : 'Get started by adding your first book.'}
                    </p>
                    <Link
                        href="/library/books/create"
                        className="rounded-full bg-[#4a6741] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3d5636]"
                    >
                        Add a Book
                    </Link>
                </div>
            )}

            {/* Pagination */}
            {books.last_page > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    {books.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url || '#'}
                            className={`rounded-lg px-3 py-2 text-sm ${
                                link.active
                                    ? 'bg-[#4a6741] text-white'
                                    : link.url
                                      ? 'bg-white text-gray-600 hover:bg-gray-100'
                                      : 'cursor-not-allowed bg-gray-50 text-gray-300'
                            }`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </LibraryLayout>
    );
}
