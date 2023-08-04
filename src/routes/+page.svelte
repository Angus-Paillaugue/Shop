<script>
    import Product from "$lib/components/Product.svelte";
    import { pageMetaData } from "$lib/stores";

    export let data;

    let products = data.products;

    $pageMetaData.title = "NUDE PROJECT | By artists, for artists.";
    $pageMetaData.description = "Nude Project is a ready-to-wear label founded in 2018 in a small dorm room by two friends eager to create something different. Our garments aim to inspire the new generation to pursue their passion, whether or not it is the traditional path, by empowering artists to create without fear of judgement.";
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