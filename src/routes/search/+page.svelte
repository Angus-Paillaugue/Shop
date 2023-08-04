<script>
    import Product from "$lib/components/Product.svelte";
    import { pageMetaData } from "$lib/stores"

    export let data;

    const { products, searchQuery } = data;

    $pageMetaData.title = ` ${searchQuery} – NUDE PROJECT `;
    $pageMetaData.description = `Products matching '${searchQuery}'`
</script>

<section class="bg-white p-6 justify-between w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-x-2 gap-y-6">
    {#each products as product}
        <Product product={product} />
    {/each}
</section>