import { getSeasonDetails } from "@/lib/tmdb";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; number: string }> }
) {
  try {
    const { id, number } = await params;
    
    // Controleer of de parameters binnenkomen
    if (!id || !number) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const data = await getSeasonDetails(id, parseInt(number));
    
    if (!data) {
      return NextResponse.json({ error: "No data found from TMDB" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}