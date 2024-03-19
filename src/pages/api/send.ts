/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { NextApiRequest, NextApiResponse } from "next";
// import { EmailTemplate } from "../../components/EmailTemplate";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const body = JSON.parse(req.body);

  const { data, error } = await resend.emails.send({
    from: "surya@skillhive.in",
    to: [body.to],
    subject: body.subject,
    text: body.text,
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.status(200).json(data);
}
