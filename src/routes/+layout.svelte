<script>
    import "../app.css";
    import { cart, searchBar, cartAside, navbar, pageMetaData } from "$lib/stores";
    import { onMount } from "svelte";

    export let data;

    let categoriesDropdown = false;
    let collectionsDropdown = false;
    let cookieModal = false;
    let disclaimerModal = false;
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
        if(!localStorage.getItem("disclaimerModal")) disclaimerModal = true;
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
    <link rel="shortcut icon" href="https://nude-project.com/cdn/shop/files/NEW_BRAND_48x48.png" type="image/x-icon">
    <meta property="og:type" content="website">
    <title> {$pageMetaData.title} </title>
    <meta name="description" content="{$pageMetaData.description}">
</svelte:head>

{#if disclaimerModal}
    <div class="fixed top-0 left-0 z-50 flex flex-col items-center justify-center w-full h-full p-6 bg-primary-500/50">
        <div class="flex flex-col w-full max-w-sm p-6 space-y-2 bg-white rounded-lg dark:bg-gray-800">
            <img src="/disclaimer.svg" alt="" class="w-1/2 mx-auto">
            <p>This website is a replica of <a href="https://nude-project.com/" class="uppercase link">Nude project</a>.</p>
            <p>We did not create any products and we do not take credit on any of them.</p>
            <p>We do not ship any products.</p>
            <div class="flex flex-row items-center justify-center">
                <button class="button-primary"
                    on:click={() => {
                        localStorage.setItem("disclaimerModal", true);
                        disclaimerModal = false;
                    }}
                >I acknowledge</button>
            </div>
        </div>
    </div>
{/if}

{#if cookieModal}
    <div class="fixed top-0 left-0 z-40 flex flex-col items-start justify-end w-full h-full p-6 bg-primary-500/50">
        <div class="flex flex-col w-full max-w-sm p-6 space-y-4 bg-white rounded-lg dark:bg-gray-800">
            <img src="https://www.svgrepo.com/show/30963/cookie.svg" class="w-1/3 mx-auto" alt="">
            <p>We use cookies to provide a better user experience.</p>
            <div class="flex flex-row items-center justify-between">
                <a href="/privacy-policy" class="text-sm link">Privacy Policy</a>
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
            <input type="search" id="q" bind:value={query} name="q" class="block w-full h-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-b-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" autocomplete="off" placeholder="Search posts or users" required bind:this={searchInput}>

            <button type="submit" class="absolute top-0 right-0 h-full rounded-br-lg button-primary">Search</button>
        </div>
    </form>
</div>


<!-- Navbar -->

<nav class="fixed top-0 left-0 w-full h-10 bg-white border-b border-primary-500 flex flex-row justify-between z-30 px-2 transition-all {$navbar ? "translate-y-0" : "-translate-y-full"} {$searchBar && $navbar ? "mt-[56px]" : ""}">
    <button class="flex-1 hidden max-md:block" on:click={() => {smallNavBar = !smallNavBar}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
        <div class="flex flex-col bg-white border-b border-border gap-6 absolute left-0 bottom-0 translate-y-full w-full {smallNavBar ? "flex" : "hidden"}">
            <div class="flex flex-row items-start w-full gap-6 px-8 pt-4">
                <div class="flex flex-col items-start w-1/2 sm:w-1/4 xl:w-1/5 text-start">
                    <p class="text-sm font-extrabold uppercase">Clothing</p>
                    <a href="/category/clothing" class="text-sm uppercase link">All</a>
                    <a href="/category/t-shirt" class="text-sm uppercase link">T-shirts</a>
                    <a href="/category/hoodies&sweaters" class="text-sm uppercase link">Hoodies & sweaters</a>
                    <a href="/category/bottoms" class="text-sm uppercase link">Bottoms</a>
                    <a href="/category/swimwear" class="text-sm uppercase link">Swimwear</a>
                    <a href="/category/knitwear" class="text-sm uppercase link">Knitwear</a>
                    <a href="/category/shirts&polos" class="text-sm uppercase link">Shirts & Polos</a>
                    <a href="/category/underwear" class="text-sm uppercase link">Underwear</a>
                    <a href="/category/outerwear" class="text-sm uppercase link">Outerwear</a>
                </div>
                <div class="flex flex-col items-start text-start">
                    <p class="text-sm font-extrabold uppercase">Accessories</p>
                    <a href="/category/accessories" class="text-sm uppercase link">All</a>
                    <a href="/category/headwear" class="text-sm uppercase link">Headwear</a>
                    <a href="/category/jewelry" class="text-sm uppercase link">Jewelry</a>
                    <a href="/category/objects" class="text-sm uppercase link">Objects</a>
                    <a href="/category/socks" class="text-sm uppercase link">Socks</a>
                    <a href="/category/bags" class="text-sm uppercase link">Bags</a>
                </div>
            </div>
            <div class="flex flex-col items-start px-8 pb-4">
                <p class="text-sm font-extrabold uppercase">Collections</p>
                <div class="flex flex-row items-start w-full gap-6 text-start">
                    <div class="flex flex-col items-start w-1/2 sm:w-1/4 xl:w-1/5">
                        <a href="/collections/SUN-KISSED" class="text-sm uppercase link">Sun-kissed</a>
                        <a href="/collections/SUMMER TAPES" class="text-sm uppercase link">Summer tapes</a>
                        <a href="/collections/SALAO" class="text-sm uppercase link">Salao</a>
                        <a href="/collections/TRUENO X NUDE PROJECT" class="text-sm uppercase link">Trueno x nude project</a>
                        <a href="/collections/CHAMPAGNE PROBLEMS" class="text-sm uppercase link">Champagne problems</a>
                    </div>
                    <div class="flex flex-col items-start text-start">
                        <a href="/collections/SCOUTS" class="text-sm uppercase link">Scouts</a>
                        <a href="/collections/DA'CAR" class="text-sm uppercase link">Da'car</a>
                        <a href="/collections/HEAVER OR HELL" class="text-sm uppercase link">Heaven or hell</a>
                        <a href="/collections/HEAD IN THE CLOUDS" class="text-sm uppercase link">Head in the clouds</a>
                        <a href="/collections/TRENDSETTER COLLECTION" class="text-sm uppercase link">Trendsetter collection</a>
                    </div>
                </div>
            </div>
            <div class="flex flex-col items-start px-8 pb-4 space-y-4">
                <a href="/about" class="text-sm font-extrabold uppercase text-start">About</a>
                <a href="/stores" class="text-sm font-extrabold uppercase text-start">Stores</a>
            </div>
        </div>
    </button>

    <div class="flex-row items-center flex-1 hidden gap-6 md:flex">
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:mouseenter={(() => {categoriesDropdown = true})} on:mouseleave={() => {categoriesDropdown = false}} class="py-2.5 flex items-center">
            <button class="text-xs font-semibold uppercase">Shop</button>
            <div class="absolute left-0 bottom-0 translate-y-[calc(100%-10px)] bg-white border-b border-border gap-6 w-full flex-row items-start p-8 {categoriesDropdown ? "flex" : "hidden"}">
                <div class="flex flex-col items-start w-1/2 sm:w-1/4 xl:w-1/5">
                    <p class="text-sm font-extrabold uppercase">Clothing</p>
                    <a href="/category/clothing" class="text-sm uppercase link">All</a>
                    <a href="/category/t-shirt" class="text-sm uppercase link">T-shirts</a>
                    <a href="/category/hoodies&sweaters" class="text-sm uppercase link">Hoodies & sweaters</a>
                    <a href="/category/bottoms" class="text-sm uppercase link">Bottoms</a>
                    <a href="/category/swimwear" class="text-sm uppercase link">Swimwear</a>
                    <a href="/category/knitwear" class="text-sm uppercase link">Knitwear</a>
                    <a href="/category/shirts&polos" class="text-sm uppercase link">Shirts & Polos</a>
                    <a href="/category/underwear" class="text-sm uppercase link">Underwear</a>
                    <a href="/category/outerwear" class="text-sm uppercase link">Outerwear</a>
                </div>
                <div class="flex flex-col items-start">
                    <p class="text-sm font-extrabold uppercase">Accessories</p>
                    <a href="/category/accessories" class="text-sm uppercase link">All</a>
                    <a href="/category/headwear" class="text-sm uppercase link">Headwear</a>
                    <a href="/category/jewelry" class="text-sm uppercase link">Jewelry</a>
                    <a href="/category/objects" class="text-sm uppercase link">Objects</a>
                    <a href="/category/socks" class="text-sm uppercase link">Socks</a>
                    <a href="/category/bags" class="text-sm uppercase link">Bags</a>
                </div>
            </div>
        </div>

        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div on:mouseenter={(() => {collectionsDropdown = true})} on:mouseleave={() => {collectionsDropdown = false}} class="py-2.5 flex items-center">
            <button class="text-xs uppercase">Collections</button>
            <div class="absolute left-0 bottom-0 translate-y-[calc(100%-10px)] bg-white border-b border-border gap-6 w-full flex-row items-start p-8 {collectionsDropdown ? "flex" : "hidden"}">
                <div class="flex flex-col items-start w-1/2 sm:w-1/4 xl:w-1/5">
                    <a href="/collections/SUN-KISSED" class="text-sm uppercase link">Sun-kissed</a>
                    <a href="/collections/SUMMER TAPES" class="text-sm uppercase link">Summer tapes</a>
                    <a href="/collections/SALAO" class="text-sm uppercase link">Salao</a>
                    <a href="/collections/TRUENO X NUDE PROJECT" class="text-sm uppercase link">Trueno x nude project</a>
                    <a href="/collections/CHAMPAGNE PROBLEMS" class="text-sm uppercase link">Champagne problems</a>
                </div>
                <div class="flex flex-col">
                    <a href="/collections/SCOUTS" class="text-sm uppercase link">Scouts</a>
                    <a href="/collections/DA'CAR" class="text-sm uppercase link">Da'car</a>
                    <a href="/collections/HEAVER OR HELL" class="text-sm uppercase link">Heaven or hell</a>
                    <a href="/collections/HEAD IN THE CLOUDS" class="text-sm uppercase link">Head in the clouds</a>
                    <a href="/collections/TRENDSETTER COLLECTION" class="text-sm uppercase link">Trendsetter collection</a>
                </div>
            </div>
        </div>
        <a href="/about" class="text-xs uppercase">About</a>
        <a href="/stores" class="text-xs uppercase">Stores</a>
    </div>
    <a href="/" class="lg:p-2.5 p-3">
        <img src="/logo.svg" class="h-full" alt="">
    </a>
    <div class="p-2.5 flex flex-row justify-end gap-4 flex-1">
        <button on:click={() => {$searchBar = true;}}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
        </button>
        <button on:click={() => {$cartAside = !$cartAside}} class="relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>
            <div class="absolute top-0 right-0 flex items-center justify-center w-4 h-4 p-1 text-xs text-white translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500">
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 transition-all group-hover:rotate-90"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                    <p class="font-extrabold uppercase">Cart</p>
                </div>
                {#each cartProducts as product}
                    <div class="flex flex-row w-full gap-4 border h-44 border-border">
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
                                <button class="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100" on:click={() => {quantityMinus(product)}}>-</button>
                                <span>{product.quantity}</span>
                                <button class="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100" on:click={() => {quantityPlus(product)}}>+</button>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
            <div class="flex flex-col gap-1 transition-all delay-150 {$cartAside ? "translate-y-0" : "translate-y-full"}">
                <hr>
                <div class="flex flex-row justify-between">
                    <p class="text-xs uppercase">Cart</p>
                    <p class="text-xs uppercase">Subtotal</p>
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

<main class="transition-all flex flex-col {$searchBar ? "mt-[96px]" : $navbar ? "mt-10 min-h-[calc(100vh-40px)]" : " min-h-screen"}">
    <section class="flex flex-col h-full grow">
        <slot />
    </section>

    <!-- Footer -->
    
    <footer>
        <div class="grid items-center grid-cols-1 gap-6 p-6 border-t border-primary-500 lg:grid-cols-2 justify-evenly">
            <div class="flex flex-col items-center justify-center w-2/3 gap-2 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.7" stroke="currentColor" class="w-16 h-16"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>
                <p class="font-bold uppercase">EMBLEMATIC PACKAGING</p>
                <span class="text-xs">Includes Close Friends access, stickers and many more.</span>
            </div>
            <div class="flex flex-col items-center justify-center w-2/3 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="0.7" stroke="currentColor" class="w-16 h-16"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                <p class="font-bold uppercase">SECURE PAYMENT</p>
                <span class="text-xs">Paypal, Apple-Pay, Klarna, Bitcoin and all major credit and debit cards accepted.</span>
            </div>
        </div>
    
        <div class="grid items-start grid-cols-1 gap-6 p-6 border-t border-primary-500 lg:grid-cols-3 justify-evenly">
            <div class="space-y-6">
                <a href="/"><img src="/logo.svg" class="h-4" alt="Logo"></a>
                <div class="flex flex-row gap-4">
                    <a href="https://www.instagram.com/nudeproject/" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="fill-primary-500" viewBox="0 0 16 16">
                            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                        </svg>
                    </a>
                    <a href="https://twitter.com/nudeproject_" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="fill-primary-500" viewBox="0 0 16 16">
                            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                        </svg>
                    </a>
                    <a href="https://www.youtube.com/c/NUDEPROJECT/videos" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="fill-primary-500" viewBox="0 0 16 16">
                            <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A99.788 99.788 0 0 1 7.858 2h.193zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z"/>
                        </svg>
                    </a>
                    <a href="https://www.tiktok.com/@nudeproject" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="fill-primary-500" viewBox="0 0 16 16">
                            <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/>
                        </svg>
                    </a>
                    <a href="https://discord.gg/pdA85KxS6G" target="_blank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="fill-primary-500" viewBox="0 0 16 16">
                            <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.19 12.19 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.02-.066.051.051 0 0 1 .015-.019c.084-.063.168-.129.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.08.066.164.132.248.195a.051.051 0 0 1-.004.085 8.254 8.254 0 0 1-1.249.594.05.05 0 0 0-.03.03.052.052 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.235 13.235 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-8.198 7.307c-.789 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm5.316 0c-.788 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612Z"/>
                        </svg>
                    </a>
                </div>
            </div>
            <div class="flex flex-col space-y-2">
                <h6 class="font-extrabold uppercase">Boring stuff</h6>
                <a href="/legal-notice" class="text-xs uppercase">Legal notice</a>
                <a href="/privacy-policy" class="text-xs uppercase">Privacy policy</a>
            </div>
    
    
            <div class="flex flex-col space-y-2">
                <h6 class="font-extrabold uppercase">Brand</h6>
                <a href="/stores" class="text-xs uppercase link">Stores</a>
            </div>
        </div>
    
        <div class="w-full p-2 text-center bg-primary-500">
            <a href="/" class="text-xs text-white">© NUDE PROJECT</a>
        </div>
    </footer>
</main>

