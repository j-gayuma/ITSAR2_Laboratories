<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\BorrowController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\FavoriteController;
use Illuminate\Support\Facades\Route;

// Redirect home to library
Route::redirect('/', '/library')->name('home');

// Library routes (no auth required)
Route::get('library', [BookController::class, 'discover'])->name('library.discover');
Route::get('library/books', [BookController::class, 'index'])->name('library.books.index');
Route::get('library/manage', [BookController::class, 'manage'])->name('library.books.manage');
Route::get('library/books/create', [BookController::class, 'create'])->name('library.books.create');
Route::post('library/books', [BookController::class, 'store'])->name('library.books.store');
Route::get('library/books/{book}', [BookController::class, 'show'])->name('library.books.show');
Route::get('library/books/{book}/edit', [BookController::class, 'edit'])->name('library.books.edit');
Route::post('library/books/{book}', [BookController::class, 'update'])->name('library.books.update');
Route::delete('library/books/{book}', [BookController::class, 'destroy'])->name('library.books.destroy');

Route::get('library/categories', [CategoryController::class, 'index'])->name('library.categories.index');
Route::get('library/categories/{category}', [CategoryController::class, 'show'])->name('library.categories.show');

Route::get('library/my-library', [BorrowController::class, 'index'])->name('library.my-library');
Route::post('library/borrow/{book}', [BorrowController::class, 'store'])->name('library.borrow');
Route::patch('library/return/{borrow}', [BorrowController::class, 'returnBook'])->name('library.return');

Route::get('library/favorites', [FavoriteController::class, 'index'])->name('library.favorites');
Route::post('library/favorites/{book}', [FavoriteController::class, 'toggle'])->name('library.favorites.toggle');

require __DIR__.'/settings.php';
