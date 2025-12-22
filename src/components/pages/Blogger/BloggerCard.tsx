import { Link } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import type { SpotifyArtist } from "@/types/artist";

type SellerCardProps = {
  artist?: SpotifyArtist;
};

export function BloggerCard({ artist }: SellerCardProps) {
  if (!artist) return null;

  const cover =
    artist.images?.find((img) => img.width >= 640)?.url ||
    artist.images?.[0]?.url;

  return (
    <Card className="h-full p-0">
      <Link to={`/bloggers/${artist.id}`} className="block h-full">
        <CardContent className="p-0 relative group h-full">
          <div className="relative h-70 sm:h-110 md:h-90 w-full overflow-hidden rounded-md">
            {cover && (
              <img
                src={cover}
                alt={artist.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 hover:cursor-pointer"
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/25 to-transparent" />
            <span className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 w-full px-3 text-center text-lg font-medium leading-tight text-white drop-shadow">
              {artist.name}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
