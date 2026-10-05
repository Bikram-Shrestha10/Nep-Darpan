"use client";

import { useState, type FormEvent } from "react";

export function SignInForm() {
  const [message, setMessage] = useState("");
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("पूर्वावलोकनमा कुनै खाता प्रमाणित हुँदैन; कसैलाई साइन इन गरिएको छैन।");
  }

  return (
    <form className="grid max-w-xl gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="eyebrow mb-2 block" htmlFor="staff-email">
          इमेल
        </label>
        <input
          className="field"
          autoComplete="username"
          id="staff-email"
          name="email"
          type="email"
          required
        />
      </div>
      <div>
        <label className="eyebrow mb-2 block" htmlFor="staff-password">
          पासवर्ड
        </label>
        <input
          className="field"
          autoComplete="current-password"
          id="staff-password"
          name="password"
          type="password"
          minLength={8}
          required
        />
      </div>
      <button className="button-primary w-fit" type="submit">
        साइन इन प्रयास गर्नुहोस्
      </button>
      {message ? (
        <p className="state-panel text-sm leading-6" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
