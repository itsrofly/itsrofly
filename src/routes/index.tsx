import { component$, useSignal, useResource$, Resource } from "@builder.io/qwik";
import { routeAction$, routeLoader$, server$, type DocumentHead } from "@builder.io/qwik-city";
import { getBlogs, getProjects, getTags } from "~/tools";

export const usePosts = routeLoader$(async () => {
  // Fetch blog data
  const blogs = getBlogs(3);
  return blogs;
});

export const useTags = routeLoader$(async () => {
  // Fetch blog data
  const tags = getTags();
  return tags;
});

export const useGetProjects = server$(
  function (tag: number = -1) {
  // Fetch blog data
  const projects = getProjects(tag)
  return projects;  
  }
);
 

export default component$(() => {
  const selecTag = useSignal(-1);
  const posts = usePosts();
  const tags = useTags();

  const projectsResource = useResource$(async ({ track }) => {
    track(() => selecTag.value); // Re-run when selecTag.value changes

    // Fetch projects
    // The server$ function useGetProjects will be awaited here
    const projects = await useGetProjects(selecTag.value);
    return projects;
  });

  return (
    <>
      <div id="home-p1" class="d-flex flex-column vh-100 container-fluid mt-2 ">
        {/* Introduction */}
        <div id="introduction" class="d-flex flex-row justify-content-evenly align-items-center h-75">
          {/* Description | Latest Posts */}
          <div id="description" class="d-flex flex-column" style={{ maxWidth: "500px" }} >
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

          <div id="latest-posts" class="d-flex flex-column ">
            {/* Latest posts */}
            <div class="mb-3">
              <span class="primary-color">Latest Posts</span>
            </div>

            {/* Posts Container */}
            <div class="h-100 border-start border-white ps-3">
              {/* Latest 3 Posts */}
              {posts.value.map((post) => (
                <a
                  key={post.ID}
                  class="d-flex flex-row mb-5 link-underline link-underline-opacity-0"
                  href={`/blog/${post.ID}`}
                >
                  <div>
                    <span class="secondary-color" style={{ fontSize: "0.8rem" }}>
                      {new Date(post.Date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "2-digit",
                      })}
                    </span>
                  </div>
                  <div class="ms-4">
                    <div>
                      <span class="terciary-color">{post.Title}</span>
                    </div>
                    <div>
                      <span class="secondary-color" style={{ fontSize: "0.8rem" }}>
                        {post.Short_Description}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>

        <div class="d-flex flex-row justify-content-around mt-4">
          {/* Scroll Down */}
          <a id="scroll" class="d-inline-flex gap-3 link-underline link-underline-opacity-0" href="/#Projects">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-arrow-down-circle terciary-color" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
            </svg>
            <span class="primary-color" id="Projects">Scroll</span>
          </a>
          <div style={{ color: "#242424" }}>©ItsRofly. All Rights Reserved.</div>
        </div>
      </div>

      {/* Projects */}
      <div id="home-p2" class="container d-flex justify-content-center min-vh-100">
        <div class="container mx-5">
          <div class="mb-4">
            <span class="primary-color">Projects</span>
          </div>
          {/* Filter */}
          <div class="mb-1">
            <div class="row gap-3">

              <button class={"col-4 col-md-2 col-xxl-1 btn btn-outline-light" + (selecTag.value == 0 ? " active" : "")} onClick$={() => selecTag.value = -1}
                style={{ "--bs-btn-padding-y": "0.1rem" }}>All</button>

              {tags.value.map((tag) => (
                <button key={tag.ID} class={"col-4 col-md-2 col-xxl-1 btn btn-outline-light" + (selecTag.value == tag.ID ? " active" : "")} onClick$={() => selecTag.value = tag.ID}
                  style={{ "--bs-btn-padding-y": "0.1rem" }}>{tag.Name}</button>
              ))}
            </div>
          </div>
          <div class="ps-2">
            <span class="secondary-color" style={{ fontSize: "0.8rem" }}>Select tag</span>
          </div>
          <div class="mt-5 mb-5 grid-layout">
            {/* Projects */}
            <Resource
              value={projectsResource}
              onPending={() => <p>Loading projects...</p>}
              onRejected={(error) => <p>Error loading projects: {error.message}</p>}
              onResolved={(projects) => (
                <>
                  {projects.map((project) => (
                    <div key={project.ID} class="card bg-transparent border ps-3 pt-3" style={{ width: "220px", height: "150px" }}>
                      <a class="terciary-color link-underline link-underline-opacity-0" href={project.URL}>{project.Title}</a>
                      <span class="secondary-color">{project.Short_Description}</span>
                      {project.Blog_ID && <a class="mt-2 primary-color link-underline link-underline-opacity-0" href={`/blog/${project.Blog_ID}`}>Read Blog</a>}
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
      content: "ItsRofly Website",
    },
  ],
};
