import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <div class="container-fluid d-flex justify-content-center">
        <div class="mt-5 mb-5">
          <div class="mb-3">
            <span class="primary-color">Contact</span>
          </div>

          <div class="border-start d-flex flex-column gap-4 ps-5">
            <div class="mb-4">
              <div class="ms-4">
                <a
                  class="d-flex flex-row link-underline link-underline-opacity-0"
                  href={"mailto:me@itsrofly.com"}
                >
                  <span class="terciary-color">Email</span>
                </a>
                <div>
                  <span class="secondary-color" style={{ fontSize: "0.8rem" }}>
                    me@itsrofly.com
                  </span>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <div class="ms-4">
                <a
                  class="d-flex flex-row link-underline link-underline-opacity-0"
                  href={"https://www.linkedin.com/in/rofly/"}
                >
                  <span class="terciary-color">LinkedIn</span>
                </a>
                <div>
                  <span class="secondary-color" style={{ fontSize: "0.8rem" }}>
                    https://www.linkedin.com/in/rofly/
                  </span>
                </div>
              </div>
            </div>

            <div class="mb-4">
              <div class="ms-4">
                <a
                  class="d-flex flex-row link-underline link-underline-opacity-0"
                  href={"https://github.com/itsrofly"}
                >
                  <span class="terciary-color">Github</span>
                </a>
                <div>
                  <span class="secondary-color" style={{ fontSize: "0.8rem" }}>
                    https://github.com/itsrofly
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "ItsRofly | Contact",
  meta: [
    {
      name: "description",
      content:
        "Thoughts, tutorials, and insights from Rofly António on software engineering, AI, and building smarter tools.",
    },
  ],
};
