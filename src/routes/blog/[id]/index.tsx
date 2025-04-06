import { component$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation, routeLoader$ } from "@builder.io/qwik-city";

export const usePost = routeLoader$(async (requestEvent) => {
  // Fetch post info
  const postId = requestEvent.params.id;
  return {
    title: "Retrieval-Augmented Generation (RAG) System",
    description: "N/A",
    readme: "link",
    date: "June 01, 2004",
    id: postId
  }
});


export default component$(() => {
  const post = usePost()

  return (
    <>
      <div class="container-fluid d-flex justify-content-center mt-5">
        <div class="d-flex justify-content-evenly w-100">
          <div>
            <span class="secondary-color">
              {post.value.date}
            </span>
          </div>

          <div class="d-flex flex-column gap-3">
            <span class="terciary-color">
              {post.value.title}
            </span>
            <span class="secondary-color">
              {post.value.description}
            </span>
            <div class="mt-5" style={{"max-width": "700px !important"}}>
              <span class="text-white text-break" >
                ..................................................................................................................................................................................................
                .................................................................................................
              </span>
            </div>
          </div>

          <div>
            <span class="secondary-color">
              Subtitles
            </span>
          </div>
          
        </div>
      </div>
    </>
  );
});

export const head: DocumentHead = ({ resolveValue }) => {
  const post = resolveValue(usePost)
  return {
    title: post.title,
    meta: [
      {
        name: "description",
        content: post.description,
      },
    ],
  };
};
