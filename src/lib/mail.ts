import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/api/verify?token=${token}`;

  await resend.emails.send({
    from: "Yettivo <onboarding@resend.dev>", // Gebruik je eigen domein in productie
    to: email,
    subject: "Verify your Yettivo account",
    html: `
      <div style="font-family: sans-serif; background: #0a0a0c; color: #fff; padding: 20px;">
        <h1 style="color: #3b82f6;">Welcome to Yettivo</h1>
        <p>Click the button below to verify your email address and activate your archive access.</p>
        <a href="${confirmLink}" style="background: #3b82f6; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 2px; font-weight: bold; display: inline-block;">
          Verify Email
        </a>
        <p style="font-size: 12px; color: #555; margin-top: 20px;">If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `
  });
};