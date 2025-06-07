import type { RequestHandler } from "@builder.io/qwik-city";

export const onGet: RequestHandler = async (requestEvent) => {
  throw requestEvent.error(404, "Page not found! 😞");
};
