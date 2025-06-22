import {
  component$,
  useSignal,
  useResource$,
  Resource,
} from "@builder.io/qwik";
import {
  routeLoader$,
  server$,
  Link,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { getBlogs, getProjects, getTags } from "~/util/db";

export const usePosts = routeLoader$(async () => {
  // Fetch blog data
  const blogs = await getBlogs(1);
  return blogs;
});

export const useTags = routeLoader$(async () => {
  // Fetch blog data
  const tags = await getTags();
  return tags;
});

export const loadProjects = server$(async function (tag: number = -1) {
  // Fetch blog data
  // Using server$ because this will run multiple times
  const projects = await getProjects(tag);
  return projects;
});

export default component$(() => {
  const selecTag = useSignal(-1);
  const posts = usePosts();
  const tags = useTags();

  const projectsResource = useResource$(async ({ track }) => {
    track(() => selecTag.value); // Re-run when selecTag.value changes

    // Fetch projects
    const projects = await loadProjects(selecTag.value);
    return projects;
  });

  return (
    <>
      <div
        id="home-p1"
        class="d-flex flex-column vh-100 container-fluid mt-2 p-5"
      >
        {/* Introduction */}
        <div
          id="introduction"
          class="d-flex gap-5 flex-row justify-content-evenly align-items-center h-75"
        >
          {/* Description | Latest Posts */}
          <div
            id="description"
            class="d-flex flex-column"
            style={{ maxWidth: "500px" }}
          >
            {/* Description */}
            <div class="mb-2">
              {/* Hello Message */}
              <span class="terciary-color">Hey, I’m Rofly António</span>
            </div>

            <div class="mb-2">
              {/* Role */}
              <span class="primary-color">
                Software Engineer | AI Enthusiast
              </span>
            </div>

            <div class="mb-3">
              <span class="secondary-color text-break">
                {/* First Description */}
                Passionate about building intelligent solutions and developer
                tools. I thrive at the intersection of innovation and usability,
                designing systems that are both powerful and intuitive.
              </span>
            </div>

            <div class="mb-5">
              {/* Second Description */}
              <span class="secondary-color text-break">
                With a strong foundation in full-stack development and a growing
                focus on AI integration, I enjoy solving complex problems,
                automating workflows, and pushing the boundaries of what
                software can do. Always learning, always building, driven by
                curiosity and a desire to make technology more human-centered.
              </span>
            </div>

            <div class="mt-3">
              {/* Contact Me Button */}
              <Link
                href="/contact"
                class="btn btn-outline-light"
                role="button"
                style={{ "--bs-btn-padding-x": "2.5rem" }}
              >
                Contact Me
              </Link>
            </div>
          </div>

          <div id="latest-posts" class="d-flex flex-column ">
            {/* Latest posts */}
            <div class="mb-3">
              <span class="primary-color">Latest Post</span>
            </div>

            {/* Posts Container */}
            <div
              class="h-100 border-start border-white ps-3"
              style={{ maxWidth: "300px" }}
            >
              {/* Latest 3 Posts */}
              {posts.value.map((post) => (
                <Link
                  key={post.id}
                  class="d-flex flex-row mb-5 link-underline link-underline-opacity-0"
                  href={`/blog/${post.id}`}
                >
                  <div>
                    <span
                      class="secondary-color"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                  <div class="ms-4">
                    <div>
                      <span class="terciary-color">{post.title}</span>
                    </div>
                    <div>
                      <span
                        class="secondary-color"
                        style={{ fontSize: "0.8rem" }}
                      >
                        {post.short_description}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div class="d-flex flex-row justify-content-center mt-4">
          {/* Scroll Down */}
          <Link
            id="scroll"
            class="d-inline-flex gap-3 link-underline link-underline-opacity-0"
            href="/#Projects"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="currentColor"
              class="bi bi-arrow-down-circle terciary-color"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z"
              />
            </svg>
            <span class="primary-color" id="Projects">
              Scroll
            </span>
          </Link>
        </div>
      </div>

      {/* Projects */}
      <div
        id="home-p2"
        class="container d-flex justify-content-center min-vh-100"
      >
        <div class="container mx-5">
          <div class="mb-4">
            <span class="primary-color">Projects</span>
          </div>
          {/* Filter */}
          <div class="mb-1">
            <div class="row gap-3">
              <button
                class={
                  "col-4 col-md-2 col-xxl-1 btn btn-outline-light" +
                  (selecTag.value == -1 ? " active" : "")
                }
                onClick$={() => (selecTag.value = -1)}
                style={{ "--bs-btn-padding-y": "0.1rem" }}
              >
                All
              </button>

              {tags.value.map((tag) => (
                <button
                  key={tag.id}
                  class={
                    "col-4 col-md-2 col-xxl-1 btn btn-outline-light" +
                    (selecTag.value == tag.id ? " active" : "")
                  }
                  onClick$={() => (selecTag.value = tag.id)}
                  style={{ "--bs-btn-padding-y": "0.1rem" }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
          <div class="ps-2">
            <span class="secondary-color" style={{ fontSize: "0.8rem" }}>
              Select tag
            </span>
          </div>
          <div class="mt-5 mb-5 grid-layout">
            {/* Projects */}
            <Resource
              value={projectsResource}
              onPending={() => <p>Loading projects...</p>}
              onRejected={(error) => (
                <p>Error loading projects: {error.message}</p>
              )}
              onResolved={(projects) => (
                <>
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      class="card bg-transparent border ps-3 pt-3"
                      style={{ width: "220px", height: "150px" }}
                    >
                      <Link
                        class="terciary-color link-underline link-underline-opacity-0"
                        href={project.url}
                      >
                        {project.title}
                      </Link>
                      <span class="secondary-color">
                        {project.short_description}
                      </span>
                      {project.blog_id && (
                        <Link
                          class="mt-2 primary-color link-underline link-underline-opacity-0"
                          href={`/blog/${project.blog_id}`}
                        >
                          Read Blog
                        </Link>
                      )}
                    </div>
                  ))}
                </>
              )}
            />
          </div>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = {
  title: "ItsRofly",
  meta: [
    {
      name: "description",
      content:
        "The personal site of Rofly António – Software Engineer and AI Enthusiast. Discover projects, tools, and insights at the intersection of code and intelligence.",
    },
  ],
};
