<script>
    import "../app.css";
    import { cart, searchBar, cartAside, navbar } from "$lib/stores";
    import { onMount } from "svelte";

    export let data

    let categoriesDropdown = false;
    let collectionsDropdown = false;
    let cookieModal = false;
    let smallNavBar = false;
    let cartProducts = [];
    let subtotal = 0;
    let searchInput;
    let query;

    $: if($searchBar && searchInput) searchInput.focus();
    $: if($searchBar) $cartAside = false;
    $: if($cartAside) smallNavBar = false;
    $: $cart, setCartItems();
    $: $navbar = !!data.pathname;


    onMount(() => {
        var prevScrollpos = window.scrollY;
        window.onscroll = function() {
            var currentScrollPos = window.scrollY;
            $navbar = prevScrollpos > currentScrollPos;
            prevScrollpos = currentScrollPos;
        }
        if(!localStorage.getItem("acceptsCookies")) cookieModal = true;
    });

    async function setCartItems(){
        subtotal = 0;
        cartProducts = [];
        if($cart.length > 0){
            $cart.forEach(async(item, index) => {
                const res = await fetch(`/api/product/${item.id}`, { method:"GET" });
                const data = await res.json();
                subtotal += (data.price * item.quantity * (data.promo ?? 1))/100;
                cartProducts = [...cartProducts, {...data, size:item.size, quantity:item.quantity}];
                if(index == $cart.length - 1) subtotal = parseFloat(subtotal.toFixed(2))
            });
        }
    }

    function quantityPlus(product){
        $cart = $cart.map(item => {
            if((item.id == product.id && item.size == product.size) && (product.sizes[product.size] > item.quantity)) item.quantity += 1;
            return item;
        });
        cartProducts = cartProducts.map(item => {
            if((item.id == product.id && item.size == product.size) && (product.sizes[product.size] > item.quantity)) item.quantity += 1;
            return item;
        });
    }

    function quantityMinus(product){
        $cart = $cart.map(item => {
            if(item.id == product.id && item.size == product.size){
                item.quantity -= 1;
                if(item.quantity == 0) return null;
            }
            return item;
        });
        $cart = $cart.filter(n => n);
        cartProducts = cartProducts.map(el => {
            if(el.id == product.id && el.size == product.size){
                el.quantity -= 1;
                if(el.quantity !== 0) return el;
            }else return el;
        });
        cartProducts = cartProducts.filter(n => n);
    }
</script>

<svelte:head>
    <meta name="description" content="Nude Project is a ready-to-wear label founded in 2018 in a small dorm room by two friends eager to create something different. Our garments aim to inspire the new generation to pursue their passion, whether or not it is the traditional path, by empowering artists to create without fear of judgement.">
    <link rel="shortcut icon" href="https://nude-project.com/cdn/shop/files/NEW_BRAND_48x48.png" type="image/x-icon">
    <meta property="og:type" content="website">
</svelte:head>

