import { motion } from "framer-motion";

interface Props {
  enabled: boolean;
  onToggle: () => void;
}

export default function SoundToggle({ enabled, onToggle }: Props) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed top-4 right-4 z-50 p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-all backdrop-blur-sm"
      title={enabled ? "Tắt âm thanh" : "Bật âm thanh"}
    >
      {enabled ? (
        <span className="text-2xl">🔊</span>
      ) : (
        <span className="text-2xl opacity-50">🔇</span>
      )}
    </motion.button>
  );
}

