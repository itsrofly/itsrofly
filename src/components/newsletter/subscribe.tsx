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
    this.env.get("PUBLIC_API_URL")! +
    `/newsletter/confirm?token=${await generateToken(email)}&email=${email}`;

  const payload = {
    to: email,
    subject: "Confirm subscription to the blog",
    body: htmlSubscription(url),
    subscribed: false,
    name: this.env.get("PRIVATE_EMAIL_NAME")!,
    from: this.env.get("PRIVATE_EMAIL")!,
    headers: {},
  };

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: this.env.get("PRIVATE_EMAIL_ACCESS_KEY")!,
    },
    body: JSON.stringify(payload),
  };

  const result = await fetch(
    this.env.get("PRIVATE_EMAIL_API")! + "/send",
    options,
  );
  if (!result.ok) return "Something has gone wrong!";
  console.error(result.body);
  return "Confirmation e-mail sent!";
});

export const Subscribe = component$(() => {
  const email = useSignal("");
  const feedback = useSignal("");
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
            onClick$={$(async () => {
              feedback.value = await serverEmail(email.value);
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
  <!doctype html>
  <html
    lang="en"
  >
    <head>
      <title></title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        * {
          box-sizing: border-box;
        }


        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: inherit !important;
        }

        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
        }

        p {
          line-height: inherit;
        }

        .desktop_hide,
        .desktop_hide table {
          mso-hide: all;
          display: none;
          max-height: 0px;
          overflow: hidden;
        }

        .image_block img + div {
          display: none;
        }

        sup,
        sub {
          font-size: 75%;
          line-height: 0;
        }

        @media (max-width: 620px) {
          .desktop_hide table.icons-inner {
            display: inline-block !important;
          }

          .icons-inner {
            text-align: center;
          }

          .icons-inner td {
            margin: 0 auto;
          }

          .mobile_hide {
            display: none;
          }

          .row-content {
            width: 100% !important;
          }

          .stack .column {
            width: 100%;
            display: block;
          }

          .mobile_hide {
            min-height: 0;
            max-height: 0;
            max-width: 0;
            overflow: hidden;
            font-size: 0px;
          }

          .desktop_hide,
          .desktop_hide table {
            display: table !important;
            max-height: none !important;
          }
        }
      </style>
    </head>

    <body
      class="body"
      style="
        background-color: transparent;
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: none;
        text-size-adjust: none;
      "
    >
    <link
      href="https://fonts.googleapis.com/css2?family=Nova+Round&display=swap"
      rel="stylesheet"
    ></link>
      <table
        class="nl-container"
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          border-bottom: 1px solid #242424;
          border-left: 1px solid #242424;
          border-radius: 20px;
          border-right: 1px solid #242424;
          border-top: 1px solid #242424;
          background-color: #242424 !important;
        "
      >
        <tbody>
          <tr>
            <td>
              <table
                class="row row-1"
                align="center"
                width="100%"
                border="0"
                cellpadding="0"
                cellspacing="0"
                role="presentation"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-bottom: 1px solid #242424;
                  border-left: 1px solid #242424;
                  border-radius: 20px;
                  border-right: 1px solid #242424;
                  border-top: 1px solid #242424;
                  font-family: "Nova Round" !important;
                  "
              >
                <tbody>
                  <tr>
                    <td>
                      <table
                        class="row-content stack"
                        align="center"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          background-color: #242424;
                          color: #000000;
                          width: 600px;
                          margin: 0 auto;
                        "
                        width="600"
                      >
                        <tbody>
                          <tr>
                            <td
                              class="column column-1"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                font-weight: 400;
                                text-align: left;
                                padding-bottom: 5px;
                                padding-top: 5px;
                                vertical-align: top;
                              "
                            >
                              <table
                                class="heading_block block-1"
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 15px;
                                      padding-left: 30px;
                                      padding-right: 15px;
                                      padding-top: 15px;
                                      text-align: center;
                                      width: 100%;
                                    "
                                  >
                                    <h1
                                      style="
                                        margin: 0;
                                        color: #837d96;
                                        direction: ltr;

                                        font-size: 32px;
                                        font-weight: 700;
                                        letter-spacing: normal;
                                        line-height: 1.2;
                                        text-align: left;
                                        margin-top: 0;
                                        margin-bottom: 0;
                                        mso-line-height-alt: 38px;
                                      "
                                    >
                                      <span
                                        class="tinyMce-placeholder"
                                        style="word-break: break-word"
                                        ><span
                                          style="
                                            word-break: break-word;
                                            color: #ffffff;
                                          "
                                          >Its</span
                                        ><span
                                          style="
                                            word-break: break-word;
                                            color: #87c9ff;
                                          "
                                          >Rofly</span
                                        ></span
                                      >
                                    </h1>
                                  </td>
                                </tr>
                              </table>
                              <table
                                class="divider_block block-2"
                                width="100%"
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                              >
                                <tr>
                                  <td class="pad">
                                    <div class="alignment" align="center">
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        width="100%"
                                        style="
                                          mso-table-lspace: 0pt;
                                          mso-table-rspace: 0pt;
                                        "
                                      >
                                        <tr>
                                          <td
                                            class="divider_inner"
                                            style="
                                              font-size: 1px;
                                              line-height: 1px;
                                              border-top: 1px solid #dddddd;
                                            "
                                          >
                                            <span style="word-break: break-word"
                                              >&#8202;</span
                                            >
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                class="paragraph_block block-3"
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 20px;
                                      padding-left: 55px;
                                      padding-right: 20px;
                                      padding-top: 20px;
                                    "
                                  >
                                    <div
                                      style="
                                        color: #ffffff;
                                        direction: ltr;

                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 1.2;
                                        text-align: left;
                                        mso-line-height-alt: 19px;
                                      "
                                    >
                                      <p style="margin: 0; margin-bottom: 16px">
                                        Hey,
                                      </p>
                                      <p style="margin: 0">
                                        Let's confirm your subscription, there's
                                        just one more step to make:
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                class="button_block block-4"
                                width="100%"
                                border="0"
                                cellpadding="10"
                                cellspacing="0"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                "
                              >
                                <tr>
                                  <td class="pad">
                                    <div class="alignment" align="center">
                                      <a
                                        class="button"
                                        href="${url}"
                                        style="
                                          background-color: transparent;
                                          border-bottom: 1px solid #87c9ff;
                                          border-left: 1px solid #87c9ff;
                                          border-radius: 4px;
                                          border-right: 1px solid #87c9ff;
                                          border-top: 1px solid #87c9ff;
                                          color: #87c9ff;
                                          display: inline-block;

                                          font-size: 16px;
                                          font-weight: 400;
                                          mso-border-alt: none;
                                          padding-bottom: 5px;
                                          padding-top: 5px;
                                          padding-left: 20px;
                                          padding-right: 20px;
                                          text-align: center;
                                          width: auto;
                                          word-break: keep-all;
                                          letter-spacing: normal;
                                        "
                                        ><span
                                          style="
                                            word-break: break-word;
                                            line-height: 32px;
                                          "
                                          >Confirm subscription</span
                                        >
                                        </a>
                                        >
                                    </div>
                                  </td>
                                </tr>
                              </table>
                              <table
                                class="paragraph_block block-5"
                                width="100%"
                                border="0"
                                cellpadding="0"
                                cellspacing="0"
                                role="presentation"
                                style="
                                  mso-table-lspace: 0pt;
                                  mso-table-rspace: 0pt;
                                  word-break: break-word;
                                "
                              >
                                <tr>
                                  <td
                                    class="pad"
                                    style="
                                      padding-bottom: 20px;
                                      padding-left: 55px;
                                      padding-right: 20px;
                                      padding-top: 20px;
                                    "
                                  >
                                    <div
                                      style="
                                        color: #ffffff;
                                        direction: ltr;

                                        font-size: 16px;
                                        font-weight: 400;
                                        letter-spacing: 0px;
                                        line-height: 1.2;
                                        text-align: left;
                                        mso-line-height-alt: 19px;
                                      "
                                    >
                                      <p style="margin: 0; margin-bottom: 16px">
                                        I ask for this confirmation only once, to
                                        make sure it was really you who sent this
                                        request.&nbsp;
                                      </p>
                                      <p style="margin: 0; margin-bottom: 16px">
                                        Thanks for subscribing!
                                      </p>
                                      <p style="margin: 0">
                                        <span
                                          style="
                                            word-break: break-word;
                                            color: #bebebe;
                                          "
                                          >Sincerely,</span
                                        ><br /><span
                                          style="
                                            word-break: break-word;
                                            color: #bebebe;
                                          "
                                          >Rofly António</span
                                        >
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
`;
