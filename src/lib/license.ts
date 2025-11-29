// License Management System - NTA-Security-v1
// Secret Salt: PHUC_HOI_ANH_CU_SECRET_SAUCE_v1.0

const SECRET_SALT = "PHUC_HOI_ANH_CU_SECRET_SAUCE_v1.0";
const MACHINE_ID_KEY = "NTA_MACHINE_ID";
const LICENSE_KEY_STORAGE = "NTA_LICENSE_KEY";
const LICENSE_EXPIRY_STORAGE = "NTA_LICENSE_EXPIRY";
const LICENSE_TYPE_STORAGE = "NTA_LICENSE_TYPE";

export type LicenseType = "permanent" | "temporary";

export interface LicenseInfo {
  key: string;
  type: LicenseType;
  expiryDate: number | null; // timestamp in milliseconds, null for permanent
  activatedAt: number; // timestamp in milliseconds
}

/**
 * Generate or retrieve Machine ID from localStorage
 * Format: WEB-XXXX-XXXX
 */
export function getOrCreateMachineId(): string {
  let machineId = localStorage.getItem(MACHINE_ID_KEY);
  
  if (!machineId) {
    // Generate a random machine ID
    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    machineId = `WEB-${part1}-${part2}`;
    localStorage.setItem(MACHINE_ID_KEY, machineId);
  }
  
  return machineId;
}

/**
 * Hash string using SHA-256
 */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

/**
 * Generate expected hash for a license key
 * Algorithm: SHA-256(MachineID + "|" + [Duration or empty] + "|" + Salt)
 */
async function generateExpectedHash(machineId: string, duration: number | null): Promise<string> {
  const durationStr = duration ? duration.toString() : "";
  const input = `${machineId}|${durationStr}|${SECRET_SALT}`;
  return await sha256(input);
}

/**
 * Format hash to license key format
 * Format: XXXX-XXXX-XXXX-XXXX or XXXX-XXXX-XXXX-XXXX-365
 */
function formatHashToKey(hash: string, duration: number | null): string {
  // Take first 16 characters (4 groups of 4)
  const keyPart = hash.substring(0, 16);
  const formatted = `${keyPart.substring(0, 4)}-${keyPart.substring(4, 8)}-${keyPart.substring(8, 12)}-${keyPart.substring(12, 16)}`;
  
  if (duration) {
    return `${formatted}-${duration}`;
  }
  
  return formatted;
}

/**
 * Parse license key to extract duration
 * Returns: { baseKey: string, duration: number | null }
 */
function parseLicenseKey(key: string): { baseKey: string; duration: number | null } {
  const parts = key.split("-");
  
  if (parts.length === 5) {
    // Format: XXXX-XXXX-XXXX-XXXX-365
    const duration = parseInt(parts[4], 10);
    if (isNaN(duration) || duration <= 0) {
      throw new Error("Invalid duration in license key");
    }
    return {
      baseKey: parts.slice(0, 4).join("-"),
      duration: duration
    };
  } else if (parts.length === 4) {
    // Format: XXXX-XXXX-XXXX-XXXX (permanent)
    return {
      baseKey: key,
      duration: null
    };
  } else {
    throw new Error("Invalid license key format");
  }
}

/**
 * Validate license key
 * Returns: { valid: boolean, type: LicenseType, duration: number | null }
 */
export async function validateLicenseKey(key: string): Promise<{
  valid: boolean;
  type: LicenseType;
  duration: number | null;
}> {
  try {
    // Normalize key: remove spaces, convert to uppercase
    const normalizedKey = key.trim().toUpperCase().replace(/\s+/g, "");
    const machineId = getOrCreateMachineId();
    const { baseKey, duration } = parseLicenseKey(normalizedKey);
    
    // Generate expected hash
    const expectedHash = await generateExpectedHash(machineId, duration);
    const expectedKey = formatHashToKey(expectedHash, duration);
    
    // Compare base key (first 4 groups)
    const expectedBaseKey = expectedKey.split("-").slice(0, 4).join("-");
    
    if (baseKey.toUpperCase() === expectedBaseKey.toUpperCase()) {
      return {
        valid: true,
        type: duration ? "temporary" : "permanent",
        duration: duration
      };
    }
    
    return {
      valid: false,
      type: "permanent",
      duration: null
    };
  } catch (error) {
    console.error("License validation error:", error);
    return {
      valid: false,
      type: "permanent",
      duration: null
    };
  }
}

