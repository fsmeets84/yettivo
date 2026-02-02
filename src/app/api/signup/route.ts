import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend"; // Importeer Resend

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, username, password, name } = await req.json();

    // 1. Basis Validatie
    if (!email || !password || !username) {
      return NextResponse.json(
        { error: "Missing required fields." }, 
        { status: 400 }
      );
    }

    // 2. Uniekheids-check (Email & Username)
    const userExists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] }
    });

    if (userExists) {
      const message = userExists.email === email ? "Email already in use." : "Username already taken.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    // 3. Wachtwoord hashing
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Gebruiker aanmaken
    const user = await prisma.user.create({
      data: {
        email,
        username,
        name: name || null,
        password: hashedPassword,
      },
    });

    // 5. Token genereren
    const token = Buffer.from(Math.random().toString()).toString('base64').substring(0, 32);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: token,
        expires: expires,
      },
    });

    // 6. Verificatie URL bouwen
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    const host = req.headers.get("host");
    const verificationUrl = `${protocol}://${host}/api/verify?token=${token}`;

    // 7. VERZENDEN VIA RESEND
    try {
      await resend.emails.send({
        from: 'Yettivo Archive <onboarding@resend.dev>', // Gebruik je eigen domein als je die hebt gekoppeld in Resend
        to: email,
        subject: 'Verify your Yettivo Archive access',
        html: `
          <div style="font-family: sans-serif; background-color: #0a0a0c; color: #ffffff; padding: 40px; border-radius: 8px;">
            <h1 style="color: #3b82f6; font-size: 24px; font-weight: 800; letter-spacing: -0.05em;">Yettivo</h1>
            <p style="color: #a1a1aa; font-size: 14px;">Welcome to the archive, <strong>${username}</strong>.</p>
            <p style="color: #a1a1aa; font-size: 14px; margin-bottom: 30px;">To initialize your access and start tracking your watchlist, please verify your account by clicking the button below.</p>
            <a href="${verificationUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 12px 24px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Verify Account</a>
            <p style="color: #52525b; font-size: 10px; margin-top: 40px; border-top: 1px solid #1f1f23; pt-20">This link expires in 24 hours. If you did not create this account, you can safely ignore this email.</p>
          </div>
        `
      });
    } catch (mailError) {
      console.error("Resend failed to send email:", mailError);
      // We printen de link nog steeds in de terminal als fallback voor jou als developer
      console.log("Fallback link:", verificationUrl);
    }

    return NextResponse.json(
      { message: "Account created! Please check your email to verify." }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTRATION_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}