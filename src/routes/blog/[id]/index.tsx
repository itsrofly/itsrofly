import { component$ } from "@builder.io/qwik";
import { type DocumentHead, useLocation, routeLoader$ } from "@builder.io/qwik-city";

export const usePost = routeLoader$(async (requestEvent) => {
    // Fetch post info
    const postId = requestEvent.params.id;
    return {
        title: "Retrieval-Augmented Generation (RAG) System",
        description: "N/A",
        id: postId
    }    
  });
 
  
export default component$(() => {
    const loc = useLocation();

    return (
        <>
            Post ID: {loc.params.id}
        </>
    );
});

export const head: DocumentHead = ({resolveValue}) => {
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
