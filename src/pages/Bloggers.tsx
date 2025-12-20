import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useTopArtists } from "@/hooks/api-hooks/useArtists";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BloggerSkeleton from "@/components/pages/Creator/BloggersSkeleton";
import { BloggerCard } from "@/components/pages/Creator/BloggerCard";

const TOP_ARTIST_IDS = [
  "3TVXtAsR1Inumwj472S9r4", // Drake
  "1Xyo4u8uXC1ZmMpatF05PJ", // The Weeknd
  "66CXW7JJDKx0p3fFuLLYz8", // Ariana Grande
  "06HL4z0CvFAxyc27GXpf02", // Taylor Swift
  "7dGJo4pcD2V6oG8kP0tJRR", // Eminem
  "246dkjvS1zLTtiykXe5h60", // Post Malone
  "6eUKZXaKkcviH0Ku9w2n3V", // Ed Sheeran
  "4q3ewBCX7sLwd24euuV69X", // Bad Bunny
  "6qqNVTkY8uBg9cP3Jd7DAH", // Billie Eilish
  "1McMsnEElThX1knmY4oliG", // Olivia Rodrigo
  "6KImCVD70vtIoJWnq6nGn3", // Harry Styles
  "6M2wZ9GZgrQXHCFfjv46we", // Dua Lipa
  "53XhwfbYqKCa1cC15pYq2q", // Imagine Dragons
  "3Nrfpe0tUJi4K4DXYWgMUX", // BTS
  "2YZyLoL8N0Wb9xBt1NhZWg", // Kendrick Lamar
  "5pKCCKE2ajJHZ9KAiaK11H", // Rihanna
];

function BloggersPage() {
  const {
    data: topArtists,
    isLoading,
    isError,
    isFetching,
    isPlaceholderData,
  } = useTopArtists(TOP_ARTIST_IDS);
  const { t } = useTranslation("common");

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
            <BreadcrumbLink>{t("sidebar.main.bloggers")}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="mt-3 xl:mt-4 flex w-full flex-col gap-3 xl:gap-4">
        <h1 className="text-3xl font-semibold">
          {t("nav.bloggers.all.title", { defaultValue: "Bloggers" })}
        </h1>

        {isLoading ||
        ((!topArtists || topArtists.length === 0) &&
          (isFetching || isPlaceholderData)) ? (
          <BloggerSkeleton />
        ) : isError ? (
          <p className="text-destructive text-sm">
            {t("error", { ns: "home" })}
          </p>
        ) : (
          <div className="grid w-full gap-4 sm:gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {topArtists?.map((artist, idx) => (
              <BloggerCard key={artist?.id ?? idx} artist={artist} />
            ))}
          </div>
        )}
      </div>

      {/* <pre className="max-h-[480px] overflow-auto rounded bg-muted p-3 text-xs leading-relaxed">
        {JSON.stringify(topArtists, null, 2)}
      </pre> */}
    </section>
  );
}

export default BloggersPage;
