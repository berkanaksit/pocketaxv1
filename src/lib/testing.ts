import dayjs from 'dayjs';

// Testing bypass configuration
const BYPASS_EXPIRY = '2025-05-05'; // Expiry date for the bypass
const BYPASS_CODE = 'TEST_BYPASS_2025'; // Secure bypass code

interface BypassAttempt {
  timestamp: string;
  success: boolean;
  environment: string;
}

export function isTestingBypassEnabled(): boolean {
  if (import.meta.env.MODE !== 'development') {
    return false;
  }

  const expiryDate = dayjs(BYPASS_EXPIRY);
  if (dayjs().isAfter(expiryDate)) {
    return false;
  }

  return true;
}

export function validateBypassCode(code: string): boolean {
  if (!isTestingBypassEnabled()) {
    return false;
  }

  const isValid = code === BYPASS_CODE;

  // Log the bypass attempt
  const attempt: BypassAttempt = {
    timestamp: new Date().toISOString(),
    success: isValid,
    environment: import.meta.env.MODE
  };

  console.log('[TEST BYPASS ATTEMPT]', attempt);

  return isValid;
}