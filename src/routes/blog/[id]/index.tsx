import { component$ } from "@builder.io/qwik";
import { Subscribe } from "~/components/newsletter/subscribe";
import { type DocumentHead, routeLoader$ } from "@builder.io/qwik-city";
import { getBlog } from "~/util/db";
import MarkdownIt from "markdown-it";
import prism from "markdown-it-prism";

export const usePost = routeLoader$(async (requestEvent) => {
  // Fetch post info
  const postId = requestEvent.params.id;
  const blogData = await getBlog(postId);

  if (!blogData) {
    throw requestEvent.error(404, "Blog not found! 😞");
  }
  // Fetch the Markdown content
  const response = await fetch(blogData.content_url);
  const markdownContent = await response.text();

  // Parse subtitles (headings) from Markdown
  const subtitles = markdownContent
    .split("\n")
    .filter((line) => line.startsWith("##")) // Extract lines starting with '##'
    .map((heading) => heading.replace(/^#+\s*/, "").trim()); // Remove '#' and trim spaces

  // Custom renderer to add id to headings
  const md = new MarkdownIt();
  md.use(prism);

  // Save original fence rule
  const defaultFenceRender =
    md.renderer.rules.fence ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    // Default rendering
    const originalHTML = defaultFenceRender(tokens, idx, options, env, self);

    // Add a copy button
    const copyButton = `
      <button
        class="copy-code-button"
        onclick="
          navigator.clipboard.writeText(this.parentElement.querySelector('code').innerText);
          const btn = this;
          const originalColor = btn.style.backgroundColor;
          btn.style.backgroundColor = '#333'; // Clicked color
          btn.innerText = 'Copied!';
          setTimeout(() => {
            btn.style.backgroundColor = originalColor;
            btn.innerText = 'Copy';
          }, 1000); // Revert after 1 second
        "
        style="position: absolute; bottom: 5px; right: 5px; z-index: 1; background-color: #555; color: white; border: none; padding: 5px 8px; border-radius: 3px; cursor: pointer; visibility: hidden;"
      >
        Copy
      </button>
    `;

    // Wrap the original HTML and add the button
    // Adding relative positioning to the wrapper to allow absolute positioning of the button
    // Add mouseenter/mouseleave to show/hide the button
    return `<div
              style="position: relative;"
              onmouseenter="this.querySelector('.copy-code-button').style.visibility = 'visible';"
              onmouseleave="this.querySelector('.copy-code-button').style.visibility = 'hidden';"
            >${originalHTML}${copyButton}</div>`;
  };

  const defaultRender =
    md.renderer.rules.heading_open ||
    function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

  md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    if (token.tag === "h2") {
      const textToken = tokens[idx + 1];
      const id = textToken.content.replace(/\s+/g, "-");
      token.attrSet("id", id);
      token.attrSet("class", "mb-4 mt-5");
    } else {
      token.attrSet("class", "mb-4 mt-4");
    }
    return defaultRender(tokens, idx, options, env, self);
  };

  return {
    blog: blogData,
    content: md.render(markdownContent),
    subtitles: subtitles,
  };
});

export default component$(() => {
  const post = usePost();

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(date);
  };

  return (
    <>
      <div class="d-flex justify-content-center mt-5 p-5">
        <div class="d-flex justify-content-center w-100">
          <div class="d-flex flex-row">
            <div id="blog-content" class="d-flex flex-column gap-3 container">
              <span class="terciary-color">{post.value.blog.title}</span>
              <span class="secondary-color">
                {formatDate(post.value.blog.date)} |{" "}
                {post.value.blog.short_description}
              </span>
              <div
                class="mt-5 text-white text-break"
                id="markdown"
                style={{
                  "max-width": "calc(100vw - 500px)",
                  minWidth: "0",
                }}
                dangerouslySetInnerHTML={post.value.content}
              ></div>
              <div class="mt-5">
                <Subscribe />
              </div>
            </div>

            <div
              id="blog-sub"
              class="p-5"
              style={{
                minWidth: "100px",
                position: "sticky",
                top: "80px",
                alignSelf: "flex-start",
                height: "calc(100vh - 100px)",
                overflowY: "auto",
              }}
            >
              {post.value.subtitles.map((subtitle, index) => (
                <a
                  key={index}
                  class="d-flex flex-row link-underline link-underline-opacity-0"
                  href={`#${subtitle.replace(/\s+/g, "-")}`}
                >
                  <div>
                    <span
                      class="secondary-color"
                      style={{ fontSize: "0.8rem" }}
                    >
                      {subtitle}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const post = resolveValue(usePost);
  return {
    title: post.blog.title,
    meta: [
      {
        name: "description",
        content: post.blog.short_description,
      },
    ],
  };
};
