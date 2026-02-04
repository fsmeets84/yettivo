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
      orderBy: { 
        updatedAt: "desc" // Prisma herkent dit nu na de 'generate' stap
      },
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
        inWatchlist: true,
        updatedAt: new Date() // Vernieuw tijdstempel bij opnieuw toevoegen
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
    const { 
      tmdbId, 
      type, 
      isWatched, 
      watchedEpisodes, 
      inWatchlist, 
      inProgress, 
      title, 
      posterPath, 
      voteAverage 
    } = body;

    const updatedItem = await prisma.watchlistItem.upsert({
      where: {
        userId_tmdbId_type: { userId, tmdbId: String(tmdbId), type },
      },
      update: {
        // Gebruik de expliciete boolean check
        isWatched: typeof isWatched === "boolean" ? isWatched : undefined,
        watchedEpisodes: watchedEpisodes !== undefined ? watchedEpisodes : undefined,
        inWatchlist: typeof inWatchlist === "boolean" ? inWatchlist : undefined,
        inProgress: typeof inProgress === "boolean" ? inProgress : undefined, 
        
        // Update metadata ALTIJD als het wordt meegestuurd (voorkomt Unknown)
        title: title || undefined,
        posterPath: posterPath || undefined,
        voteAverage: voteAverage ? parseFloat(voteAverage) : undefined,
        
        updatedAt: new Date(), 
      },
      create: {
        userId,
        tmdbId: String(tmdbId),
        type,
        title: title || "Classified Signal", // Iets betere fallback dan Unknown
        posterPath: posterPath || null,
        voteAverage: voteAverage ? parseFloat(voteAverage) : null,
        isWatched: isWatched || false,
        watchedEpisodes: watchedEpisodes || [],
        inWatchlist: inWatchlist || false,
        inProgress: inProgress || false,
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