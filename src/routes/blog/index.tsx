import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      Blog
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
