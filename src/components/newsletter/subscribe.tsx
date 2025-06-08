import { component$ } from "@builder.io/qwik";

export const Subscribe = component$(() => {
  return (
    <div class="d-flex w-100 justify-content-center">
      <form
        class="d-flex flex-column justify-content-center align-items-center border rounded-4"
        style={{ height: "220px", width: "320px" }}
      >
        <div class="mb-4 primary-color">
          <label for="subscribeControlInput1" class="form-label mb-3">
            Newsletter
          </label>
          <input
            type="email"
            class="form-control border bg-transparent text-light"
            id="subscribeControlInput1"
            placeholder="name@example.com"
          />
        </div>
        <div>
          <button
            class="btn btn-outline-light"
            role="button"
            style={{ "--bs-btn-padding-x": "2.5rem", width: "250px" }}
          >
            Subscribe
          </button>
        </div>
      </form>
    </div>
  );
});
