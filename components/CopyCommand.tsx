"use client";

import { useState } from "react";

/** One-line terminal command with a copy button for the download card. */
export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (older browsers, file:// contexts): the command is
      // selectable text, so the user can copy manually.
    }
  }

  return (
    <div className="install-command">
      <span className="prompt" aria-hidden="true">$</span>
      <code>{command}</code>
      <button type="button" onClick={copy} aria-label="Copy install command">
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
