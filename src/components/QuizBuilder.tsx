"use client";
import { useState } from "react";
import {
  createQuiz,
  addQuestion,
  addAnswer,
  QuizResponse,
  QuestionResponse,
  AnswerResponse,
} from "@/lib/api";

interface QuizBuilderProps {
  lessonId: number;
  lessonTitle: string;
  onDone: () => void;
}

interface DraftAnswer {
  text: string;
  is_correct: boolean;
}

interface DraftQuestion {
  text: string;
  type: "single_choice" | "multiple_choice";
  answers: DraftAnswer[];
}

export default function QuizBuilder({ lessonId, lessonTitle, onDone }: QuizBuilderProps) {
  /* ── Step 1: Quiz meta ── */
  const [step, setStep] = useState<"meta" | "questions" | "done">("meta");
  const [title, setTitle] = useState("");
  const [passingScore, setPassingScore] = useState(70);
  const [quiz, setQuiz] = useState<QuizResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /* ── Step 2: Questions ── */
  const [questions, setQuestions] = useState<(QuestionResponse & { answers: AnswerResponse[] })[]>([]);
  const [draft, setDraft] = useState<DraftQuestion>({
    text: "",
    type: "single_choice",
    answers: [
      { text: "", is_correct: true },
      { text: "", is_correct: false },
    ],
  });
  const [addingQ, setAddingQ] = useState(false);

  /* ── Create Quiz ── */
  const handleCreateQuiz = async () => {
    if (!title.trim()) return setError("Quiz title is required");
    setSaving(true);
    setError("");
    try {
      const q = await createQuiz(lessonId, { title: title.trim(), passing_score: passingScore });
      setQuiz(q);
      setStep("questions");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create quiz");
    } finally {
      setSaving(false);
    }
  };

  /* ── Add Question with Answers ── */
  const handleAddQuestion = async () => {
    if (!quiz) return;
    if (draft.text.trim().length < 10) return setError("Question must be at least 10 characters");
    const validAnswers = draft.answers.filter((a) => a.text.trim());
    if (validAnswers.length < 2) return setError("Add at least 2 answers");
    if (!validAnswers.some((a) => a.is_correct)) return setError("Mark at least one answer as correct");

    setAddingQ(true);
    setError("");
    try {
      const q = await addQuestion(quiz.id, {
        question_text: draft.text.trim(),
        question_type: draft.type,
      });

      const savedAnswers: AnswerResponse[] = [];
      for (const a of validAnswers) {
        const sa = await addAnswer(q.id, {
          answer_text: a.text.trim(),
          is_correct: a.is_correct,
        });
        savedAnswers.push(sa);
      }

      setQuestions((prev) => [...prev, { ...q, answers: savedAnswers }]);
      setDraft({
        text: "",
        type: "single_choice",
        answers: [
          { text: "", is_correct: true },
          { text: "", is_correct: false },
        ],
      });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to add question");
    } finally {
      setAddingQ(false);
    }
  };

  /* ── Answer helpers ── */
  const updateAnswer = (idx: number, field: keyof DraftAnswer, value: string | boolean) => {
    setDraft((d) => {
      const answers = [...d.answers];
      answers[idx] = { ...answers[idx], [field]: value };
      // For single choice, only one correct answer
      if (field === "is_correct" && value === true && d.type === "single_choice") {
        answers.forEach((a, i) => {
          if (i !== idx) a.is_correct = false;
        });
      }
      return { ...d, answers };
    });
  };

  const addAnswerSlot = () => {
    setDraft((d) => ({
      ...d,
      answers: [...d.answers, { text: "", is_correct: false }],
    }));
  };

  const removeAnswer = (idx: number) => {
    if (draft.answers.length <= 2) return;
    setDraft((d) => ({
      ...d,
      answers: d.answers.filter((_, i) => i !== idx),
    }));
  };

  /* ─── RENDER ─── */
  return (
    <div
      className="rounded-2xl overflow-hidden animate-fade-up"
      style={{
        border: "1px solid var(--accent-border)",
        background: "var(--bg-card)",
      }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{
          borderBottom: "1px solid var(--border-default)",
          background: "var(--accent-bg)",
        }}
      >
        <div>
          <h3 className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            🛠️ Quiz Builder
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {lessonTitle}
          </p>
        </div>
        <button
          onClick={onDone}
          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
          style={{
            color: "var(--text-muted)",
            border: "1px solid var(--border-default)",
          }}
        >
          ✕ Close
        </button>
      </div>

      <div className="p-6">
        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-xl text-sm"
            style={{
              background: "rgba(239,68,68,.08)",
              color: "var(--error)",
              border: "1px solid rgba(239,68,68,.15)",
            }}
          >
            {error}
          </div>
        )}

        {/* ── Step 1: Quiz Meta ── */}
        {step === "meta" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Quiz Title
              </label>
              <input
                className="input-field"
                placeholder="e.g. Module 1 Knowledge Check"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                Passing Score (%)
              </label>
              <input
                type="number"
                className="input-field"
                min={0}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(Number(e.target.value))}
              />
            </div>
            <button
              onClick={handleCreateQuiz}
              disabled={saving}
              className="btn-primary w-full justify-center py-3"
              style={{ opacity: saving ? 0.7 : 1 }}
            >
              {saving ? "Creating…" : "Create Quiz →"}
            </button>
          </div>
        )}

        {/* ── Step 2: Add Questions ── */}
        {step === "questions" && (
          <div>
            {/* Saved questions */}
            {questions.length > 0 && (
              <div className="mb-6 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                  Questions Added ({questions.length})
                </p>
                {questions.map((q, qi) => (
                  <div
                    key={q.id}
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(16,185,129,.05)",
                      border: "1px solid rgba(16,185,129,.15)",
                    }}
                  >
                    <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                      <span style={{ color: "var(--accent)" }}>Q{qi + 1}.</span> {q.question_text}
                    </p>
                    <div className="space-y-1">
                      {q.answers.map((a) => (
                        <p key={a.id} className="text-xs flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                          <span style={{ color: a.is_correct ? "var(--accent)" : "var(--text-faint)" }}>
                            {a.is_correct ? "✓" : "○"}
                          </span>
                          {a.answer_text}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* New question form */}
            <div
              className="rounded-xl p-5 space-y-4"
              style={{ border: "1px solid var(--border-default)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--accent)" }}>
                New Question
              </p>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Question Text
                </label>
                <textarea
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Enter your question (min 10 chars)…"
                  value={draft.text}
                  onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Type
                </label>
                <div className="flex gap-2">
                  {(["single_choice", "multiple_choice"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, type: t }))}
                      className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
                      style={
                        draft.type === t
                          ? {
                              background: "var(--accent-bg)",
                              color: "var(--accent)",
                              border: "1px solid var(--accent-border)",
                            }
                          : {
                              background: "var(--bg-card)",
                              color: "var(--text-dim)",
                              border: "1px solid var(--border-default)",
                            }
                      }
                    >
                      {t === "single_choice" ? "Fill in the Blank" : "Multiple Choice"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Answers */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
                  Answers
                </label>
                <div className="space-y-2">
                  {draft.answers.map((a, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateAnswer(i, "is_correct", !a.is_correct)}
                        className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 border transition-colors"
                        style={{
                          background: a.is_correct ? "var(--accent)" : "transparent",
                          borderColor: a.is_correct ? "var(--accent)" : "var(--border-strong)",
                        }}
                        title={a.is_correct ? "Correct answer" : "Mark as correct"}
                      >
                        {a.is_correct && <span className="text-white text-xs">✓</span>}
                      </button>
                      <input
                        className="input-field flex-1"
                        placeholder={`Answer ${i + 1}`}
                        value={a.text}
                        onChange={(e) => updateAnswer(i, "text", e.target.value)}
                      />
                      {draft.answers.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeAnswer(i)}
                          className="text-xs px-2 py-1 rounded-lg"
                          style={{ color: "var(--error)" }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addAnswerSlot}
                  className="mt-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  style={{
                    color: "var(--accent)",
                    background: "var(--accent-bg)",
                    border: "1px solid var(--accent-border)",
                  }}
                >
                  + Add Answer
                </button>
              </div>

              <button
                onClick={handleAddQuestion}
                disabled={addingQ}
                className="btn-primary w-full justify-center py-2.5"
                style={{ opacity: addingQ ? 0.7 : 1 }}
              >
                {addingQ ? "Adding…" : "Add Question"}
              </button>
            </div>

            {/* Done */}
            {questions.length > 0 && (
              <button
                onClick={() => { setStep("done"); onDone(); }}
                className="mt-4 w-full py-3 rounded-xl text-sm font-semibold transition-all text-center"
                style={{
                  background: "rgba(22,163,74,.1)",
                  color: "#16a34a",
                  border: "1px solid rgba(22,163,74,.2)",
                }}
              >
                ✓ Finish — {questions.length} Question{questions.length !== 1 && "s"} Added
              </button>
            )}
          </div>
        )}

        {/* ── Done ── */}
        {step === "done" && (
          <div className="text-center py-6">
            <p className="text-4xl mb-3">🏆</p>
            <p className="font-bold mb-1" style={{ color: "var(--text-primary)" }}>Quiz Created!</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {questions.length} question{questions.length !== 1 && "s"} added to &quot;{title}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
