import { component$, useSignal, $ } from "@builder.io/qwik";
import { server$ } from "@builder.io/qwik-city";
import { z } from "zod/v4";
import { generateToken } from "~/util/db";

export const serverEmail = server$(async function (email: string) {
  const emailSchema = z.email({
    pattern: z.regexes.rfc5322Email,
    error: (issue) =>
      issue.input === undefined ? "Email is required!" : "Invalid Email!",
  });

  const validate = emailSchema.safeParse(email);
  if (validate.error) return validate.error.issues[0].message;

  const url =
    this.env.get("PRIVATE_WEBSITE_URL")! +
    `/newsletter/confirm?token=${await generateToken(email)}&email=${email}`;

  const payload = {
    to: email,
    from: this.env.get("PRIVATE_EMAIL")!,
    subject: "Confirm subscription",
    html: htmlSubscription(url),
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.env.get("PRIVATE_EMAIL_ACCESS_KEY")!,
    },
    body: JSON.stringify(payload),
  };

  const result = await fetch(
    this.env.get("PRIVATE_EMAIL_API")! + "/v1/emails",
    options,
  );
  if (!result.ok) return "Please try again later.";
  console.error(result.body);
  return "Confirmation e-mail sent.";
});

export const Subscribe = component$(() => {
  const email = useSignal("");
  const feedback = useSignal("");
  const disableButton = useSignal(false);
  return (
    <div class="d-flex w-100 justify-content-center">
      <div
        class="d-flex flex-column justify-content-center align-items-center border rounded-4"
        style={{ height: "220px", width: "320px" }}
      >
        <div class="mb-3 primary-color">
          <label for="subscribeControlInput1" class="form-label mb-3">
            Newsletter
          </label>
          <input
            type="email"
            bind:value={email}
            onKeyPress$={() => (feedback.value = "")}
            class="form-control border bg-transparent text-light"
            id="subscribeControlInput1"
            placeholder="name@example.com"
            style={{ width: "250px" }}
          />
        </div>
        <div class="mb-2">
          <button
            class="btn btn-outline-light"
            role="button"
            style={{ "--bs-btn-padding-x": "2.5rem", width: "250px" }}
            disabled={disableButton.value}
            onClick$={$(async () => {
              disableButton.value = true;
              feedback.value = await serverEmail(email.value);
              disableButton.value = false;
            })}
          >
            Subscribe
          </button>
        </div>
        <div class="w-100 text-center ">
          <span class="secondary-color">{feedback.value}</span>
        </div>
      </div>
    </div>
  );
});

export const htmlSubscription = (url: string) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Confirm Subscription</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* Prevent webmail clients from adding unwanted spacing */
        body, table, td, a {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table {
          border-collapse: collapse !important;
        }
        body {
          margin: 0;
          padding: 0;
          width: 100% !important;
          height: 100% !important;
        }
      </style>
    </head>
    <body style="margin:0;padding:0;background:#ffffff;font-family:proxima-nova,'helvetica neue',helvetica,arial,geneva,sans-serif;color:#4c4c4c;font-size:15px;line-height:150%">
      <table width="100%" style="height:100%;background:#ffffff;font-family:inherit;color:inherit;font-size:inherit;line-height:inherit">
        <tr>
          <td align="center">
            <table width="600" style="background:#ffffff;margin:40px 0;font-family:inherit;color:inherit;font-size:inherit;line-height:inherit">
              <tr>
                <td style="padding:0 40px">
                  <table width="100%" style="background:#ffffff;font-family:inherit;color:inherit;font-size:inherit;line-height:inherit">
                    <tr>
                      <td align="left" style="padding:0">
                        <p style="margin:20px 0">
                          Thanks for subscribing! You must follow this link within 30 minutes to confirm your subscription:
                        </p>
                        <p style="margin:20px 0">
                          <a href="${url}" style="color:#87c9ff" target="_blank">
                          ${url.length > 39 ? url.slice(0, 39) + "..." : url}
                          </a>
                        </p>
                        <p style="margin:20px 0">
                          Have a good reading, and don't hesitate to contact me with your feedback.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:0 40px">
                  <table width="100%" style="border-top:1px solid #ebeaef;background:#ffffff;font-family:inherit;color:inherit;font-size:inherit;line-height:inherit">
                    <tr>
                      <td align="left" style="padding:0">
                        <p style="margin:20px 0">
                          Sincerely,<br>
                          Rofly António
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>

`;
