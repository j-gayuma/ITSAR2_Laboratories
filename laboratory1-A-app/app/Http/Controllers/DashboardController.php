<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Student;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $students = Student::all();
        $courses = Course::all();
        $enrollments = Enrollment::with(['student', 'course'])->get();

        return Inertia::render('dashboard', [
            'students' => $students,
            'courses' => $courses,
            'enrollments' => $enrollments,
        ]);
    }

    public function storeStudent(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email',
            'city' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'status' => 'nullable|in:active,inactive,graduated',
        ]);

        Student::create($validated);

        return redirect()->back();
    }

    public function storeEnrollment(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'enrolled_at' => 'nullable|date',
            'status' => 'nullable|in:confirmed,pending,cancelled',
        ]);

        Enrollment::create($validated);

        return redirect()->back();
    }

    public function updateStudent(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:students,email,' . $student->id,
            'city' => 'nullable|string|max:255',
            'date_of_birth' => 'nullable|date',
            'status' => 'nullable|in:active,inactive,graduated',
        ]);

        $student->update($validated);

        return redirect()->back();
    }

    public function deleteStudent(Student $student)
    {
        $student->delete();

        return redirect()->back();
    }

    public function storeCourse(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:courses,code',
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:1|max:10',
        ]);

        Course::create($validated);

        return redirect()->back();
    }

    public function updateCourse(Request $request, Course $course)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:courses,code,' . $course->id,
            'description' => 'nullable|string',
            'credits' => 'required|integer|min:1|max:10',
        ]);

        $course->update($validated);

        return redirect()->back();
    }

    public function deleteCourse(Course $course)
    {
        $course->delete();

        return redirect()->back();
    }

    public function updateEnrollment(Request $request, Enrollment $enrollment)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'course_id' => 'required|exists:courses,id',
            'enrolled_at' => 'nullable|date',
            'status' => 'nullable|in:confirmed,pending,cancelled',
        ]);

        $enrollment->update($validated);

        return redirect()->back();
    }

    public function deleteEnrollment(Enrollment $enrollment)
    {
        $enrollment->delete();

        return redirect()->back();
    }
}
