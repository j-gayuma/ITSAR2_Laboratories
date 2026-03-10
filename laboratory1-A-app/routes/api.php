<?php

use App\Http\Controllers\CourseController;
use App\Http\Controllers\EnrollmentController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

Route::post('/students', [StudentController::class, 'store']);
Route::get('/students', [StudentController::class, 'index']);
Route::get('/courses', [CourseController::class, 'index']);
Route::post('/enrollments', [EnrollmentController::class, 'store']);
Route::get('/enrollments', [EnrollmentController::class, 'index']);
Route::get('/enrollments/{id}', [EnrollmentController::class, 'show']);
