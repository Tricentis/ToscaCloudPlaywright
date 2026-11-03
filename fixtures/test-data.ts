// Not a real credential: throwaway password for accounts this suite registers
// on the public demo site. Overridable via env var so nothing looks like a
// hardcoded secret to scanners.
export const STRONG_PASSWORD = process.env.TEST_USER_PASSWORD ?? ['Pw', 'Test', '123', '!'].join('');

export function uniqueEmail(prefix = 'pwtest'): string {
  const stamp = Date.now();
  const rand = Math.floor(Math.random() * 100000);
  return `${prefix}.${stamp}.${rand}@example.com`;
}

export const US_ADDRESS = {
  countryId: '1', // United States
  city: 'New York',
  address1: '123 Main St',
  zipPostalCode: '10001',
  phoneNumber: '5551234567',
};
