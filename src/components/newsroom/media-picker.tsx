"use client";

import { useState } from "react";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";

export function MediaPicker() {
  const { language } = useSitePreferences();
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  return (
    <div className="grid gap-4">
      <div>
        <label className="eyebrow mb-2 block" htmlFor="newsroom-media">
          <LocalizedText ne="तस्बिर वा भिडियो छान्नुहोस्" />
        </label>
        <input
          className="field"
          id="newsroom-media"
          accept="image/*,video/*"
          onChange={(event) => {
            setFile(event.target.files?.[0] ?? null);
            setMessage("");
          }}
          type="file"
        />
      </div>
      {file ? (
        <p
          className="border border-[var(--rule)] bg-[var(--paper-raised)] p-3 text-sm"
          role="status"
        >
          <LocalizedText ne="स्थानीय फाइल छानियो:" /> <strong>{file.name}</strong> ·{" "}
          {new Intl.NumberFormat(language).format(file.size)}{" "}
          <LocalizedText ne="बाइट। फाइल अपलोड गरिएको छैन।" />
        </p>
      ) : (
        <p className="text-sm text-[var(--ink-soft)]">
          <LocalizedText ne="फाइल प्रकार/आकार सीमा र अधिकार नीति तय भएपछि मात्र वास्तविक अपलोड जोडिनेछ।" />
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          className="button-primary"
          disabled={!file}
          onClick={() => setMessage("Cloudinary जोडिएको छैन; कुनै फाइल अपलोड वा बाहिर पठाइएको छैन।")}
          type="button"
        >
          <LocalizedText ne="अपलोड नमुना" />
        </button>
        <button
          className="button-secondary"
          disabled={!file}
          onClick={() => {
            setFile(null);
            setMessage("स्थानीय चयन हटाइयो।");
          }}
          type="button"
        >
          <LocalizedText ne="चयन हटाउनुहोस्" />
        </button>
      </div>
      {message ? (
        <p className="text-sm font-bold" role="status">
          <LocalizedText ne={message} />
        </p>
      ) : null}
    </div>
  );
}
