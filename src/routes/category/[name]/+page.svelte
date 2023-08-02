<script>
    import Product from "$lib/components/Product.svelte"

    export let data;

    const { products } = data;
</script>

{#if products.length > 0}
    <section class="bg-white p-6 justify-between w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-x-2 gap-y-6">
        {#each products as product}
            <Product product={product} />
        {/each}
    </section>
{:else}
    <h4 class="p-6">No products in this category</h4>
{/if}