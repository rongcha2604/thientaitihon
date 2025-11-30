/**
 * License Key System - NTA-Security-v1
 * 
 * Secret Salt: "PHUC_HOI_ANH_CU_SECRET_SAUCE_v1.0"
 * Algorithm: SHA-256(MachineID + "|" + [Duration hoặc rỗng] + "|" + Salt)
 * Format: XXXX-XXXX-XXXX-XXXX (Vĩnh viễn) hoặc XXXX-XXXX-XXXX-XXXX-365 (Có thời hạn)
 */

const SECRET_SALT = "PHUC_HOI_ANH_CU_SECRET_SAUCE_v1.0";
const MACHINE_ID_KEY = "license_machine_id";
const LICENSE_KEY = "license_key";
const LICENSE_EXPIRY_KEY = "license_expiry";

/**
 * Generate or retrieve Machine ID from localStorage
 * Format: WEB-XXXX-XXXX
 */
export function getMachineId(): string {
  let machineId = localStorage.getItem(MACHINE_ID_KEY);
  
  if (!machineId) {
    // Generate new Machine ID
    const randomPart1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomPart2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    machineId = `WEB-${randomPart1}-${randomPart2}`;
    localStorage.setItem(MACHINE_ID_KEY, machineId);
  }
  
  return machineId;
}

/**
 * Calculate SHA-256 hash
 */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.toUpperCase();
}

/**
 * Generate expected hash for a given Machine ID and duration
 */
async function generateExpectedHash(machineId: string, duration?: number): Promise<string> {
  const durationStr = duration ? duration.toString() : '';
  const input = `${machineId}|${durationStr}|${SECRET_SALT}`;
  return await sha256(input);
}

/**
 * Format hash to license key format
 * XXXX-XXXX-XXXX-XXXX or XXXX-XXXX-XXXX-XXXX-365
 */
function formatLicenseKey(hash: string, duration?: number): string {
  // Take first 16 characters and format as XXXX-XXXX-XXXX-XXXX
  const keyPart = hash.substring(0, 16).match(/.{1,4}/g)?.join('-') || hash.substring(0, 16);
  
  if (duration) {
    return `${keyPart}-${duration}`;
  }
  
  return keyPart;
}

/**
 * Parse license key to extract hash and duration
 */
function parseLicenseKey(key: string): { hash: string; duration?: number } {
  const parts = key.split('-');
  
  if (parts.length === 5) {
    // Has duration: XXXX-XXXX-XXXX-XXXX-365
    const duration = parseInt(parts[4], 10);
    const hash = parts.slice(0, 4).join('').toUpperCase();
    return { hash, duration };
  } else if (parts.length === 4) {
    // No duration: XXXX-XXXX-XXXX-XXXX
    const hash = parts.join('').toUpperCase();
    return { hash };
  }
  
  throw new Error('Invalid license key format');
}

/**
 * Validate license key
 */
export async function validateLicenseKey(key: string): Promise<{ valid: boolean; duration?: number; expiryDate?: Date }> {
  try {
    const machineId = getMachineId();
    const { hash, duration } = parseLicenseKey(key);
    
    // Generate expected hash
    const expectedHash = await generateExpectedHash(machineId, duration);
    const expectedKeyPart = expectedHash.substring(0, 16);
    
    // Compare
    if (hash === expectedKeyPart) {
      let expiryDate: Date | undefined;
      
      if (duration) {
        // Calculate expiry date
        expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + duration);
      }
      
      return {
        valid: true,
        duration,
        expiryDate,
      };
    }
    
    return { valid: false };
  } catch (error) {
    console.error('Error validating license key:', error);
    return { valid: false };
  }
}

/**
 * Activate license key
 */
export async function activateLicense(key: string): Promise<{ success: boolean; message: string; expiryDate?: Date }> {
  const validation = await validateLicenseKey(key);
  
  if (!validation.valid) {
    return {
      success: false,
      message: 'License key không hợp lệ! Vui lòng kiểm tra lại.',
    };
  }
  
  // Save license
  localStorage.setItem(LICENSE_KEY, key);
  
  if (validation.expiryDate) {
    localStorage.setItem(LICENSE_EXPIRY_KEY, validation.expiryDate.toISOString());
  } else {
    // Permanent license
    localStorage.removeItem(LICENSE_EXPIRY_KEY);
  }
  
  return {
    success: true,
    message: validation.expiryDate
      ? `License đã được kích hoạt! Hết hạn: ${validation.expiryDate.toLocaleDateString('vi-VN')}`
      : 'License vĩnh viễn đã được kích hoạt!',
    expiryDate: validation.expiryDate,
  };
}

/**
 * Check if license is active
 */
export function isLicenseActive(): boolean {
  const key = localStorage.getItem(LICENSE_KEY);
  
  if (!key) {
    return false;
  }
  
  // Check expiry if exists
  const expiryStr = localStorage.getItem(LICENSE_EXPIRY_KEY);
  if (expiryStr) {
    const expiryDate = new Date(expiryStr);
    if (new Date() > expiryDate) {
      // Expired - clear license
      localStorage.removeItem(LICENSE_KEY);
      localStorage.removeItem(LICENSE_EXPIRY_KEY);
      return false;
    }
  }
  
  return true;
}

/**
 * Get license expiry date
 */
export function getLicenseExpiry(): Date | null {
  const expiryStr = localStorage.getItem(LICENSE_EXPIRY_KEY);
  if (expiryStr) {
    return new Date(expiryStr);
  }
  return null; // Permanent license
}

/**
 * Get stored license key (for display purposes)
 */
export function getStoredLicenseKey(): string | null {
  return localStorage.getItem(LICENSE_KEY);
}

/**
 * Clear license (for testing/debugging)
 */
export function clearLicense(): void {
  localStorage.removeItem(LICENSE_KEY);
  localStorage.removeItem(LICENSE_EXPIRY_KEY);
}

