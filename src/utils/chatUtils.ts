export function formatDuration(sec: number) {
  const m = Math.floor(sec / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export function parseContent(raw: any): { type: string; [k: string]: any } {
  if (!raw) return { type: "text", text: "" };
  if (typeof raw === "string") {
    try {
      const p = JSON.parse(raw);
      if (p && typeof p === "object") return p;
    } catch {}
    return { type: "text", text: raw };
  }
  return typeof raw === "object" ? raw : { type: "text", text: String(raw) };
}
