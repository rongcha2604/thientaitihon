import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Manifest, SubjectBundle, Level } from "./types";
import { loadManifest, loadSubjectByLevel, pickPathByLevel } from "./lib/loader";
import SelectorPanel from "./components/SelectorPanel";
import QuizPlayer from "./components/QuizPlayer";
import BackgroundParticles from "./components/BackgroundParticles";
import SoundToggle from "./components/SoundToggle";
import { useSound } from "./hooks/useSound";

export default function App() {
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [grade, setGrade] = useState<number | "">("");
  const [subjectId, setSubjectId] = useState<string>("");
  const [level, setLevel] = useState<Level | "">("");
  const [bundle, setBundle] = useState<SubjectBundle | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Sound settings (có thể lưu vào localStorage sau)
  const { enabled: soundEnabled, toggle: toggleSound } = useSound({ enabled: true, volume: 0.3 });

  useEffect(() => {
    loadManifest()
      .then(setManifest)
      .catch((error) => {
        console.error("Failed to load manifest:", error);
        // Có thể hiển thị thông báo lỗi cho user nếu cần
      });
  }, []);

  async function onStart() {
    if (!manifest || !grade || !subjectId || !level) return;
    const g = manifest.grades.find((g) => g.grade === grade)!;
    const s = g.subjects.find((s) => s.id === subjectId)!;
    const path = pickPathByLevel(s.paths, level as Level);
    setLoading(true);
    try {
      const b = await loadSubjectByLevel(path);
      setBundle(b);
    } catch (error) {
      console.error("Failed to load subject:", error);
      // Có thể hiển thị thông báo lỗi cho user nếu cần
    } finally {
      setLoading(false);
    }
  }

  function onNewQuiz() {
    setBundle(null);
    setGrade("");
    setSubjectId("");
    setLevel("");
  }

  return (
    <div className="min-h-screen bg-primary-gradient relative overflow-hidden">
      <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
      <BackgroundParticles count={30} />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(255,107,107,0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgba(78,205,196,0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 80%, rgba(255,230,109,0.3) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgba(255,107,107,0.3) 0%, transparent 50%)",
          ],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-center mb-10"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg gradient-text-white"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            🌟 Thiên tài nhí
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/90 text-lg font-medium"
            style={{
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Học tập vui vẻ, đạt điểm cao! ✨🎉
          </motion.p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!bundle ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <SelectorPanel
                manifest={manifest}
                grade={grade}
                subjectId={subjectId}
                level={level}
                setGrade={setGrade}
                setSubjectId={setSubjectId}
                setLevel={setLevel}
                onStart={onStart}
                loading={loading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="flex justify-center mb-6">
                <button
                  onClick={onNewQuiz}
                  className="px-6 py-3 bg-white/90 rounded-xl text-gray-700 font-semibold hover:bg-white transition-all shadow-md hover:shadow-lg"
                >
                  ← Chọn bài khác
                </button>
              </div>
              <QuizPlayer bundle={bundle} onNewQuiz={onNewQuiz} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
