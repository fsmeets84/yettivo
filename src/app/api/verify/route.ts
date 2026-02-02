import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  // Consistentie: redirect naar je nieuwe auth pad
  const baseUrl = req.url;

  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin?status=error", baseUrl));
  }

  try {
    // 1. Zoek de token op in de database
    const existingToken = await prisma.verificationToken.findUnique({
      where: { token }
    });

    if (!existingToken) {
      return NextResponse.redirect(new URL("/auth/signin?status=invalid_token", baseUrl));
    }

    // 2. Check of de token is verlopen
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      // Verwijder verlopen token om database schoon te houden
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.redirect(new URL("/auth/signin?status=expired", baseUrl));
    }

    // 3. Update de gebruiker: markeer email als geverifieerd
    await prisma.user.update({
      where: { email: existingToken.identifier },
      data: { 
        emailVerified: new Date(),
      }
    });

    // 4. Verwijder de gebruikte token (beveiliging: single use)
    await prisma.verificationToken.delete({
      where: { token }
    });

    // 5. Redirect naar de signin pagina met de 'verified' status
    // De LoginContent component pikt deze 'status' op om de groene melding te tonen
    return NextResponse.redirect(new URL("/auth/signin?status=verified", baseUrl));

  } catch (error) {
    console.error("VERIFICATION_ERROR:", error);
    return NextResponse.redirect(new URL("/auth/signin?status=error", baseUrl));
  }
}