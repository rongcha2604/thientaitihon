import { useMemo, useState, useEffect, useCallback, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { SubjectBundle, Question } from "../types";
import QuestionCard from "./QuestionCard";
import ScoreDisplay from "./ScoreDisplay";
import { useGamification } from "../hooks/useGamification";
import { useSound } from "../hooks/useSound";

// Lazy load ResultsModal để giảm initial bundle size
const ResultsModal = lazy(() => import("./ResultsModal"));

interface Props {
  bundle: SubjectBundle;
  onNewQuiz: () => void;
}

function flattenQuestions(bundle: SubjectBundle): Question[] {
  const arr: Question[] = [];
  for (const t of bundle.topics ?? []) {
    for (const q of t.questions ?? []) {
      arr.push(q);
    }
  }
  return arr;
}

export default function QuizPlayer({ bundle, onNewQuiz }: Props) {
  const questions = useMemo(() => flattenQuestions(bundle), [bundle]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeSpent, setTimeSpent] = useState(0);

  const { score, points, streak, addCorrect, addWrong, reset } = useGamification(questions.length);
  const { play } = useSound({ enabled: true, volume: 0.3 });

  if (!questions.length) {
    return (
      <div className="mt-6 text-center text-white text-xl">
        Hết câu hỏi 🪶
      </div>
    );
  }

  const q = questions[idx];
  // const isCorrect = picked !== null && Number(picked) === q.answer_index;
  const correctIdx = q.answer_index ?? q.options.findIndex(opt => opt === q.answer);
  const isCorrect = picked !== null && picked === correctIdx;
  const isLastQuestion = idx === questions.length - 1;

  useEffect(() => {
    if (showResultsModal) {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }
  }, [showResultsModal, startTime]);

  // Auto-load khi đúng (sau 2.5 giây)
  useEffect(() => {
    if (showResult && isCorrect && !isLastQuestion) {
      const timer = setTimeout(() => {
        setIdx(idx + 1);
        setPicked(null);
        setShowResult(false);
      }, 2500); // 2.5 giây để bé xem "Chính xác"
      
      return () => clearTimeout(timer); // Cleanup khi component unmount hoặc re-render
    }
  }, [showResult, isCorrect, isLastQuestion, idx]);

  // Memoize callbacks để tránh re-render
  const onPick = useCallback((i: number) => {
    if (showResult) return; // Không cho pick khi đã show result
    setPicked(i);
    play("click");
    
    // Tự động check sau 500ms
    setTimeout(() => {
      setShowResult(true);
      
      // Tính toán lại isCorrect bên trong timeout để tránh stale state
      const currentQuestion = questions[idx];
      const correctIndex = currentQuestion.answer_index ?? currentQuestion.options.findIndex(opt => opt === currentQuestion.answer);
      const isCorrectPick = (i === correctIndex);

      if (isCorrectPick) {
        addCorrect();
        play("correct");
      } else {
        addWrong();
        play("wrong");
      }
    }, 500);
  }, [showResult, play, questions, idx, addCorrect, addWrong]);

  const onNext = useCallback(() => {
    if (isLastQuestion) {
      setShowResultsModal(true);
    } else {
      setIdx(idx + 1);
      setPicked(null);
      setShowResult(false);
    }
  }, [isLastQuestion, idx]);

  const handleRestart = useCallback(() => {
    setIdx(0);
    setPicked(null);
    setShowResult(false);
    setShowResultsModal(false);
    reset();
  }, [reset]);

  const handleCloseResults = useCallback(() => {
    setShowResultsModal(false);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative"
    >
      <ScoreDisplay score={score} streak={streak} points={points} />
      {/* <ProgressBar current={idx + 1} total={questions.length} /> */}

      <QuestionCard
        key={idx}
        q={q}
        picked={picked}
        onPick={onPick}
        showResult={showResult}
        isCorrect={isCorrect}
        onNext={onNext}
        isLastQuestion={isLastQuestion}
        correctIdx={correctIdx}
      />

      {showResultsModal && (
        <ResultsModal
            isOpen={showResultsModal}
            score={score}
            total={questions.length}
            timeSpent={timeSpent}
            points={points}
            onRestart={handleRestart}
            onNewQuiz={onNewQuiz}
            onClose={handleCloseResults}
          />
        )}
    </motion.div>
  );
}
