import type { Manifest, SubjectBundle, Level } from "../types";

/** Luôn lấy bản mới, tránh cache cũ */
export async function loadManifest(): Promise<Manifest> {
  const res = await fetch("/manifest.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load manifest: ${res.status}`);
  
  // Check Content-Type để đảm bảo là JSON
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    // Clone response để read text mà không consume body
    const clonedRes = res.clone();
    const text = await clonedRes.text();
    if (text.trim().startsWith("<!doctype") || text.trim().startsWith("<!DOCTYPE")) {
      throw new Error(`Expected JSON but received HTML (404 page?). URL: /manifest.json`);
    }
    throw new Error(`Expected JSON but received ${contentType}. URL: /manifest.json`);
  }
  
  return res.json();
}

/** Lấy đúng 1 cấp độ (easy/medium/hard) theo path */
export async function loadSubjectByLevel(path: string): Promise<SubjectBundle> {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load subject: ${res.status} ${path}`);
  
  // Check Content-Type để đảm bảo là JSON
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    // Clone response để read text mà không consume body
    const clonedRes = res.clone();
    const text = await clonedRes.text();
    if (text.trim().startsWith("<!doctype") || text.trim().startsWith("<!DOCTYPE")) {
      throw new Error(`Expected JSON but received HTML (404 page?). URL: ${path}`);
    }
    throw new Error(`Expected JSON but received ${contentType}. URL: ${path}`);
  }
  
  const data = await res.json();
  const ok = !!(data?.meta?.grade && data?.meta?.subject && data?.meta?.language && data?.meta?.created_date);
  if (!ok) throw new Error(`No valid file with meta in ${path}`);
  return data;
}

/** Gộp nhiều path (3 cấp độ) → 1 bundle (nếu bạn không dùng dropdown cấp độ) */
export async function loadSubjectMerge(paths: string[]): Promise<SubjectBundle> {
  const bundles = await Promise.all(paths.map(p => loadSubjectByLevel(p)));
  const first = bundles[0];
  const topics = bundles.flatMap(b => b.topics ?? []);
  return {
    meta: first.meta,
    topics
  };
}

/** Lấy path theo level index */
export function pickPathByLevel(paths: string[], level: Level): string {
  const map: Record<Level, number> = { easy: 0, medium: 1, hard: 2 };
  return paths[map[level]];
}
