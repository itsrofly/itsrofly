import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <>
      404 Not Found
    </>
  );
});

export const head: DocumentHead = {
  title: "ItsRofly",
  meta: [
    {
      name: "description",
      content: "Not Found",
    },
  ],
};