{#if cookieModal}
    <div class="fixed top-0 left-0 w-full h-full z-50 bg-neutral-800 bg-opacity-50 flex flex-col justify-end items-start p-6">
        <div class="p-6 flex bg-white dark:bg-gray-800 rounded-lg flex-col space-y-4 max-w-sm">
            <img src="https://www.svgrepo.com/show/30963/cookie.svg" class="w-1/3 mx-auto" alt="">
            <p>We use cookies to provide a better user experience.</p>
            <div class="flex flex-row justify-between items-center">
                <a href="/privacy-policy" class="link text-sm">Privacy Policy</a>
                <button class="button-primary"
                    on:click={() => {
                        localStorage.setItem("acceptsCookies", true);
                        cookieModal = false;
                    }}
                >Accept</button>
            </div>
        </div>
    </div>
{/if}


<!-- SearchBar -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="fixed top-0 left-0 w-full h-full bg-primary-500/50 flex-col gap-2 items-start {$searchBar ? "opacity-100 z-40" : "opacity-0 -z-10"}" on:click={() => {$searchBar = false;}}>
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <form action="/search" method="GET" class="w-full h-14 flex flex-row items-center transition-all {$searchBar ? "translate-y-0" : "-translate-y-full"}" on:click={(e) => {e.stopPropagation();}}>
        <label for="q" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative w-full h-full">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                </svg>
            </div>
            <input type="search" id="q" bind:value={query} name="q" class="block w-full p-4 pl-10 h-full text-sm text-gray-900 border border-gray-300 rounded-b-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" autocomplete="off" placeholder="Search posts or users" required bind:this={searchInput}>

            <button type="submit" class="absolute top-0 right-0 rounded-br-lg button-primary h-full">Search</button>
        </div>
    </form>
</div>


<!-- Navbar -->

<nav class="fixed top-0 left-0 w-full h-10 bg-white border-b border-primary-500 flex flex-row justify-between z-30 px-2 transition-all {$navbar ? "translate-y-0" : "-translate-y-full"} {$searchBar && $navbar ? "mt-[56px]" : ""}">
    <button class="max-md:block hidden flex-1" on:click={() => {smallNavBar = !smallNavBar}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
        <div class="flex flex-col bg-white shadow gap-6 absolute left-0 bottom-0 translate-y-full w-full {smallNavBar ? "flex" : "hidden"}">
            <div class="w-full flex-row items-start px-8 pt-4 gap-6 flex">
                <div class="flex flex-col sm:w-1/4 xl:w-1/5 w-1/2 items-start text-start">
                    <p class="uppercase font-extrabold text-sm">Clothing</p>
                    <a href="/category/clothing" class="link uppercase text-sm">All</a>
                    <a href="/category/t-shirt" class="link uppercase text-sm">T-shirts</a>
                    <a href="/category/hoodies&sweaters" class="link uppercase text-sm">Hoodies & sweaters</a>
                    <a href="/category/bottoms" class="link uppercase text-sm">Bottoms</a>
                    <a href="/category/swimwear" class="link uppercase text-sm">Swimwear</a>
                    <a href="/category/knitwear" class="link uppercase text-sm">Knitwear</a>
                    <a href="/category/shirts&polos" class="link uppercase text-sm">Shirts & Polos</a>
                    <a href="/category/underwear" class="link uppercase text-sm">Underwear</a>
                    <a href="/category/outerwear" class="link uppercase text-sm">Outerwear</a>
                </div>
                <div class="flex flex-col items-start text-start">
                    <p class="uppercase font-extrabold text-sm">Accessories</p>
                    <a href="/category/accessories" class="link uppercase text-sm">All</a>
                    <a href="/category/headwear" class="link uppercase text-sm">Headwear</a>
                    <a href="/category/jewelry" class="link uppercase text-sm">Jewelry</a>
                    <a href="/category/objects" class="link uppercase text-sm">Objects</a>
                    <a href="/category/socks" class="link uppercase text-sm">Socks</a>
                    <a href="/category/bags" class="link uppercase text-sm">Bags</a>
                </div>
            </div>
            <div class="flex-col flex items-start px-8 pb-4">
                <p class="uppercase font-extrabold text-sm">Collections</p>
                <div class="gap-6 w-full flex-row items-start flex text-start">
                    <div class="flex flex-col sm:w-1/4 xl:w-1/5 w-1/2 items-start">
                        <a href="/collections/SUN-KISSED" class="link uppercase text-sm">Sun-kissed</a>
                        <a href="/collections/SUMMER TAPES" class="link uppercase text-sm">Summer tapes</a>
                        <a href="/collections/SALAO" class="link uppercase text-sm">Salao</a>
                        <a href="/collections/TRUENO X NUDE PROJECT" class="link uppercase text-sm">Trueno x nude project</a>
                        <a href="/collections/CHAMPAGNE PROBLEMS" class="link uppercase text-sm">Champagne problems</a>
                    </div>
                    <div class="flex flex-col items-start text-start">
                        <a href="/collections/SCOUTS" class="link uppercase text-sm">Scouts</a>
                        <a href="/collections/DA'CAR" class="link uppercase text-sm">Da'car</a>
                        <a href="/collections/HEAVER OR HELL" class="link uppercase text-sm">Heaven or hell</a>
                        <a href="/collections/HEAD IN THE CLOUDS" class="link uppercase text-sm">Head in the clouds</a>
                        <a href="/collections/TRENDSETTER COLLECTION" class="link uppercase text-sm">Trendsetter collection</a>
                    </div>
                </div>
            </div>
        </div>
    </button>

    <div class="md:flex hidden flex-row gap-6 items-center flex-1">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:mouseenter={(() => {categoriesDropdown = true})} on:mouseleave={() => {categoriesDropdown = false}} class="py-2.5 flex items-center">
            <button class="uppercase text-xs font-semibold">Shop</button>
            <div class="absolute left-0 bottom-0 translate-y-[calc(100%-10px)] bg-white shadow gap-6 w-full flex-row items-start p-8 {categoriesDropdown ? "flex" : "hidden"}">
                <div class="flex flex-col sm:w-1/4 xl:w-1/5 w-1/2 items-start">
                    <p class="uppercase font-extrabold text-sm">Clothing</p>
                    <a href="/category/clothing" class="link uppercase text-sm">All</a>
                    <a href="/category/t-shirt" class="link uppercase text-sm">T-shirts</a>
                    <a href="/category/hoodies&sweaters" class="link uppercase text-sm">Hoodies & sweaters</a>
                    <a href="/category/bottoms" class="link uppercase text-sm">Bottoms</a>
                    <a href="/category/swimwear" class="link uppercase text-sm">Swimwear</a>
                    <a href="/category/knitwear" class="link uppercase text-sm">Knitwear</a>
                    <a href="/category/shirts&polos" class="link uppercase text-sm">Shirts & Polos</a>
                    <a href="/category/underwear" class="link uppercase text-sm">Underwear</a>
                    <a href="/category/outerwear" class="link uppercase text-sm">Outerwear</a>
                </div>
                <div class="flex flex-col items-start">
                    <p class="uppercase font-extrabold text-sm">Accessories</p>
                    <a href="/category/accessories" class="link uppercase text-sm">All</a>
                    <a href="/category/headwear" class="link uppercase text-sm">Headwear</a>
                    <a href="/category/jewelry" class="link uppercase text-sm">Jewelry</a>
                    <a href="/category/objects" class="link uppercase text-sm">Objects</a>
                    <a href="/category/socks" class="link uppercase text-sm">Socks</a>
                    <a href="/category/bags" class="link uppercase text-sm">Bags</a>
                </div>
            </div>
        </div>

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:mouseenter={(() => {collectionsDropdown = true})} on:mouseleave={() => {collectionsDropdown = false}} class="py-2.5 flex items-center">
            <button class="uppercase text-xs">Collections</button>
            <div class="absolute left-0 bottom-0 translate-y-[calc(100%-10px)] bg-white shadow gap-6 w-full flex-row items-start p-8 {collectionsDropdown ? "flex" : "hidden"}">
                <div class="flex flex-col sm:w-1/4 xl:w-1/5 w-1/2 items-start">
                    <a href="/collections/SUN-KISSED" class="link uppercase text-sm">Sun-kissed</a>
                    <a href="/collections/SUMMER TAPES" class="link uppercase text-sm">Summer tapes</a>
                    <a href="/collections/SALAO" class="link uppercase text-sm">Salao</a>
                    <a href="/collections/TRUENO X NUDE PROJECT" class="link uppercase text-sm">Trueno x nude project</a>
                    <a href="/collections/CHAMPAGNE PROBLEMS" class="link uppercase text-sm">Champagne problems</a>
                </div>
                <div class="flex flex-col">
                    <a href="/collections/SCOUTS" class="link uppercase text-sm">Scouts</a>
                    <a href="/collections/DA'CAR" class="link uppercase text-sm">Da'car</a>
                    <a href="/collections/HEAVER OR HELL" class="link uppercase text-sm">Heaven or hell</a>
                    <a href="/collections/HEAD IN THE CLOUDS" class="link uppercase text-sm">Head in the clouds</a>
                    <a href="/collections/TRENDSETTER COLLECTION" class="link uppercase text-sm">Trendsetter collection</a>
                </div>
            </div>
        </div>
        <a href="/about" class="uppercase text-xs">About</a>
        <a href="/stores" class="uppercase text-xs">Stores</a>
    </div>
    <a href="/" class="lg:p-2.5 p-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.46 25.04" class="h-full fill-primary-500"><g id="Layer_1-2"><g><polygon points="14.48 14.78 14.42 14.78 6.04 .54 0 .54 0 24.51 6.04 24.51 6.04 10.26 6.1 10.26 14.48 24.51 20.52 24.51 20.52 .54 14.48 .54 14.48 14.78"></polygon><path d="M38.35,15.86c0,3.12-1.34,4.26-3.99,4.26s-3.99-1.14-3.99-4.26V.54h-6.03V15.86c0,5.97,2.78,9.19,10.02,9.19s10.02-3.22,10.02-9.19V.54h-6.03V15.86Z"></path><path d="M58.83,.54h-10.63V24.51h10.96c6.67,0,10.36-4.26,10.36-11.97S65.5,.54,58.83,.54Zm-.74,19.04h-3.86V5.47h3.86c3.76,0,5.26,2.72,5.26,7.07s-1.51,7.04-5.26,7.04Z"></path><polygon points="78.11 14.65 88.56 14.65 88.56 9.72 78.11 9.72 78.11 5.46 90.24 5.46 90.24 .54 72.07 .54 72.07 24.51 90.44 24.51 90.44 19.58 78.11 19.58 78.11 14.65"></polygon><path d="M113.53,.54h-11.63V24.51h6.04V15.82h5.6c4.99,0,8.11-2.62,8.11-7.64s-3.12-7.64-8.11-7.64Zm-1.41,10.36h-4.19V5.46h4.19c2.08,0,3.35,.7,3.35,2.72s-1.27,2.71-3.35,2.71Z"></path><path d="M139.18,13.44v-.07c2.98-.67,4.86-2.65,4.86-6,0-4.36-3.22-6.84-8.55-6.84h-11.3V24.51h6.03v-8.35h3.76c5.13,0,2.95,7.34,4.12,8.35h6.27v-.34c-1.37-.4,.8-9.69-5.2-10.73Zm-4.86-2.21h-4.09V5.46h4.09c2.41,0,3.69,.87,3.69,2.88s-1.27,2.88-3.69,2.88Z"></path><path d="M157.95,0c-7.61,0-11.87,5.3-11.87,12.51s4.26,12.54,11.87,12.54,11.87-5.3,11.87-12.54-4.33-12.51-11.87-12.51Zm0,20.11c-4.39,0-5.7-3.42-5.7-7.61s1.31-7.58,5.7-7.58,5.7,3.42,5.7,7.58-1.34,7.61-5.7,7.61Z"></path><path d="M182.13,16.53c0,2.28-.54,3.59-2.52,3.59s-2.51-1.31-2.51-3.59v-2.01h-5.36v2.01c0,4.63,1.64,8.52,8.21,8.52s8.21-3.89,8.21-8.52V.54h-6.03v15.99Z"></path><polygon points="198.05 14.65 208.51 14.65 208.51 9.72 198.05 9.72 198.05 5.46 210.18 5.46 210.18 .54 192.01 .54 192.01 24.51 210.38 24.51 210.38 19.58 198.05 19.58 198.05 14.65"></polygon><path d="M223.66,4.93c3.18,0,4.26,1.91,4.69,4.53h6.17C233.95,3.89,230.46,0,223.93,0c-7.58,0-11.63,5.26-11.63,12.6s3.86,12.44,11.47,12.44c6.6,0,10.22-4.02,10.76-9.52h-6.17c-.4,2.68-1.48,4.59-4.69,4.59-3.99,0-5.2-3.08-5.2-7.61s1.21-7.58,5.2-7.58Z"></path><polygon points="235.29 5.46 242.26 5.46 242.26 24.51 248.3 24.51 248.3 5.46 255.24 5.46 255.24 .54 235.29 .54 235.29 5.46"></polygon><path d="M281.79,6.26c-1.11-2-2.69-3.57-4.69-4.64-1.98-1.07-4.05-1.61-6.15-1.61s-4.16,.54-6.15,1.61c-2,1.08-3.58,2.64-4.7,4.64-1.11,1.99-1.68,4.11-1.68,6.27s.56,4.24,1.66,6.22c1.1,1.98,2.67,3.55,4.65,4.65,1.97,1.09,4.07,1.65,6.22,1.65s4.25-.55,6.23-1.65c1.98-1.1,3.54-2.66,4.64-4.65,1.09-1.98,1.65-4.07,1.65-6.22s-.56-4.28-1.67-6.27Zm-2.85,10.86c-.47,.85-1.08,1.58-1.78,2.22l-1.92-3.08c-.76-1.2-1.39-2.05-1.93-2.58-.03-.03-.06-.05-.09-.08,.63-.22,1.18-.56,1.64-1.03,.74-.77,1.11-1.69,1.11-2.73,0-.74-.22-1.46-.67-2.11-.45-.66-1.06-1.13-1.82-1.4-.72-.25-1.81-.38-3.35-.38h-4.79v13.5h3v-5.32h.7c.6,0,1.04,.11,1.33,.34,.33,.24,.93,.91,1.97,2.76l1.25,2.22h3.42c-.46,.4-.94,.76-1.49,1.07-1.46,.81-3.01,1.23-4.59,1.23s-3.13-.41-4.59-1.23c-1.46-.81-2.6-1.96-3.41-3.41-.81-1.45-1.23-3-1.23-4.58s.42-3.15,1.25-4.63c.82-1.47,1.98-2.61,3.44-3.4,1.47-.79,3-1.2,4.54-1.2s3.06,.4,4.53,1.2c1.46,.79,2.62,1.93,3.44,3.4,.82,1.48,1.24,3.03,1.24,4.63s-.41,3.13-1.22,4.58Zm-6.08-7.11c0,.43-.15,.76-.46,1.01-.23,.19-.78,.41-2.09,.41h-1.96v-2.8h1.81c1.15,0,1.64,.1,1.85,.18,.28,.11,.48,.27,.64,.48,.15,.21,.22,.44,.22,.71Z"></path></g></g></svg>
    </a>
    <div class="p-2.5 flex flex-row justify-end gap-4 flex-1">
        <button on:click={() => {$searchBar = true;}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        </button>
        <button on:click={() => {$cartAside = !$cartAside}} class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
            <div class="bg-primary-500 rounded-full absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 p-1 text-white text-xs w-4 h-4 flex justify-center items-center">
                {$cart.reduce((partialSum, a) => partialSum + a.quantity, 0)}
            </div>
        </button>
    </div>
</nav>


<!-- Cart -->

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="bg-primary-500/50 fixed {$navbar ? "top-10 h-[calc(100%-40px)]" : "top-0 h-full"} left-0 w-full transition-all {$cartAside ? "opacity-100 z-20" : "opacity-0 -z-10"}" on:click={() => {$cartAside = false}}>
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <aside class="absolute top-0 z-30 right-0 h-full w-full sm:w-[500px] bg-white transition-all p-2 flex flex-col justify-between gap-2 sm:border-l sm:border-primary-500 {$cartAside ? "translate-x-0" : "translate-x-full"}" on:click={(e) => {e.stopPropagation()}}>
        {#if cartProducts.length > 0}
            <div class="flex flex-col gap-2">
                <div class="flex flex-row justify-between">
                    <button on:click={() =>{$cartAside = false}} class="group">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 group-hover:rotate-90 transition-all"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <p class="uppercase font-extrabold">Cart</p>
                </div>
                {#each cartProducts as product}
                    <div class="flex flex-row gap-4 h-44 border border-border w-full">
                        <a href="/product/{product.id}" on:click={() =>{$cartAside = false}}>
                            <img src="{product.images[0]}" alt="" class="w-auto h-full">
                        </a>
                        <div class="flex flex-col justify-between py-2">
                            <div>
                                <p class="font-extrabold">{product.name} ({product.size.toUpperCase()})</p>
                                {#if product.promo}
                                    <span>
                                        <span class="line-through">€ {(product.price/100).toFixed(2)}</span>
                                        <span class="text-red-600">- {(1- product.promo).toFixed(2)*100}%</span>
                                    </span><br>
                                    <span class="font-bold">€ {(product.price/100*product.promo).toFixed(2)}</span>
                                {:else}
                                    <span class="font-bold">€ {(product.price/100).toFixed(2)}</span>
                                {/if}
                            </div>
                            <div class="flex flex-row gap-2">
                                <button class="w-6 h-6 rounded-full flex justify-center items-center bg-primary-100" on:click={() => {quantityMinus(product)}}>-</button>
                                <span>{product.quantity}</span>
                                <button class="w-6 h-6 rounded-full flex justify-center items-center bg-primary-100" on:click={() => {quantityPlus(product)}}>+</button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="flex flex-col gap-1">
                <div class="flex flex-row justify-between">
                    <p class="uppercase text-xs">Cart</p>
                    <p class="uppercase text-xs">Subtotal</p>
                </div>
                <div class="flex flex-row justify-between">
                    <p>{$cart.reduce((partialSum, a) => partialSum + a.quantity, 0)} item{$cart.reduce((partialSum, a) => partialSum + a.quantity, 0) > 1 ?"s" : ""}</p>
                    <p class="font-bold">€ {subtotal.toFixed(2)}</p>
                </div>
                <a href="/checkout" class="button-primary">Proceed to checkout</a>
            </div>
        {:else}
            <div class="m-auto text-center">
                <h4>Your cart is empty!</h4>
                <a href="/category/*" class="link">Start shopping</a>
            </div>
        {/if}
    </aside>
</div>


<!-- Main -->

<main class="min-h-screen transition-all {$searchBar ? "mt-[96px]" : navbar ? "mt-10" : ""}">
    <slot />
</main>