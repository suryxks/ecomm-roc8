/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Resend } from "resend";
import { env } from "~/env";

const resend = new Resend(env.NEXT_PUBLIC_RESEND_API_KEY);
type EmailSchema = {
  to: string;
  subject: string;
  text: string;
};
export async function sendEmail({ to, subject, text }: EmailSchema) {
  const response = await resend.emails.send({
    from: "send@skillhive.in",
    to: [to],
    subject: subject,
    text: text,
    headers: {
      "X-Entity-Ref-ID": "123456789",
    },
  });
  return response;
}
