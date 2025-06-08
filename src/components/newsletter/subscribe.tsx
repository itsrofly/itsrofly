import { component$, useSignal, $ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";

export const serverEmail = server$(function (email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) {
    return "Check your inbox to confirm your subscription!";
  }
  return "Please provide a valid email address.";
});

export const Subscribe = component$(() => {
  const email = useSignal("");
  const feedback = useSignal("");
  return (
    <div class="d-flex w-100 justify-content-center">
      <div
        class="d-flex flex-column justify-content-center align-items-center border rounded-4"
        style={{ height: "220px", width: "320px" }}
      >
        <div class="mb-3 primary-color">
          <label for="subscribeControlInput1" class="form-label mb-3">
            Newsletter
          </label>
          <input
            type="email"
            bind:value={email}
            onKeyPress$={() => (feedback.value = "")}
            class="form-control border bg-transparent text-light"
            id="subscribeControlInput1"
            placeholder="name@example.com"
            style={{ width: "250px" }}
          />
        </div>
        <div class="mb-2">
          <button
            class="btn btn-outline-light"
            role="button"
            style={{ "--bs-btn-padding-x": "2.5rem", width: "250px" }}
            onClick$={$(async () => {
              feedback.value = await serverEmail(email.value);
            })}
          >
            Subscribe
          </button>
        </div>
        <div class="w-100 text-center ">
          <span class="secondary-color">{feedback.value}</span>
        </div>
      </div>
    </div>
  );
});
