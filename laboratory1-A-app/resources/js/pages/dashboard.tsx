import { Head, useForm, router } from '@inertiajs/react';
import {
    LayoutGrid,
    Plus,
    ChevronDown,
    GraduationCap,
    BookOpen,
    Users,
    Eye,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Student = {
    id: number;
    name: string;
    email: string;
    city: string | null;
    date_of_birth: string | null;
    status: string;
    created_at: string;
};

type Course = {
    id: number;
    name: string;
    code: string;
    description: string | null;
    credits: number;
};

type Enrollment = {
    id: number;
    student_id: number;
    course_id: number;
    enrolled_at: string;
    status: string;
    student: Student;
    course: Course;
};

type Props = {
    students: Student[];
    courses: Course[];
    enrollments: Enrollment[];
};

type ActiveView = 'students' | 'courses' | 'enrollments';

export default function Dashboard({ students, courses, enrollments }: Props) {
    const [activeView, setActiveView] = useState<ActiveView>('enrollments');
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    // Dialog states
    const [showStudentDialog, setShowStudentDialog] = useState(false);
    const [showEnrollmentDialog, setShowEnrollmentDialog] = useState(false);
    const [showCourseDialog, setShowCourseDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Track editing vs creating
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null);

    // View detail data
    const [viewData, setViewData] = useState<{ title: string; fields: { label: string; value: string }[] }>({ title: '', fields: [] });

    // Delete tracking
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'student' | 'course' | 'enrollment'; id: number; name: string } | null>(null);

    // Forms
    const studentForm = useForm({
        name: '',
        email: '',
        city: '',
        date_of_birth: '',
        status: 'active',
    });

    const courseForm = useForm({
        name: '',
        code: '',
        description: '',
        credits: '3',
    });

    const enrollmentForm = useForm({
        student_id: '',
        course_id: '',
        enrolled_at: new Date().toISOString().split('T')[0],
        status: 'pending',
    });

    // ---- Handlers ----

    const handleNewRecord = () => {
        if (activeView === 'students') {
            setEditingStudent(null);
            studentForm.reset();
            setShowStudentDialog(true);
        } else if (activeView === 'courses') {
            setEditingCourse(null);
            courseForm.reset();
            setShowCourseDialog(true);
        } else {
            setEditingEnrollment(null);
            enrollmentForm.reset();
            enrollmentForm.setData('enrolled_at', new Date().toISOString().split('T')[0]);
            setShowEnrollmentDialog(true);
        }
    };

    // Student CRUD
    const handleEditStudent = (s: Student) => {
        setEditingStudent(s);
        studentForm.setData({
            name: s.name,
            email: s.email,
            city: s.city || '',
            date_of_birth: s.date_of_birth ? s.date_of_birth.split('T')[0] : '',
            status: s.status,
        });
        setShowStudentDialog(true);
    };

    const handleSubmitStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStudent) {
            studentForm.put(`/dashboard/students/${editingStudent.id}`, {
                onSuccess: () => { setShowStudentDialog(false); studentForm.reset(); setEditingStudent(null); },
            });
        } else {
            studentForm.post('/dashboard/students', {
                onSuccess: () => { setShowStudentDialog(false); studentForm.reset(); },
            });
        }
    };

    // Course CRUD
    const handleEditCourse = (c: Course) => {
        setEditingCourse(c);
        courseForm.setData({
            name: c.name,
            code: c.code,
            description: c.description || '',
            credits: String(c.credits),
        });
        setShowCourseDialog(true);
    };

    const handleSubmitCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourse) {
            courseForm.put(`/dashboard/courses/${editingCourse.id}`, {
                onSuccess: () => { setShowCourseDialog(false); courseForm.reset(); setEditingCourse(null); },
            });
        } else {
            courseForm.post('/dashboard/courses', {
                onSuccess: () => { setShowCourseDialog(false); courseForm.reset(); },
            });
        }
    };

    // Enrollment CRUD
    const handleEditEnrollment = (en: Enrollment) => {
        setEditingEnrollment(en);
        enrollmentForm.setData({
            student_id: String(en.student_id),
            course_id: String(en.course_id),
            enrolled_at: en.enrolled_at ? en.enrolled_at.split('T')[0] : '',
            status: en.status,
        });
        setShowEnrollmentDialog(true);
    };

    const handleSubmitEnrollment = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingEnrollment) {
            enrollmentForm.put(`/dashboard/enrollments/${editingEnrollment.id}`, {
                onSuccess: () => { setShowEnrollmentDialog(false); enrollmentForm.reset(); setEditingEnrollment(null); },
            });
        } else {
            enrollmentForm.post('/dashboard/enrollments', {
                onSuccess: () => { setShowEnrollmentDialog(false); enrollmentForm.reset(); },
            });
        }
    };

    // View
    const handleViewStudent = (s: Student) => {
        setViewData({
            title: 'Student Details',
            fields: [
                { label: 'Name', value: s.name },
                { label: 'Email', value: s.email },
                { label: 'City', value: s.city || '—' },
                { label: 'Date of Birth', value: formatDate(s.date_of_birth) },
                { label: 'Status', value: s.status },
            ],
        });
        setShowViewDialog(true);
    };

    const handleViewCourse = (c: Course) => {
        setViewData({
            title: 'Course Details',
            fields: [
                { label: 'Name', value: c.name },
                { label: 'Code', value: c.code },
                { label: 'Description', value: c.description || '—' },
                { label: 'Credits', value: String(c.credits) },
            ],
        });
        setShowViewDialog(true);
    };

    const handleViewEnrollment = (en: Enrollment) => {
        setViewData({
            title: 'Enrollment Details',
            fields: [
                { label: 'Student', value: en.student.name },
                { label: 'Course', value: `${en.course.name} (${en.course.code})` },
                { label: 'City', value: en.student.city || '—' },
                { label: 'Enrolled At', value: formatDate(en.enrolled_at) },
                { label: 'Status', value: en.status },
            ],
        });
        setShowViewDialog(true);
    };

    // Delete
    const confirmDelete = (type: 'student' | 'course' | 'enrollment', id: number, name: string) => {
        setDeleteTarget({ type, id, name });
        setShowDeleteDialog(true);
    };

    const handleDelete = () => {
        if (!deleteTarget) return;
        const url =
            deleteTarget.type === 'student' ? `/dashboard/students/${deleteTarget.id}` :
            deleteTarget.type === 'course' ? `/dashboard/courses/${deleteTarget.id}` :
            `/dashboard/enrollments/${deleteTarget.id}`;
        router.delete(url, {
            onSuccess: () => { setShowDeleteDialog(false); setDeleteTarget(null); },
        });
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const StatusBadge = ({ status }: { status: string }) => {
        const colors: Record<string, string> = {
            confirmed: 'bg-green-100 text-green-700 border-green-200',
            active: 'bg-green-100 text-green-700 border-green-200',
            pending: 'bg-orange-100 text-orange-700 border-orange-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200',
            inactive: 'bg-gray-100 text-gray-700 border-gray-200',
            graduated: 'bg-blue-100 text-blue-700 border-blue-200',
        };
        return (
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
                {status}
            </span>
        );
    };

    const ActionButtons = ({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) => (
        <div className="flex items-center gap-1">
            <button onClick={onView} className="rounded p-1 text-gray-400 hover:bg-blue-50 hover:text-blue-600" title="View">
                <Eye className="h-4 w-4" />
            </button>
            <button onClick={onEdit} className="rounded p-1 text-gray-400 hover:bg-amber-50 hover:text-amber-600" title="Edit">
                <Pencil className="h-4 w-4" />
            </button>
            <button onClick={onDelete} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600" title="Delete">
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
    );

    const workspaceItems: { key: ActiveView; label: string; icon: React.ElementType }[] = [
        { key: 'enrollments', label: 'Enrollments', icon: BookOpen },
        { key: 'students', label: 'Students', icon: Users },
        { key: 'courses', label: 'Courses', icon: GraduationCap },
    ];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-screen bg-gray-50 font-sans">
                {/* Sidebar */}
                <aside className="flex w-64 flex-shrink-0 flex-col border-r border-gray-200 bg-white">
                    <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-rose-400 to-orange-400">
                            <GraduationCap className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-gray-900">Orbital</span>
                    </div>
                    <div className="flex-1 overflow-y-auto px-3 py-4">
                        <div className="mb-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">All Workspace</div>
                        <div className="space-y-0.5">
                            <button
                                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                                className="flex w-full items-center gap-2 rounded-lg bg-rose-50 px-2 py-2 text-sm font-medium text-rose-600"
                            >
                                <div className="flex h-5 w-5 items-center justify-center rounded bg-rose-500 text-[10px] text-white">W</div>
                                <span className="flex-1 text-left">Workspace 1</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${sidebarExpanded ? '' : '-rotate-90'}`} />
                            </button>
                            {sidebarExpanded && (
                                <div className="ml-4 space-y-0.5 border-l border-gray-200 pl-3">
                                    {workspaceItems.map((item) => (
                                        <button
                                            key={item.key}
                                            onClick={() => setActiveView(item.key)}
                                            className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm ${activeView === item.key ? 'bg-gray-100 font-medium text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex flex-1 flex-col overflow-hidden">
                    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
                        <span className="text-sm font-medium text-gray-900">Data</span>
                    </header>

                    <div className="flex-1 overflow-auto bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-gray-900">
                                {activeView === 'enrollments' ? 'Enrollments' : activeView === 'students' ? 'Students' : 'Courses'}
                            </h1>
                            <Button onClick={handleNewRecord} size="sm" className="bg-rose-500 text-white hover:bg-rose-600">
                                <Plus className="mr-1 h-4 w-4" />
                                New Record
                            </Button>
                        </div>

                        <div className="mb-4 flex items-center gap-1.5 border-b border-gray-100 pb-2">
                            <LayoutGrid className="h-3.5 w-3.5 text-gray-500" />
                            <span className="border-b-2 border-rose-500 pb-1 text-sm font-medium text-gray-900">Grid View</span>
                        </div>

                        {/* Data Tables */}
                        <div className="overflow-x-auto rounded-lg border border-gray-200">
                            {activeView === 'enrollments' && (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50/80">
                                            <th className="w-10 px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">#</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Student</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Course</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">City</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {enrollments.length === 0 && (
                                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No enrollments yet. Click "New Record" to add one.</td></tr>
                                        )}
                                        {enrollments.map((en, idx) => (
                                            <tr key={en.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="px-3 py-2.5 text-gray-400">{idx + 1}</td>
                                                <td className="px-3 py-2.5 font-medium text-gray-900">{en.student.name}</td>
                                                <td className="px-3 py-2.5 text-gray-700">{en.course.name}</td>
                                                <td className="px-3 py-2.5 text-gray-600">{en.student.city || '—'}</td>
                                                <td className="px-3 py-2.5 text-gray-600">{formatDate(en.enrolled_at)}</td>
                                                <td className="px-3 py-2.5"><StatusBadge status={en.status} /></td>
                                                <td className="px-3 py-2.5">
                                                    <ActionButtons
                                                        onView={() => handleViewEnrollment(en)}
                                                        onEdit={() => handleEditEnrollment(en)}
                                                        onDelete={() => confirmDelete('enrollment', en.id, `${en.student.name} → ${en.course.name}`)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeView === 'students' && (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50/80">
                                            <th className="w-10 px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">#</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Email</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">City</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date of Birth</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {students.length === 0 && (
                                            <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">No students yet. Click "New Record" to add one.</td></tr>
                                        )}
                                        {students.map((s, idx) => (
                                            <tr key={s.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="px-3 py-2.5 text-gray-400">{idx + 1}</td>
                                                <td className="px-3 py-2.5 font-medium text-gray-900">{s.name}</td>
                                                <td className="px-3 py-2.5 text-gray-600">{s.email}</td>
                                                <td className="px-3 py-2.5 text-gray-600">{s.city || '—'}</td>
                                                <td className="px-3 py-2.5 text-gray-600">{formatDate(s.date_of_birth)}</td>
                                                <td className="px-3 py-2.5"><StatusBadge status={s.status} /></td>
                                                <td className="px-3 py-2.5">
                                                    <ActionButtons
                                                        onView={() => handleViewStudent(s)}
                                                        onEdit={() => handleEditStudent(s)}
                                                        onDelete={() => confirmDelete('student', s.id, s.name)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}

                            {activeView === 'courses' && (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50/80">
                                            <th className="w-10 px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">#</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Code</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Credits</th>
                                            <th className="px-3 py-2.5 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {courses.length === 0 && (
                                            <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">No courses available. Click "New Record" to add one.</td></tr>
                                        )}
                                        {courses.map((c, idx) => (
                                            <tr key={c.id} className="transition-colors hover:bg-gray-50/50">
                                                <td className="px-3 py-2.5 text-gray-400">{idx + 1}</td>
                                                <td className="px-3 py-2.5 font-medium text-gray-900">{c.name}</td>
                                                <td className="px-3 py-2.5 text-gray-600">{c.code}</td>
                                                <td className="px-3 py-2.5 text-gray-600">{c.description || '—'}</td>
                                                <td className="px-3 py-2.5 text-gray-600">{c.credits}</td>
                                                <td className="px-3 py-2.5">
                                                    <ActionButtons
                                                        onView={() => handleViewCourse(c)}
                                                        onEdit={() => handleEditCourse(c)}
                                                        onDelete={() => confirmDelete('course', c.id, c.name)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* ===== STUDENT DIALOG (Add / Edit) ===== */}
            <Dialog open={showStudentDialog} onOpenChange={(open) => { setShowStudentDialog(open); if (!open) { setEditingStudent(null); studentForm.reset(); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingStudent ? 'Edit Student' : 'Add New Student'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitStudent} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="student-name">Name</Label>
                            <Input id="student-name" value={studentForm.data.name} onChange={(e) => studentForm.setData('name', e.target.value)} placeholder="Enter student name" required />
                            {studentForm.errors.name && <p className="text-sm text-red-500">{studentForm.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="student-email">Email</Label>
                            <Input id="student-email" type="email" value={studentForm.data.email} onChange={(e) => studentForm.setData('email', e.target.value)} placeholder="Enter email address" required />
                            {studentForm.errors.email && <p className="text-sm text-red-500">{studentForm.errors.email}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="student-city">City</Label>
                            <Input id="student-city" value={studentForm.data.city} onChange={(e) => studentForm.setData('city', e.target.value)} placeholder="Enter city" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="student-dob">Date of Birth</Label>
                            <Input id="student-dob" type="date" value={studentForm.data.date_of_birth} onChange={(e) => studentForm.setData('date_of_birth', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={studentForm.data.status} onValueChange={(val) => studentForm.setData('status', val)}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="graduated">Graduated</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowStudentDialog(false)}>Cancel</Button>
                            <Button type="submit" disabled={studentForm.processing} className="bg-rose-500 hover:bg-rose-600">
                                {studentForm.processing ? 'Saving...' : editingStudent ? 'Update Student' : 'Create Student'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ===== COURSE DIALOG (Add / Edit) ===== */}
            <Dialog open={showCourseDialog} onOpenChange={(open) => { setShowCourseDialog(open); if (!open) { setEditingCourse(null); courseForm.reset(); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitCourse} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="course-name">Name</Label>
                            <Input id="course-name" value={courseForm.data.name} onChange={(e) => courseForm.setData('name', e.target.value)} placeholder="Enter course name" required />
                            {courseForm.errors.name && <p className="text-sm text-red-500">{courseForm.errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course-code">Code</Label>
                            <Input id="course-code" value={courseForm.data.code} onChange={(e) => courseForm.setData('code', e.target.value)} placeholder="e.g. CS101" required />
                            {courseForm.errors.code && <p className="text-sm text-red-500">{courseForm.errors.code}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course-desc">Description</Label>
                            <Input id="course-desc" value={courseForm.data.description} onChange={(e) => courseForm.setData('description', e.target.value)} placeholder="Course description" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course-credits">Credits</Label>
                            <Input id="course-credits" type="number" min="1" max="10" value={courseForm.data.credits} onChange={(e) => courseForm.setData('credits', e.target.value)} required />
                            {courseForm.errors.credits && <p className="text-sm text-red-500">{courseForm.errors.credits}</p>}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowCourseDialog(false)}>Cancel</Button>
                            <Button type="submit" disabled={courseForm.processing} className="bg-rose-500 hover:bg-rose-600">
                                {courseForm.processing ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ===== ENROLLMENT DIALOG (Add / Edit) ===== */}
            <Dialog open={showEnrollmentDialog} onOpenChange={(open) => { setShowEnrollmentDialog(open); if (!open) { setEditingEnrollment(null); enrollmentForm.reset(); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingEnrollment ? 'Edit Enrollment' : 'Add New Enrollment'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmitEnrollment} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Student</Label>
                            <Select value={enrollmentForm.data.student_id} onValueChange={(val) => enrollmentForm.setData('student_id', val)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select a student" /></SelectTrigger>
                                <SelectContent>
                                    {students.map((s) => (<SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>))}
                                </SelectContent>
                            </Select>
                            {enrollmentForm.errors.student_id && <p className="text-sm text-red-500">{enrollmentForm.errors.student_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label>Course</Label>
                            <Select value={enrollmentForm.data.course_id} onValueChange={(val) => enrollmentForm.setData('course_id', val)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="Select a course" /></SelectTrigger>
                                <SelectContent>
                                    {courses.map((c) => (<SelectItem key={c.id} value={String(c.id)}>{c.name} ({c.code})</SelectItem>))}
                                </SelectContent>
                            </Select>
                            {enrollmentForm.errors.course_id && <p className="text-sm text-red-500">{enrollmentForm.errors.course_id}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="enroll-date">Enrolled At</Label>
                            <Input id="enroll-date" type="date" value={enrollmentForm.data.enrolled_at} onChange={(e) => enrollmentForm.setData('enrolled_at', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={enrollmentForm.data.status} onValueChange={(val) => enrollmentForm.setData('status', val)}>
                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="confirmed">Confirmed</SelectItem>
                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowEnrollmentDialog(false)}>Cancel</Button>
                            <Button type="submit" disabled={enrollmentForm.processing} className="bg-rose-500 hover:bg-rose-600">
                                {enrollmentForm.processing ? 'Saving...' : editingEnrollment ? 'Update Enrollment' : 'Create Enrollment'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* ===== VIEW DIALOG ===== */}
            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{viewData.title}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        {viewData.fields.map((f) => (
                            <div key={f.label} className="flex justify-between border-b border-gray-100 pb-2">
                                <span className="text-sm font-medium text-gray-400">{f.label}</span>
                                <span className="text-sm text-gray-500">{f.value}</span>
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* ===== DELETE CONFIRMATION DIALOG ===== */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                        <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
