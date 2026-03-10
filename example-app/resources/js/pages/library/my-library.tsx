import { Link, router } from '@inertiajs/react';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';
import LibraryLayout from '@/layouts/library-layout';
import type { Borrow, PaginatedData } from '@/types/library';

type MyLibraryProps = {
    borrows: PaginatedData<Borrow>;
};

export default function MyLibrary({ borrows }: MyLibraryProps) {
    const handleReturn = (borrowId: number) => {
        router.patch(`/library/return/${borrowId}`);
    };

    const activeBorrows = borrows.data.filter((b) => !b.returned_at);
    const returnedBorrows = borrows.data.filter((b) => b.returned_at);

    return (
        <LibraryLayout title="My Library">
            <h1 className="mb-8 text-4xl font-bold text-gray-900">My Library</h1>

            {/* Add Book Button */}
            <div className="mb-8">
                <Link
                    href="/library/books/create"
                    className="inline-flex items-center gap-2 rounded-full bg-[#4a6741] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3d5636]"
                >
                    <BookOpen className="h-4 w-4" />
                    Add a New Book
                </Link>
            </div>

            {/* Active Borrows */}
            {activeBorrows.length > 0 && (
                <section className="mb-10">
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                        <Clock className="h-5 w-5 text-amber-500" />
                        Currently Borrowed
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {activeBorrows.map((borrow) => (
                            <div
                                key={borrow.id}
                                className="flex gap-4 rounded-xl bg-white p-4 shadow-sm"
                            >
                                <Link
                                    href={`/library/books/${borrow.book_id}`}
                                    className="flex-shrink-0"
                                >
                                    <div className="h-28 w-20 overflow-hidden rounded-lg bg-amber-100">
                                        {borrow.book?.cover_image ? (
                                            <img
                                                src={`/storage/${borrow.book.cover_image}`}
                                                alt={borrow.book?.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center p-2 text-center">
                                                <p className="text-xs font-bold text-gray-700">
                                                    {borrow.book?.title}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                <div className="flex flex-1 flex-col justify-between">
                                    <div>
                                        <Link
                                            href={`/library/books/${borrow.book_id}`}
                                            className="text-sm font-semibold text-gray-800 hover:underline"
                                        >
                                            {borrow.book?.title}
                                        </Link>
                                        <p className="text-xs text-gray-500">{borrow.book?.author}</p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            Borrowed: {new Date(borrow.borrowed_at).toLocaleDateString()}
                                        </p>
                                        {borrow.due_at && (
                                            <p className="text-xs text-amber-600">
                                                Due: {new Date(borrow.due_at).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => handleReturn(borrow.id)}
                                        className="mt-2 self-start rounded-full bg-[#4a6741] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[#3d5636]"
                                    >
                                        Return Book
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Returned Books */}
            {returnedBorrows.length > 0 && (
                <section>
                    <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Returned Books
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {returnedBorrows.map((borrow) => (
                            <div
                                key={borrow.id}
                                className="flex gap-4 rounded-xl bg-white p-4 shadow-sm opacity-75"
                            >
                                <Link
                                    href={`/library/books/${borrow.book_id}`}
                                    className="flex-shrink-0"
                                >
                                    <div className="h-28 w-20 overflow-hidden rounded-lg bg-gray-100">
                                        {borrow.book?.cover_image ? (
                                            <img
                                                src={`/storage/${borrow.book.cover_image}`}
                                                alt={borrow.book?.title}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center p-2 text-center">
                                                <p className="text-xs font-bold text-gray-700">
                                                    {borrow.book?.title}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                                <div className="flex flex-col justify-between">
                                    <div>
                                        <Link
                                            href={`/library/books/${borrow.book_id}`}
                                            className="text-sm font-semibold text-gray-800 hover:underline"
                                        >
                                            {borrow.book?.title}
                                        </Link>
                                        <p className="text-xs text-gray-500">{borrow.book?.author}</p>
                                        <p className="mt-1 text-xs text-gray-400">
                                            Returned: {new Date(borrow.returned_at!).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {borrows.data.length === 0 && (
                <div className="py-20 text-center">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <p className="text-lg text-gray-500">Your library is empty.</p>
                    <p className="text-sm text-gray-400">Start by browsing and borrowing books!</p>
                    <Link
                        href="/library"
                        className="mt-4 inline-block rounded-full bg-[#4a6741] px-6 py-3 text-sm font-semibold text-white"
                    >
                        Discover Books
                    </Link>
                </div>
            )}

            {/* Pagination */}
            {borrows.last_page > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                    {borrows.links.map((link, index) => (
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
