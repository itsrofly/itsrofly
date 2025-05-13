import { component$ } from "@builder.io/qwik";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getBlogs } from "~/tools";

export const usePosts = routeLoader$(async () => {
  // Fetch blog data
  const blogs = getBlogs();
  return blogs;
});


export default component$(() => {
  const posts = usePosts();

  return (
    <>
      <div class="container-fluid d-flex justify-content-center">
        <div class="mt-5 mb-5">
        <div class="mb-3">
          <span class="primary-color">Blog</span>
        </div>

        <div class="border-start d-flex flex-column gap-4 ps-5">
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
