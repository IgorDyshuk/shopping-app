import { Link, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  ExternalLink,
  Facebook,
  Send,
  Youtube,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { useArtistInfo } from "@/hooks/api-hooks/useArtists";
import { Button } from "@/components/ui/button";
import Category from "./Category";

function BloggerPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation("common");
  const { data: artist, isLoading, isError } = useArtistInfo(id || undefined);

  if (!id) {
    return <Navigate to="/bloggers" replace />;
  }

  const cover =
    artist?.images?.find((img) => img.width >= 640)?.url ||
    artist?.images?.[0]?.url;
  const spotifyUrl = artist?.external_urls?.spotify;
  const searchQuery = encodeURIComponent(artist?.name ?? "");

  return (
    <section className="w-full my-18 xl:my-19">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">{t("breadcrumb.home")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/bloggers">
                {t("nav.bloggersTrigger", { ns: "common" })}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{artist?.name ?? "Blogger"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-4 flex flex-col gap-0">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">{t("search.loading")}</p>
        ) : isError || !artist ? (
          <p className="text-destructive text-sm">
            {t("error", { ns: "home", defaultValue: "Error loading blogger" })}
          </p>
        ) : (
          <>
            <Card className="overflow-hidden py-0">
              <CardContent className="p-0 relative">
                <div className="relative h-55 sm:h-90 md:h-110 w-full overflow-hidden bg-black">
                  {cover && (
                    <div
                      className="pointer-events-none absolute inset-0 blur-3xl scale-125 opacity-60"
                      style={{
                        backgroundImage: `url(${cover})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                  )}
                  {cover && (
                    <img
                      src={cover}
                      alt={artist.name}
                      className="relative mx-auto h-full w-auto object-contain"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />
                  <div className="pointer-events-none absolute bottom-3 md:bottom-4 left-3 md:left-4 text-white drop-shadow space-y-1">
                    <div className="flex items-start gap-0.5 sm:gap-1">
                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
                        {artist.name}
                      </h1>
                      <CheckCircle2 className="size-3.5 sm:size-5 text-primary drop-shadow" />
                    </div>
                    {artist.followers?.total && (
                      <p className="text-xs sm:text-sm text-white/80">
                        {new Intl.NumberFormat().format(artist.followers.total)}{" "}
                        followers
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="px-1 border-none py-2 sm:py-5">
              <CardContent className="px-0 space-y-4 flex flex-col sm:flex-row justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm ">
                      {artist.genres?.length
                        ? artist.genres.join(", ")
                        : "No description yet."}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {spotifyUrl && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <a href={spotifyUrl} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-4" />
                        Spotify
                      </a>
                    </Button>
                  )}
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a
                      href={`https://www.youtube.com/results?search_query=${searchQuery}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Youtube className="size-4" />
                      YouTube
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a
                      href={`https://www.facebook.com/search/top/?q=${searchQuery}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Facebook className="size-4" />
                      Facebook
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="gap-2">
                    <a
                      href={`https://t.me/s/${searchQuery}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Send className="size-4" />
                      Telegram
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* <Separator /> */}
            <Category presetCategory="clothing" />
          </>
        )}
      </div>
    </section>
  );
}

export default BloggerPage;
