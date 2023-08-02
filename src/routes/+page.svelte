<script>
    import Product from "$lib/components/Product.svelte";

    export let data;

    let products = data.products;
</script>

<section></section>
<section class="p-6 justify-between w-full">
    <h6 class="font-semibold uppercase text-sm mb-6">New arrivals</h6>
    <div class="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-x-2 gap-y-6">
        {#each products as product}
            <Product product={product} />
        {/each}
    </div>
    <a href="/category/*" class="button-primary-reverse w-fit mx-auto mt-10 uppercase">View all</a>
</section>