import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <div class="container-fluid d-flex justify-content-center">
        <div class="mt-5 mb-5">
        <div class="mb-3">
          <span class="primary-color">Blog</span>
        </div>

        <div class="border-start d-flex flex-column gap-4 ps-5">
          <a class="d-flex flex-row mb-5 link-underline link-underline-opacity-0" href="/blog/id">
            <div>
              <span class="secondary-color" style={{ fontSize: "0.8rem" }}>June 01, 2004</span>
            </div>
            <div class="ms-4">
              <div>
                <span class="terciary-color">Title</span>
              </div>
              <div>
                <span class="secondary-color" style={{ fontSize: "0.8rem" }}>Short Description</span>
              </div>
            </div>
          </a>

          <a class="d-flex flex-row mb-5 link-underline link-underline-opacity-0" href="/blog/id">
            <div>
              <span class="secondary-color" style={{ fontSize: "0.8rem" }}>June 01, 2004</span>
            </div>
            <div class="ms-4">
              <div>
                <span class="terciary-color">Title</span>
              </div>
              <div>
                <span class="secondary-color" style={{ fontSize: "0.8rem" }}>Short Description</span>
              </div>
            </div>
          </a>

          <a class="d-flex flex-row mb-5 link-underline link-underline-opacity-0" href="/blog/id">
            <div>
              <span class="secondary-color" style={{ fontSize: "0.8rem" }}>June 01, 2004</span>
            </div>
            <div class="ms-4">
              <div>
                <span class="terciary-color">Title</span>
              </div>
              <div>
                <span class="secondary-color" style={{ fontSize: "0.8rem" }}>Short Description</span>
              </div>
            </div>
          </a>
        </div>
        </div>

      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "ItsRofly | Blog",
  meta: [
    {
      name: "description",
      content: "Rofly's blog",
    },
  ],
};
