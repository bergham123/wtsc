// src/schedule.js
import { githubGetFile, githubPutFile } from './github.js';
import { jsonResponse, getWorkflowPath } from './helpers.js';

export function extractCron(yamlText) {
  if (!yamlText) return null;
  const match = yamlText.match(/cron\s*:\s*['"]?([^'"\n]+)['"]?/);
  return match ? match[1].trim() : null;
}

export function hasSchedule(yamlText) {
  if (!yamlText) return false;
  return /^\s*schedule:/m.test(yamlText);
}

export function setCron(yamlText, newCron) {
  if (!yamlText || yamlText.trim() === "") {
    return "on:\n  schedule:\n    - cron: '" + newCron + "'\n  workflow_dispatch:";
  }

  const lines = yamlText.split("\n");
  let onIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*on:/.test(lines[i])) { onIndex = i; break; }
  }

  if (onIndex === -1) {
    return "on:\n  schedule:\n    - cron: '" + newCron + "'\n  workflow_dispatch:\n" + yamlText;
  }

  if (hasSchedule(yamlText)) {
    const cronRegex = /(cron\s*:\s*)['"]?([^'"\n]*)['"]?/;
    if (cronRegex.test(yamlText)) {
      return yamlText.replace(cronRegex, "$1'" + newCron + "'");
    } else {
      const scheduleIndex = lines.findIndex(line => /^\s*schedule:/.test(line));
      if (scheduleIndex !== -1) {
        lines.splice(scheduleIndex + 1, 0, "    - cron: '" + newCron + "'");
        return lines.join("\n");
      }
      return yamlText.replace(/on:/, "on:\n  schedule:\n    - cron: '" + newCron + "'");
    }
  } else {
    const afterOn = lines.slice(onIndex + 1);
    const indent = "  ";
    const newLines = [
      ...lines.slice(0, onIndex + 1),
      indent + "schedule:",
      indent + "  - cron: '" + newCron + "'",
      ...afterOn
    ];
    return newLines.join("\n");
  }
}

export async function handleLoadSchedule(request, env) {
  try {
    const { content, exists } = await githubGetFile(env, getWorkflowPath(env));
    if (!exists || !content) return jsonResponse({ ok: true, cron: null, hasSchedule: false });
    const cron = extractCron(content);
    const hasSched = hasSchedule(content);
    return jsonResponse({ ok: true, cron: cron, hasSchedule: hasSched });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

export async function handleSaveSchedule(request, env) {
  try {
    const body = await request.json();
    const { action, cron } = body;
    const path = getWorkflowPath(env);
    const current = await githubGetFile(env, path);
    let yamlContent = current.content || "";
    
    if (action === 'remove') {
      return jsonResponse({ ok: false, error: "Remove action not supported" }, 400);
    } else if (action === 'add' || action === 'update') {
      if (!cron || !/^\S+\s+\S+\s+\S+\s+\S+\s+\S+$/.test(cron)) {
        return jsonResponse({ ok: false, error: "cron must have 5 space-separated fields" }, 400);
      }
      yamlContent = setCron(yamlContent, cron);
    } else {
      return jsonResponse({ ok: false, error: "Invalid action" }, 400);
    }
    
    const result = await githubPutFile(env, path, yamlContent, current.sha, "Update schedule via web editor");
    return jsonResponse({ ok: true, commit: result.commit && result.commit.sha });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}
