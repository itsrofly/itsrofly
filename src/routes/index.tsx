import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      <div class="d-flex flex-column v-100 vh-100">
        {/* Introduction */}
        <div class="d-flex flex-row justify-content-evenly align-items-center h-75 mt-5">
          {/* Description | Latest Posts */}
          <div class="d-flex flex-column" style={{ maxWidth: "500px" }} >
            {/* Description */}
            <div class="mb-2">
              {/* Hello Message */}
              <span class="terciary-color">Hey, I’m Rofly António</span>
            </div>

            <div class="mb-2">
              {/* Role */}
              <span class="primary-color">AI + Software Engineer</span>
            </div>

            <div class="mb-3">
              <span class="secondary-color text-break">
                {/* First Description */}
                .................................................................................................................................................................................................................................................................................................
              </span>
            </div>

            <div class="mb-5">
              {/* Second Description */}
              <span class="secondary-color text-break">
                .................................................................................................................................................................................................................................................................................................
              </span>
            </div>

            <div class="mt-3">
              {/* Contact Me Button */}
              <a href="mailto:contact@itsrofly.com" class="btn btn-outline-light" role="button" style={{ "--bs-btn-padding-x": "2.5rem" }}>Contact Me</a>
            </div>
          </div>

          <div class="d-flex flex-column">
            {/* Latest posts */}
            <div class="mb-3">
              <span class="primary-color">Latest Posts</span>
            </div>

            {/* Posts Container */}
            <div class="h-100 border-start border-white ps-3">
              {/* Latest 3 Posts */}
              <div class="d-flex flex-row mb-5">
                <div>
                  <span class="secondary-color" style={{fontSize: "0.8rem"}}>June 01, 2004</span>
                  </div>
                <div class="ms-4">
                  <div>
                    <span class="terciary-color">Title</span>
                  </div>
                  <div>
                    <span class="secondary-color"  style={{fontSize: "0.8rem"}}>Short Description</span>
                  </div>
                </div>
              </div>

              <div class="d-flex flex-row mb-5">
                <div>
                  <span class="secondary-color" style={{fontSize: "0.8rem"}}>June 01, 2004</span>
                  </div>
                <div class="ms-4">
                  <div>
                    <span class="terciary-color">Title</span>
                  </div>
                  <div>
                    <span class="secondary-color"  style={{fontSize: "0.8rem"}}>Short Description</span>
                  </div>
                </div>
              </div>

              <div class="d-flex flex-row mb-5">
                <div>
                  <span class="secondary-color" style={{fontSize: "0.8rem"}}>June 01, 2004</span>
                  </div>
                <div class="ms-4">
                  <div>
                    <span class="terciary-color">Title</span>
                  </div>
                  <div>
                    <span class="secondary-color"  style={{fontSize: "0.8rem"}}>Short Description</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div class="d-flex flex-row justify-content-around mt-5">
          {/* Scroll Down */}
          <div class="d-inline-flex gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-arrow-down-circle terciary-color" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
            </svg>
            <span class="primary-color">Scroll</span>
          </div>
          <div style={{color: "#242424"}}>©ItsRofly. All Rights Reserved.</div>
        </div>
      </div>
      <div class="vh-100 v-100 text-white">
        Projects
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "ItsRofly",
  meta: [
    {
      name: "description",
      content: "ItsRofly Website",
    },
  ],
};
