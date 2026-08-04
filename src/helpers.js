// src/helpers.js

export function ghHeaders(env) {
  const token = env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set in Cloudflare secrets");
  return {
    "Authorization": "Bearer " + token,
    "Accept": "application/vnd.github.v3+json",
    "User-Agent": "Cloudflare-Worker/1.0"
  };
}

export function utf8ToBase64(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary);
  }
}

export function base64ToUtf8(b64) {
  try {
    return decodeURIComponent(escape(atob(b64)));
  } catch (e) {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
}

export function jsonResponse(data, status) {
  if (status === undefined) status = 200;
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    }
  });
}

export function getPath(env, type) {
  if (type === "messages") return env.MESSAGES_PATH || "data/message.json";
  if (type === "contacts") return env.CONTACTS_PATH || "data/accounts.json";
  if (type === "images") return env.IMAGES_LIST_PATH || "data/images.json";
  throw new Error("Unknown file type: " + type);
}

export function getImagesDir(env) {
  return env.IMAGES_DIR || "images";
}

export function getImagesListPath(env) {
  return env.IMAGES_LIST_PATH || "data/images.json";
}

export function getWorkflowPath(env) {
  return ".github/workflows/" + (env.WORKFLOW_FILE || "send.yaml");
}

export function linesToJsonArray(text) {
  if (!text || !text.trim()) return "[]";
  var lines = text.split("\n").map(function(l) { return l.trim(); }).filter(function(l) { return l.length > 0; });
  return JSON.stringify(lines, null, 2);
}

export function jsonToLines(content) {
  if (!content) return "";
  try {
    var arr = JSON.parse(content);
    if (Array.isArray(arr)) return arr.join("\n");
  } catch (e) {}
  return content;
}
