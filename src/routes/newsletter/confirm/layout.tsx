import { component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { verifyToken } from "~/util/db";

export const onGet: RequestHandler = async ({ query, error, env }) => {
  const token = query.get("token");
  const email = query.get("email");
  if (!token || !email) throw error(401, "Invalid or expired token! 😞");
  else if (!(await verifyToken(token)))
    throw error(401, "Invalid or expired token! 😞");

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: env.get("PRIVATE_EMAIL_ACCESS_KEY")!,
    },
    body: JSON.stringify({ email: email }),
  };

  const result = await fetch(
    env.get("PRIVATE_EMAIL_API")! + "/contacts/subscribe",
    options,
  );
  if (!result.ok) throw error(500, "Something has gone wrong!");
  console.error(result.body);
};

export default component$(() => {
  return (
    <div class="text-center mt-5">
      <span class="primary-color">Subscription Confirmed!</span>
      <span class="secondary-color" style={{ fontSize: "0.8rem" }}>
        You can close this page.
      </span>
    </div>
  );
});
