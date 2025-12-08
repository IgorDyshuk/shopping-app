import { useFilteredProduct, useProduct } from "@/hooks/useProducts";

function Catalog() {
  const {
    data: product,
    isLoading,
    isError,
  } = useFilteredProduct("men's clothing");

  return (
    <section className="flex w-full flex-col gap-6 ">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">Catalog</h1>
        <p className="text-muted-foreground">
          Parsed product JSON with full details for the first item.
        </p>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading product...</p>
      ) : isError ? (
        <p className="text-destructive">Failed to load product.</p>
      ) : !product ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        // <div className="flex flex-col gap-6">
        //   <div className="flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm">
        //     <div className="flex items-center justify-center rounded-md bg-white p-4">
        //       <img
        //         src={product.image}
        //         alt={product.title}
        //         className="h-56 w-full max-w-xs object-contain"
        //       />
        //     </div>
        //     <div className="space-y-2">
        //       <h2 className="text-xl font-semibold">{product.title}</h2>
        //       <p className="text-sm text-muted-foreground line-clamp-1">
        //         {/* {product.description} */}
        //       </p>
        //       <div className="flex flex-wrap gap-3 text-sm">
        //         <span className="rounded-full bg-muted px-3 py-1">
        //           {product.category}
        //         </span>
        //         <span className="font-semibold">
        //           ${product.price.toFixed(2)}
        //         </span>
        //         {product.rating && (
        //           <span className="text-muted-foreground">
        //             Rating: {product.rating.rate} ({product.rating.count})
        //           </span>
        //         )}
        //       </div>
        //     </div>
        //   </div>

        <div className="rounded-lg border bg-card p-4 shadow-sm">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground ">
            Raw JSON
          </h3>
          <pre className="max-h-[480px] overflow-auto rounded bg-muted p-3 text-xs leading-relaxed">
            {JSON.stringify(product, null, 2)}
          </pre>
        </div>
        // </div>
      )}
    </section>
  );
}

export default Catalog;
