export type Level = "easy" | "medium" | "hard";

export interface Manifest {
  version: string;
  grades: GradeEntry[];
}
export interface GradeEntry {
  grade: number;
  subjects: SubjectEntry[];
}
export interface SubjectEntry {
  id: "math" | "vie" | "eng" | "vietnamese" | "english" | string;
  name_vi?: string;
  name?: string;
  paths: string[]; // [easy, medium, hard]
}

export interface SubjectBundle {
  meta: {
    grade: number;
    subject: string;       // "Toán" | "Tiếng Việt" | "English"
    language: "vi" | "en" | "vi+en";
    created_date: string;
    level?: Level;
  };
  topics: Topic[];
}

export interface Topic {
  id: string;
  name: string;
  difficulty?: Level;
  questions: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string[];         // giữ NGUYÊN THỨ TỰ trong file
  answer_index: number;      // 0..3
  answer_text: string;       // trùng với options[answer_index]
  explanation?: string;      // lời giải
}
