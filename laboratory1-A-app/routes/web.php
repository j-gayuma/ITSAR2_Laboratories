<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// Dashboard (Inertia)
Route::redirect('/', '/dashboard');
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::post('/dashboard/students', [DashboardController::class, 'storeStudent'])->name('dashboard.students.store');
Route::put('/dashboard/students/{student}', [DashboardController::class, 'updateStudent'])->name('dashboard.students.update');
Route::delete('/dashboard/students/{student}', [DashboardController::class, 'deleteStudent'])->name('dashboard.students.delete');

Route::post('/dashboard/courses', [DashboardController::class, 'storeCourse'])->name('dashboard.courses.store');
Route::put('/dashboard/courses/{course}', [DashboardController::class, 'updateCourse'])->name('dashboard.courses.update');
Route::delete('/dashboard/courses/{course}', [DashboardController::class, 'deleteCourse'])->name('dashboard.courses.delete');

Route::post('/dashboard/enrollments', [DashboardController::class, 'storeEnrollment'])->name('dashboard.enrollments.store');
Route::put('/dashboard/enrollments/{enrollment}', [DashboardController::class, 'updateEnrollment'])->name('dashboard.enrollments.update');
Route::delete('/dashboard/enrollments/{enrollment}', [DashboardController::class, 'deleteEnrollment'])->name('dashboard.enrollments.delete');
