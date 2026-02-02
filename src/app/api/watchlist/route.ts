import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

async function getUserIdFromSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    return user?.id || null;
  }
  return null;
}

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const tmdbId = searchParams.get("tmdbId");
    const type = searchParams.get("type");

    if (tmdbId && type) {
      const item = await prisma.watchlistItem.findFirst({
        where: { userId, tmdbId: String(tmdbId), type: String(type) },
      });
      return NextResponse.json({ isInWatchlist: !!item?.inWatchlist, item });
    }

    const fullWatchlist = await prisma.watchlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(fullWatchlist);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { tmdbId, type, title, posterPath, voteAverage } = body;

    const newItem = await prisma.watchlistItem.upsert({
      where: {
        userId_tmdbId_type: { userId, tmdbId: String(tmdbId), type }
      },
      update: {
        inWatchlist: true // Als het item al bestond (als 'watched'), activeer nu de watchlist status
      },
      create: {
        userId,
        tmdbId: String(tmdbId),
        type,
        title,
        posterPath,
        voteAverage: voteAverage ? parseFloat(voteAverage) : null,
        inWatchlist: true
      },
    });

    return NextResponse.json(newItem);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { tmdbId, type, isWatched, watchedEpisodes, inWatchlist, title, posterPath, voteAverage } = body;

    // Gebruik UPSERT: Maak het item aan als het nog niet bestaat (bijv. direct op 'watched' klikken)
    const updatedItem = await prisma.watchlistItem.upsert({
      where: {
        userId_tmdbId_type: { userId, tmdbId: String(tmdbId), type },
      },
      update: {
        isWatched: isWatched !== undefined ? isWatched : undefined,
        watchedEpisodes: watchedEpisodes !== undefined ? watchedEpisodes : undefined,
        inWatchlist: inWatchlist !== undefined ? inWatchlist : undefined,
      },
      create: {
        userId,
        tmdbId: String(tmdbId),
        type,
        title: title || "Unknown",
        posterPath: posterPath || null,
        voteAverage: voteAverage ? parseFloat(voteAverage) : null,
        isWatched: isWatched || false,
        watchedEpisodes: watchedEpisodes || [],
        inWatchlist: inWatchlist || false, // Belangrijk: standaard false als je alleen 'watched' toggelt
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("PATCH_ERROR:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const userId = await getUserIdFromSession();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const tmdbId = searchParams.get("tmdbId");
    const type = searchParams.get("type");

    if (!tmdbId || !type) return NextResponse.json({ error: "Missing params" }, { status: 400 });

    await prisma.watchlistItem.delete({
      where: {
        userId_tmdbId_type: { userId, tmdbId: String(tmdbId), type },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove item" }, { status: 500 });
  }
}