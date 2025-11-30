import { motion } from "framer-motion";
import type { LicenseInfo } from "../lib/license";
import CountdownTimer from "./CountdownTimer";

interface LicenseStatusProps {
  license: LicenseInfo;
  onExpired?: () => void;
}

export default function LicenseStatus({ license, onExpired }: LicenseStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50 max-w-sm"
    >
      {license.type === "permanent" ? (
        <motion.div
          animate={{
            boxShadow: [
              "0 4px 6px rgba(0, 0, 0, 0.1)",
              "0 4px 6px rgba(34, 197, 94, 0.3)",
              "0 4px 6px rgba(0, 0, 0, 0.1)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-lg"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <div>
              <div className="font-semibold text-sm">Bản quyền vĩnh viễn</div>
              <div className="text-xs opacity-90">Đã kích hoạt</div>
            </div>
          </div>
        </motion.div>
      ) : (
        license.expiryDate && (
          <CountdownTimer expiryDate={license.expiryDate} onExpired={onExpired} />
        )
      )}
    </motion.div>
  );
}

