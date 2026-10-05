"use client";

import { useState, type FormEvent } from "react";

export function CorrectionForm() {
  const [message, setMessage] = useState("");
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("सुधार अभिलेख नमुना पृष्ठमा मात्र देखाइएको छ; कुनै सार्वजनिक समाचार परिवर्तन भएको छैन।");
  }
  return (
    <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="eyebrow mb-2 block" htmlFor="correction-text">
          सुधार सूचना <span aria-hidden="true">*</span>
        </label>
        <textarea className="field min-h-24" id="correction-text" required />
      </div>
      <div>
        <label className="eyebrow mb-2 block" htmlFor="correction-reason">
          सुधारको कारण <span aria-hidden="true">*</span>
        </label>
        <textarea className="field min-h-20" id="correction-reason" required />
      </div>
      <div>
        <label className="eyebrow mb-2 block" htmlFor="correction-time">
          सुधार समय
        </label>
        <input className="field max-w-sm" id="correction-time" type="datetime-local" />
      </div>
      <button className="button-primary w-fit" type="submit">
        सुधार नमुना अभिलेख गर्नुहोस्
      </button>
      {message ? (
        <p className="state-panel text-sm leading-6" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
