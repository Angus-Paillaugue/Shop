<script>
    export let product
</script>

<a href="/product/{product.id}" class="flex flex-col w-autp h-auto">
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="w-full" 
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
            <img src="{image}" alt="Product image" class="{index == 0 ? "" : "hidden"}" data-index="{index}">
        {/each}
    </div>
    <p class="font-extrabold">{product.name}</p>
    {#if product.promo}
        <div class="flex flex-row">
            <span class="line-through">€ {(product.price/100).toFixed(2)}</span>
            <span class="text-red-600">- {(1- product.promo).toFixed(2)*100}%</span>
            <span class="font-bold ml-2">€ {(product.price/100*product.promo).toFixed(2)}</span>
        </div>
    {:else}
        <span class="font-bold">€ {(product.price/100).toFixed(2)}</span>
    {/if}
    <div class="flex flex-row gap-2 flex-nowrap overflow-x-auto">
        <div class="rounded-full h-5 w-5 border-primary-500 border-2" style="background-color: {product.colorHex};"></div>
        {#each product.colors as color}
            <div class="rounded-full h-5 w-5" style="background-color: {color.colorHex};"></div>
        {/each}
    </div>
</a>