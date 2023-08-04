<script>
    import Product from "$lib/components/Product.svelte"
    import { pageMetaData } from "$lib/stores"

    export let data;

    const { products, collectionName } = data;

    $pageMetaData.title = ` ${collectionName.toUpperCase()} – NUDE PROJECT `;
    $pageMetaData.description = `Nude Project is a ready-to-wear label founded in 2018 in a small dorm room by two friends eager to create something different. Our garments aim to inspire the new generation to pursue their passion, whether or not it is the traditional path, by empowering artists to create without fear of judgement.`;
</script>

{#if products.length > 0}
    <section class="bg-white p-6 justify-between w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-x-2 gap-y-6">
        {#each products as product}
            <Product product={product} />
        {/each}
    </section>
{:else}
    <h4 class="p-6">No products in this collection</h4>
{/if}