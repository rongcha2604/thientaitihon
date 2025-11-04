import { motion } from "framer-motion";
import type { Manifest, Level } from "../types";
import { getSubjectIcon, getLevelColor } from "../lib/utils";

interface Props {
  manifest: Manifest | null;
  grade: number | "";
  subjectId: string;
  level: Level | "";
  setGrade: (g: number | "") => void;
  setSubjectId: (s: string) => void;
  setLevel: (l: Level | "") => void;
  onStart: () => void;
  loading?: boolean;
}

export default function SelectorPanel({
  manifest,
  grade,
  subjectId,
  level,
  setGrade,
  setSubjectId,
  setLevel,
  onStart,
  loading,
}: Props) {
  const grades = manifest?.grades?.slice().sort((a, b) => a.grade - b.grade) ?? [];
  const subjects = grades.find((g) => g.grade === grade)?.subjects ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 md:p-8 shadow-xl max-w-2xl mx-auto border-2 border-gray-100"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📚 Chọn Lớp
          </label>
          <select
            className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
            value={grade}
            onChange={(e) => {
              setGrade(e.target.value ? Number(e.target.value) : "");
              setSubjectId("");
              setLevel("");
            }}
          >
            <option value="">-- Chọn Lớp --</option>
            {grades.map((g) => (
              <option key={g.grade} value={g.grade}>
                Lớp {g.grade}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📖 Chọn Môn
          </label>
          <select
            className="w-full p-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value);
              setLevel("");
            }}
            disabled={!grade}
          >
            <option value="">-- Chọn Môn --</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {getSubjectIcon(s.id)} {s.name || s.name_vi || s.id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎯 Chọn Cấp độ
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["easy", "medium", "hard"] as Level[]).map((lvl) => {
              const isSelected = level === lvl;
              const isDisabled = !subjectId;
              const label = lvl === "easy" ? "Dễ" : lvl === "medium" ? "Trung bình" : "Khó";
              const emoji = lvl === "easy" ? "😊" : lvl === "medium" ? "😐" : "😤";

              return (
                <motion.button
                  key={lvl}
                  onClick={() => setLevel(lvl)}
                  disabled={isDisabled}
                  whileHover={!isDisabled && !isSelected ? { scale: 1.05 } : {}}
                  whileTap={!isDisabled ? { scale: 0.95 } : {}}
                  className={`p-3 rounded-xl border-2 font-semibold transition-all ${
                    isSelected
                      ? getLevelColor(lvl) + " border-4 scale-105"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                  } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <div className="text-sm">{label}</div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.button
          onClick={onStart}
          disabled={!level || loading}
          whileHover={!loading && level ? { scale: 1.02 } : {}}
          whileTap={!loading && level ? { scale: 0.98 } : {}}
          className={`btn-primary w-full text-lg py-4 ${
            !level || loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "⏳ Đang tải…" : "🚀 Bắt đầu"}
        </motion.button>
      </div>
    </motion.div>
  );
}
