<script>
    import { Splide, SplideSlide } from '@splidejs/svelte-splide';
    import '@splidejs/svelte-splide/css';
    import { onMount } from 'svelte';
    import { cart, cartAside, navbar } from "$lib/stores"

    export let data;

    const { product, othersColors, recommandedProducts } = data;
    let productsPerPage = 4;
    let shippingCollapsible = false;
    let detailsCollapsible = false;
    let selectedSize;

    onMount(() => {
        setSplideSize();
        window.onresize = setSplideSize;
    });

    function setSplideSize() {
        productsPerPage = Math.floor((window.innerWidth - 20*2) / 256);
    }

    async function addToCart() {
        if(!selectedSize) return;
        if(product.sizes[selectedSize] == 0) return;
        if($cart.filter(item => item.id == product.id).length > 0 && $cart.filter(item => item.size == selectedSize).length > 0){
            $cart = $cart.map(item => {
                if((item.id == product.id && item.size == selectedSize) && (product.sizes[selectedSize] > item.quantity)) item.quantity += 1;
                return item;
            });
        }else {
            $cart = [ ...$cart, { id:product.id, size:selectedSize, quantity:1 } ];
        }
        $cartAside = true;
    }
</script>

<div class="flex flex-col p-4">
    <div class="flex lg:flex-row flex-col gap-4">
        <div class="w-full lg:hidden">
            <Splide options={ { rewind: true } }>
                {#each product.images as image}
                    <SplideSlide class="flex items-center justify-center">
                        <!-- svelte-ignore a11y-missing-attribute -->
                        <img src="{image}" class="w-max h-max"/>
                    </SplideSlide>
                {/each}
            </Splide>
        </div>
        <div class="grid grid-cols-2 gap-1 w-auto max-lg:hidden">
            {#each product.images as image}
                <img src="{image}" alt="" class="w-full">
            {/each}
        </div>
        <div class="flex flex-col lg:max-w-lg w-full h-fit sticky top-0">
            <p class="font-extrabold">{product.name}</p>
            {#if product.promo}
                <div>
                    <span>
                        <span class="line-through">€ {(product.price/100).toFixed(2)}</span>
                        <span class="text-red-500">- {(1- product.promo).toFixed(2)*100}%</span>
                    </span><br>
                    <span class="font-bold">€ {(product.price/100*product.promo).toFixed(2)}</span>
                </div>
            {:else}
                <span class="font-bold">€ {(product.price/100).toFixed(2)}</span>
            {/if}
            <p class="font-semibold text-sm mt-10">{@html product.description.replaceAll("\n", "<br />")}</p>

            {#if othersColors.length > 0}
                <div class="border-t border-border py-4 mt-10 flex flex-row gap-2 overflow-x-auto">
                    <a href="/product/{product.id}" class="flex flex-col h-28 pb-2 border-b border-primary-500">
                        <img src="{product.images[0]}" class="h-full" alt="">
                    </a>
                    {#each othersColors as otherColorProduct}
                        <a href="/product/{otherColorProduct.id}" class="flex flex-col h-28 pb-2">
                            <img src="{otherColorProduct.images[0]}" class="h-full" alt="">
                        </a>
                    {/each}
                </div>
            {/if}

            <div class="border-t border-border py-4 flex flex-row gap-2 justify-between">
                {#each Object.entries(product.sizes) as size}
                    {#if size[1] > 0}
                        <label for="size-{size[0]}" class="flex flex-col text-center cursor-pointer border-primary-500 pb-2 {size[0] == selectedSize ? "border-b" : ""}" style="width: {100 / Object.entries(product.sizes).length}%;">
                            {size[0].toUpperCase()}
                            <input type="radio" name="size-{size[0]}" id="size-{size[0]}" class="hidden" bind:group={selectedSize} value="{size[0]}">
                        </label>
                    {:else}
                        <div class="flex flex-col text-center pb-2 text-primary-500/20 line-through" style="width: {100 / Object.entries(product.sizes).length}%;">
                            {size[0].toUpperCase()}
                        </div>
                    {/if}
                {/each}
            </div>

            <button class="button-primary uppercase" disabled="{!selectedSize}" on:click={addToCart}>Add to cart</button>

            <div class="flex flex-col justify-between mt-10">
                {#if product.details}
                    <button class="w-full border-t border-border uppercase flex justify-between items-center flex-row py-6 px-2" on:click={() => {detailsCollapsible = !detailsCollapsible}}>
                        Details
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                    </button>
                    <ul class="w-full break-words border-b border-border transition-all overflow-hidden list-disc list-inside text-sm space-y-3 pl-4 {detailsCollapsible ? "max-h-96 py-4" : "max-h-0"}">
                        {#each product.details as detail}
                            <li>{detail}</li>
                        {/each}
                    </ul>
                {/if}
                <button class="w-full uppercase flex justify-between items-center flex-row py-6 px-2 {product.details ? "" : "border-t border-border"}" on:click={() => {shippingCollapsible = !shippingCollapsible}}>
                    Shipping
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                </button>
                <div class="w-full break-words border-b border-border transition-all overflow-hidden list-disc list-inside text-sm space-y-3 pl-4 {shippingCollapsible ? "max-h-96 py-4" : "max-h-0"}">
                    <p>Due to logistical improvements, orders may take longer than usual.</p><br>
                    <p>- National orders 7-8 working days, approximately.</p><br>
                    <p>- International orders 12-14 working days approximately.</p><br>
                    <p>If you have any issues with your order email us at help@nude-project.com and we will be there to help you. Please note, orders placed after 2PM (CET) will be shipped the following business day. </p>
                </div>
            </div>
        </div>
    </div>

    <div class="w-full h-80 mt-20">
        <Splide options={ { rewind: true, perPage:productsPerPage, gap:"1rem", height:"20rem" } }>
            {#each recommandedProducts as product}
                <SplideSlide class="flex items-center justify-center">
                    <!-- svelte-ignore a11y-no-static-element-interactions -->
                    <a href="/product/{product.id}" class="w-full h-full flex justify-center" 
                        on:mouseenter={ (e) => {
                            for(let i = 0; i < e.target.children.length;i++){
                                let child = e.target.children[i];
                                if(i == 1) child.classList.remove("hidden"); else child.classList.add("hidden");
                            }
                        } }
                        on:mouseleave={ (e) => {
                            for(let i = 0; i < e.target.children.length;i++){
                                let child = e.target.children[i];
                                if(i == 0) child.classList.remove("hidden"); else child.classList.add("hidden");
                            }
                        } }
                    >
                        {#each product.images as image, index}
                            <!-- svelte-ignore a11y-img-redundant-alt -->
                            <img src="{image}" alt="Product image" class="h-full {index == 0 ? "" : "hidden"}" data-index="{index}">
                        {/each}
                    </a>
                </SplideSlide>
            {/each}
        </Splide>
    </div>
</div>