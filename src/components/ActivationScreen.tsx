import { useState } from "react";
import { motion } from "framer-motion";

interface ActivationScreenProps {
  machineId: string;
  onActivate: (key: string) => Promise<{ success: boolean; message: string }>;
  isActivating?: boolean;
  onSuccess?: () => void;
}

export default function ActivationScreen({ machineId, onActivate, isActivating = false, onSuccess }: ActivationScreenProps) {
  const [licenseKey, setLicenseKey] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImageSrc, setQrImageSrc] = useState("/zalo-qr.jpg");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!licenseKey.trim()) {
      setError("Vui lòng nhập License Key");
      return;
    }

    const result = await onActivate(licenseKey.trim());
    
    if (result.success) {
      setSuccess(result.message);
      setLicenseKey("");
      // Reload UI after a short delay (without page reload)
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
      }, 1500);
    } else {
      setError(result.message);
    }
  };

  const handleCopyMachineId = async () => {
    try {
      await navigator.clipboard.writeText(machineId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-primary-gradient flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background particles effect */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-10 max-w-md w-full relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="text-6xl mb-4"
          >
            🔐
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Kích hoạt bản quyền
          </h1>
          <p className="text-gray-600">
            Nhập License Key để sử dụng ứng dụng
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Key
            </label>
            <input
              type="text"
              value={licenseKey}
              onChange={(e) => {
                setLicenseKey(e.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="XXXX-XXXX-XXXX-XXXX hoặc XXXX-XXXX-XXXX-XXXX-365"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all text-center font-mono text-lg tracking-wider"
              disabled={isActivating}
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Machine ID
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={machineId}
                readOnly
                className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm text-center"
              />
              <button
                type="button"
                onClick={handleCopyMachineId}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm whitespace-nowrap"
              >
                {copied ? "✓ Đã copy" : "📋 Copy"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Gửi Machine ID này để nhận License Key
            </p>
          </div>

          {/* Zalo QR Code Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-5 border-2 border-blue-200"
          >
            <div className="text-center">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-center gap-2">
                <span>💬</span>
                Cần hỗ trợ? Liên hệ qua Zalo
              </h3>
              <div className="flex flex-col items-center gap-3">
                <div className="bg-white p-3 rounded-lg shadow-md min-h-[192px] min-w-[192px] flex items-center justify-center">
                  <img
                    src={qrImageSrc}
                    alt="Zalo QR Code - Rồng Cha"
                    className="w-48 h-48 object-contain"
                    onError={() => {
                      // Thử PNG nếu JPG không tìm thấy
                      if (qrImageSrc === "/zalo-qr.jpg") {
                        setQrImageSrc("/zalo-qr.png");
                      } else {
                        // Cả hai đều không tìm thấy, hiển thị placeholder
                        setQrImageSrc("");
                      }
                    }}
                    style={{ display: qrImageSrc ? "block" : "none" }}
                  />
                  {!qrImageSrc && (
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                      <div className="w-32 h-32 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <span className="text-4xl">📱</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Vui lòng đặt file zalo-qr.jpg<br />hoặc zalo-qr.png vào thư mục public</p>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-800 mb-1">Rồng Cha</p>
                  <p className="text-xs text-gray-600">Quét mã QR để liên hệ hỗ trợ</p>
                </div>
              </div>
            </div>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
            >
              ⚠️ {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
            >
              ✓ {success}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isActivating || !licenseKey.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isActivating ? (
              <span className="flex items-center justify-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Đang kích hoạt...
              </span>
            ) : (
              "🔓 Kích hoạt"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Hệ thống bảo mật NTA-Security-v1
          </p>
        </div>
      </motion.div>
    </div>
  );
}

