<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'city' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'status' => 'nullable|in:active,inactive,graduated',
        ]);

        $student = Student::create($validated);

        return response()->json([
            'message' => 'Student created successfully',
            'data' => $student,
        ], 201);
    }

    public function index(): JsonResponse
    {
        $students = Student::all();

        return response()->json([
            'data' => $students,
        ]);
    }
}
