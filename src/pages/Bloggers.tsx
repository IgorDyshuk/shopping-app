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
import BloggerSkeleton from "@/components/pages/Blogger/BloggersSkeleton";
import { BloggerCard } from "@/components/pages/Blogger/BloggerCard";
import { TOP_BLOGGER_IDS } from "@/constants/blogger-ids";

function BloggersPage() {
  const {
    data: topArtists,
    isLoading,
    isError,
    isFetching,
    isPlaceholderData,
  } = useTopArtists(TOP_BLOGGER_IDS);
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
          <div className="grid w-full gap-1 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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
