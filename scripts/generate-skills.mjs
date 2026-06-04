import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const distDir = join(root, "dist");

function parse(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error("missing frontmatter");
  const name = m[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
  const description = m[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
  if (!name) throw new Error("missing name");
  if (!description) throw new Error("missing description");
  return { name, description, body: m[2].trim() };
}

// Every file in a skill dir except its SKILL.md, recursively → { relPath: content }.
function collectFiles(dir) {
  const out = {};
  const walk = (d) => {
    for (const entry of readdirSync(d, { withFileTypes: true })) {
      const full = join(d, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (!(d === dir && entry.name === "SKILL.md")) {
        out[relative(dir, full)] = readFileSync(full, "utf-8");
      }
    }
  };
  walk(dir);
  return out;
}

const folders = readdirSync(skillsDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

const skills = [];
for (const folder of folders) {
  const parsed = parse(readFileSync(join(skillsDir, folder, "SKILL.md"), "utf-8"));
  if (parsed.name !== folder) {
    throw new Error(`${folder}/SKILL.md: name "${parsed.name}" does not match folder`);
  }
  const files = collectFiles(join(skillsDir, folder));
  skills.push(Object.keys(files).length ? { ...parsed, files } : parsed);
}

mkdirSync(distDir, { recursive: true });
writeFileSync(
  join(distDir, "skills.js"),
  `// AUTO-GENERATED — run: npm run build\nexport const skills = ${JSON.stringify(skills, null, 2)};\n`,
  "utf-8",
);
writeFileSync(
  join(distDir, "skills.d.ts"),
  [
    "export interface PackagedSkill {",
    "  name: string;",
    "  description: string;",
    "  body: string;",
    "  files?: Record<string, string>;",
    "}",
    "export declare const skills: PackagedSkill[];",
    "",
  ].join("\n"),
  "utf-8",
);
console.log(`Generated dist/skills.js with ${skills.length} skill(s): ${skills.map((s) => s.name).join(", ")}`);
