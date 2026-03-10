<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnrollmentController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'enrolled_at' => 'nullable|date',
            'status' => 'nullable|in:confirmed,pending,cancelled',
        ]);

        $enrollment = Enrollment::create($validated);
        $enrollment->load(['student', 'course']);

        return response()->json([
            'message' => 'Enrollment created successfully',
            'data' => $enrollment,
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $enrollment = Enrollment::with(['student', 'course'])->findOrFail($id);

        return response()->json([
            'data' => $enrollment,
        ]);
    }

    public function index(): JsonResponse
    {
        $enrollments = Enrollment::with(['student', 'course'])->get();

        return response()->json([
            'data' => $enrollments,
        ]);
    }
}