/**
 * Activate license key
 */
export async function activateLicense(key: string): Promise<{
  success: boolean;
  message: string;
  licenseInfo?: LicenseInfo;
}> {
  const validation = await validateLicenseKey(key);
  
  if (!validation.valid) {
    return {
      success: false,
      message: "License key không hợp lệ. Vui lòng kiểm tra lại."
    };
  }
  
  const now = Date.now();
  let expiryDate: number | null = null;
  
  if (validation.type === "temporary" && validation.duration) {
    // Calculate expiry date (duration in days)
    expiryDate = now + (validation.duration * 24 * 60 * 60 * 1000);
  }
  
  const licenseInfo: LicenseInfo = {
    key: key.toUpperCase(),
    type: validation.type,
    expiryDate: expiryDate,
    activatedAt: now
  };
  
  // Save to localStorage
  localStorage.setItem(LICENSE_KEY_STORAGE, licenseInfo.key);
  localStorage.setItem(LICENSE_TYPE_STORAGE, licenseInfo.type);
  localStorage.setItem("NTA_LICENSE_ACTIVATED_AT", now.toString());
  if (expiryDate) {
    localStorage.setItem(LICENSE_EXPIRY_STORAGE, expiryDate.toString());
  } else {
    localStorage.removeItem(LICENSE_EXPIRY_STORAGE);
  }
  
  return {
    success: true,
    message: validation.type === "permanent" 
      ? "Kích hoạt bản quyền vĩnh viễn thành công!" 
      : `Kích hoạt bản quyền thành công! Hạn sử dụng: ${validation.duration} ngày.`,
    licenseInfo
  };
}

/**
 * Get current license info from localStorage
 */
export function getLicenseInfo(): LicenseInfo | null {
  const key = localStorage.getItem(LICENSE_KEY_STORAGE);
  if (!key) {
    return null;
  }
  
  const type = localStorage.getItem(LICENSE_TYPE_STORAGE) as LicenseType;
  const expiryStr = localStorage.getItem(LICENSE_EXPIRY_STORAGE);
  
  const expiryDate = expiryStr ? parseInt(expiryStr, 10) : null;
  
  // Check if expired
  if (expiryDate && Date.now() > expiryDate) {
    // License expired, clear it
    clearLicense();
    return null;
  }
  
  const activatedAtStr = localStorage.getItem("NTA_LICENSE_ACTIVATED_AT");
  const activatedAt = activatedAtStr ? parseInt(activatedAtStr, 10) : Date.now();
  
  return {
    key,
    type: type || "permanent",
    expiryDate,
    activatedAt
  };
}

/**
 * Check if license is valid and not expired
 */
export function isLicenseValid(): boolean {
  const license = getLicenseInfo();
  if (!license) {
    return false;
  }
  
  if (license.type === "temporary" && license.expiryDate) {
    return Date.now() < license.expiryDate;
  }
  
  return true;
}

/**
 * Clear license from localStorage
 */
export function clearLicense(): void {
  localStorage.removeItem(LICENSE_KEY_STORAGE);
  localStorage.removeItem(LICENSE_TYPE_STORAGE);
  localStorage.removeItem(LICENSE_EXPIRY_STORAGE);
  localStorage.removeItem("NTA_LICENSE_ACTIVATED_AT");
}

/**
 * Get remaining time in milliseconds
 */
export function getRemainingTime(): number | null {
  const license = getLicenseInfo();
  if (!license || !license.expiryDate) {
    return null;
  }
  
  const remaining = license.expiryDate - Date.now();
  return remaining > 0 ? remaining : 0;
}

