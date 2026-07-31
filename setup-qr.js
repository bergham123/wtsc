#!/usr/bin/env node
/**
 * One-time setup: Scan WhatsApp QR code and save session
 * Run this once locally: `node setup-qr.js`
 * Then commit the session/ folder to git
 * After that, GitHub Actions will use the cached session (no QR needed)
 */

import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode-terminal";
import fs from "fs-extra";
import path from "path";

const SESSION_DIR = "./session";
const SESSION_NAME = "main";

console.log("📱 WhatsApp Session Setup");
console.log("=".repeat(40));
console.log("This will generate a QR code for you to scan.");
console.log("After scanning, your session will be saved locally.");
console.log("=".repeat(40));
console.log("");

async function setupQR() {
    // Ensure session directory exists
    await fs.ensureDir(SESSION_DIR);

    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: SESSION_NAME,
            dataPath: SESSION_DIR,
            restartOnAuthFail: true,
        }),
        puppeteer: {
            headless: 'new',
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
            ],
        },
    });

    let qrScanned = false;

    client.on("qr", (qr) => {
        console.log("\n🔐 SCAN THIS QR CODE WITH YOUR PHONE:\n");
        qrcode.generate(qr, { small: false });
        console.log("\n⏳ Waiting for you to scan...\n");
    });

    client.on("ready", async () => {
        console.log("\n✅ SUCCESS! WhatsApp authenticated!");
        console.log("📁 Session saved to: ./session/main/\n");
        console.log("Next steps:");
        console.log("1. Commit session folder to git: git add session/ && git commit -m 'init: add whatsapp session'");
        console.log("2. Push to GitHub: git push");
        console.log("3. Run GitHub Actions workflow - it will use your cached session (no QR needed)\n");
        
        await client.destroy();
        process.exit(0);
    });

    client.on("auth_failure", (msg) => {
        console.error(`\n❌ Auth failed: ${msg}`);
        console.log("Try again: node setup-qr.js\n");
        process.exit(1);
    });

    client.on("disconnected", (reason) => {
        console.error(`\n❌ Disconnected: ${reason}`);
        process.exit(1);
    });

    try {
        console.log("🔧 Initializing WhatsApp client...\n");
        await client.initialize();
    } catch (err) {
        console.error(`\n💥 Initialization failed: ${err.message}`);
        console.log("Make sure Chromium is installed.\n");
        process.exit(1);
    }
}

setupQR().catch((err) => {
    console.error("Fatal error:", err.message);
    process.exit(1);
});
