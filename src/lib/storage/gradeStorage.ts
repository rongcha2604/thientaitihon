/**
 * Helper functions để lưu/đọc stars, coins, spirit pets theo từng lớp
 * Mỗi lớp có bộ sưu tập riêng để tránh abuse (đổi lớp để kiếm sao nhanh)
 */

/**
 * Lấy stars từ lớp cụ thể
 */
export const getStarsForGrade = (grade: number): number => {
  const key = `user_stars_grade_${grade}`;
  const stored = localStorage.getItem(key);
  return stored !== null ? parseInt(stored, 10) : 0;
};

/**
 * Lưu stars cho lớp cụ thể
 */
export const setStarsForGrade = (grade: number, amount: number): void => {
  const key = `user_stars_grade_${grade}`;
  localStorage.setItem(key, amount.toString());
};

/**
 * Thêm stars cho lớp cụ thể
 */
export const addStarsForGrade = (grade: number, amount: number): number => {
  const current = getStarsForGrade(grade);
  const newAmount = current + amount;
  setStarsForGrade(grade, newAmount);
  return newAmount;
};

/**
 * Lấy coins từ lớp cụ thể
 */
export const getCoinsForGrade = (grade: number): number => {
  const key = `user_coins_grade_${grade}`;
  const stored = localStorage.getItem(key);
  return stored !== null ? parseInt(stored, 10) : 100; // Default 100 coins
};

/**
 * Lưu coins cho lớp cụ thể
 */
export const setCoinsForGrade = (grade: number, amount: number): void => {
  const key = `user_coins_grade_${grade}`;
  localStorage.setItem(key, amount.toString());
};

/**
 * Thêm coins cho lớp cụ thể
 */
export const addCoinsForGrade = (grade: number, amount: number): number => {
  const current = getCoinsForGrade(grade);
  const newAmount = current + amount;
  setCoinsForGrade(grade, newAmount);
  return newAmount;
};

/**
 * Lấy spirit pets từ lớp cụ thể
 */
export const getSpiritPetsForGrade = (userId: string | null, grade: number): any[] => {
  const userKey = userId || 'guest';
  const key = `user_spirit_pets_${userKey}_grade_${grade}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing spirit pets:', error);
      return [];
    }
  }
  return [];
};

/**
 * Lưu spirit pets cho lớp cụ thể
 */
export const setSpiritPetsForGrade = (userId: string | null, grade: number, pets: any[]): void => {
  const userKey = userId || 'guest';
  const key = `user_spirit_pets_${userKey}_grade_${grade}`;
  localStorage.setItem(key, JSON.stringify(pets));
};

/**
 * Lấy grade hiện tại từ localStorage
 */
export const getCurrentGrade = (): number => {
  const stored = localStorage.getItem('selectedGrade');
  return stored !== null ? parseInt(stored, 10) : 1; // Default lớp 1
};

/**
 * Lưu grade hiện tại vào localStorage
 */
export const setCurrentGrade = (grade: number): void => {
  localStorage.setItem('selectedGrade', grade.toString());
};

/**
 * Reset tất cả dữ liệu khi đổi lớp (nếu cần)
 * Note: Không cần reset vì mỗi lớp đã có storage riêng
 */
export const resetGradeData = (grade: number): void => {
  // Không cần reset vì mỗi lớp đã có storage riêng
  // Chỉ cần load từ lớp mới là được
  console.log(`[GradeStorage] Loading data for grade ${grade}`);
};

