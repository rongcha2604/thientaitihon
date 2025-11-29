import { useState, useEffect, useCallback } from "react";
import {
  getLicenseInfo,
  isLicenseValid,
  activateLicense,
  clearLicense,
  getOrCreateMachineId,
  getRemainingTime,
  type LicenseInfo
} from "../lib/license";

export function useLicense() {
  const [license, setLicense] = useState<LicenseInfo | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [machineId, setMachineId] = useState<string>("");

  // Check license on mount and when needed
  const checkLicense = useCallback(() => {
    setIsChecking(true);
    const machine = getOrCreateMachineId();
    setMachineId(machine);
    
    if (isLicenseValid()) {
      const info = getLicenseInfo();
      setLicense(info);
    } else {
      // License expired or invalid, clear it
      clearLicense();
      setLicense(null);
    }
    setIsChecking(false);
  }, []);

  useEffect(() => {
    checkLicense();
    
    // Check license validity periodically (every minute)
    const interval = setInterval(() => {
      if (!isLicenseValid()) {
        clearLicense();
        setLicense(null);
      }
    }, 60000);
    
    return () => clearInterval(interval);
  }, [checkLicense]);

  const activate = useCallback(async (key: string) => {
    const result = await activateLicense(key);
    if (result.success && result.licenseInfo) {
      setLicense(result.licenseInfo);
      // Force re-check
      checkLicense();
    }
    return result;
  }, [checkLicense]);

  const deactivate = useCallback(() => {
    clearLicense();
    setLicense(null);
    checkLicense();
  }, [checkLicense]);

  return {
    license,
    isChecking,
    machineId,
    isActivated: license !== null,
    activate,
    deactivate,
    refresh: checkLicense
  };
}

