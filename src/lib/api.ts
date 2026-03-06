const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("clp_access_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || "Request failed");
  }
  if (res.status === 204) return null as T;
  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export async function loginUser(email: string, password: string) {
  const body = new URLSearchParams({ username: email, password });
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Login failed" }));
    throw new Error(err.detail || "Login failed");
  }
  return res.json() as Promise<{ clp_access_token: string; token_type: string }>;
}

export async function registerUser(data: {
  email: string;
  password: string;
  role: string;
}) {
  return request<UserResponse>("/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Users ─────────────────────────────────────────────────────────────────────
export async function getCurrentUser(id: number) {
  return request<UserResponse>(`/users/${id}`);
}

// ── Courses ───────────────────────────────────────────────────────────────────
export async function getCourses() {
  return request<CourseResponse[]>("/courses/");
}

export async function getCourse(id: number) {
  return request<CourseResponse>(`/courses/${id}`);
}

export async function getMyCourses() {
  return request<CourseResponse[]>("/courses/my");
}

export async function createCourse(data: CourseCreate) {
  return request<CourseResponse>("/courses/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCourse(id: number, data: CourseCreate) {
  return request<CourseResponse>(`/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCourse(id: number) {
  return request<void>(`/courses/${id}`, { method: "DELETE" });
}

// ── Enrollments ───────────────────────────────────────────────────────────────
export async function enrollInCourse(courseId: number) {
  return request<EnrollmentResponse>(`/enrollments/course/${courseId}`, {
    method: "POST",
  });
}

export async function getMyEnrollments() {
  return request<EnrollmentResponse[]>("/enrollments/my");
}

// ── Sections ──────────────────────────────────────────────────────────────────
export async function createSection(courseId: number, data: { title: string; order_index: number }) {
  return request(`/sections/course/${courseId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Lessons ───────────────────────────────────────────────────────────────────
export async function getLessonsForSection(sectionId: number) {
  return request<LessonResponse[]>(`/lessons/section/${sectionId}`);
}

// ── Quizzes ───────────────────────────────────────────────────────────────────
export async function getQuizForLesson(lessonId: number) {
  return request<QuizDetailResponse>(`/quizzes/lesson/${lessonId}`);
}

export async function createQuiz(lessonId: number, data: { title: string; passing_score: number }) {
  return request<QuizResponse>(`/quizzes/lesson/${lessonId}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function addQuestion(quizId: number, data: { question_text: string; question_type: string }) {
  return request<QuestionResponse>(`/quizzes/${quizId}/questions`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function addAnswer(questionId: number, data: { answer_text: string; is_correct: boolean }) {
  return request<AnswerResponse>(`/quizzes/questions/${questionId}/answers`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitQuizAttempt(
  quizId: number,
  selectedAnswerIds: number[],
  textAnswers?: Record<number, string>
) {
  const body: Record<string, unknown> = { selected_answer_ids: selectedAnswerIds };
  if (textAnswers && Object.keys(textAnswers).length > 0) {
    const mapped: Record<number, string> = {};
    for (const [k, v] of Object.entries(textAnswers)) mapped[Number(k)] = v;
    body.text_answers = mapped;
  }
  return request<QuizAttemptResponse>(`/quiz-attempts/quiz/${quizId}`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────
export interface UserResponse {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  courses: CourseBasic[];
  enrollments: EnrollmentResponse[];
}

export interface CourseBasic {
  id: number;
  title: string;
  level: string;
  published: boolean;
}

export interface CourseCreate {
  title: string;
  description: string;
  level: "beginner" | "intermediate" | "advanced";
  published: boolean;
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  level: string;
  published: boolean;
  created_at: string;
  instructor_id: number;
  sections: SectionResponse[];
  enrollments_count: number;
}

export interface SectionResponse {
  id: number;
  title: string;
  order_index: number;
  course_id: number;
  lessons: LessonResponse[];
}

export interface LessonResponse {
  id: number;
  title: string;
  content_type: string;
  content_text: string;
  order_index: number;
  duration_minutes: number;
  section_id: number;
  has_quiz: boolean;
}

export interface EnrollmentResponse {
  id: number;
  course_id: number;
  user_id: number;
  enrolled_at: string;
  completed_at: string | null;
}

// ── Quiz types ────────────────────────────────────────────────────────────────
export interface AnswerResponse {
  id: number;
  answer_text: string;
  is_correct?: boolean;  // hidden for students
  question_id: number;
}

export interface QuestionResponse {
  id: number;
  question_text: string;
  question_type: "single_choice" | "multiple_choice";
  quiz_id: number;
  answers: AnswerResponse[];
}

export interface QuizResponse {
  id: number;
  title: string;
  passing_score: number;
  lesson_id: number;
  created_at: string;
}

export interface QuizDetailResponse extends QuizResponse {
  questions: QuestionResponse[];
  attempts_count: number;
  my_attempt?: QuizAttemptResponse | null;
}

export interface QuizAttemptResponse {
  id: number;
  quiz_id: number;
  user_id: number;
  score: number;
  passed: boolean;
  submitted_at: string | null;
}
