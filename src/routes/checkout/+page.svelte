<script>
    import { cart, navbar, pageMetaData } from "$lib/stores"
    import { enhance } from "$app/forms"
    import { goto } from "$app/navigation"
    import { browser } from '$app/environment'
    import { redirect } from '@sveltejs/kit'

    export let form;

    let cartProducts = [];
    let subtotal = 0;
    let total = 0;
    let promoCode = "";
    let promoCodeReduction = 1;
    let shippingForm = {};
    
    $: (total = subtotal*promoCodeReduction+5)
    $: if(form?.isValid) {promoCodeReduction = form.data.reduction;promoCode = form?.code ?? "";}
    $: $cart, setCartItems();

    async function setCartItems(){
        subtotal = 0;
        total = 0;
        cartProducts = [];
        if($cart.length > 0){
            $cart.forEach(async(item, index) => {
                const res = await fetch(`/api/product/${item.id}`, { method:"GET" });
                const data = await res.json();
                subtotal += (data.price * item.quantity * (data.promo ?? 1))/100;
                cartProducts = [...cartProducts, {...data, size:item.size, quantity:item.quantity}];
                if(index == $cart.length - 1) subtotal = parseFloat(subtotal.toFixed(2));
            });
        }else {
            if(browser) goto("/category/*"); else redirect(303, "/category/*")
        }
    }

    async function shipping(e) {
        const formData = new FormData(e.target);
        formData.append("articles", JSON.stringify(cartProducts));
        formData.append("promoCode", promoCode);
        formData.append("subtotal", subtotal);
        formData.append("total", total);
        const res = await fetch("/api/shipping", { method:"POST", body:formData });
        const data = await res.json();
        shippingForm = data;
        if(shippingForm?.url){
            $cart = [];
            goto(shippingForm.url);
        }
    }

    $pageMetaData.title = ` CHECKOUT – NUDE PROJECT `;
    $pageMetaData.description = `Confirm your order and get it shipped right to your door.`;
</script>

<div class="flex flex-col-reverse max-md:justify-end md:flex-row w-full transition-all {$navbar ? "md:min-h-[calc(100vh-40px)]" : "md:min-h-screen"}">
    <div class="p-4 md:w-1/2 w-full flex flex-col items-end">
        <div class="md:max-w-xl w-full flex flex-col">
            <form on:submit|preventDefault={(e) => {shipping(e)}} class="space-y-4">
                <h5>Contact</h5>
                <input type="text" name="email" placeholder="E-mail">

                <h5 class="pt-5">Shipping address</h5>

                <div class="flex lg:flex-row flex-col max-lg:space-y-4 lg:gap-4">
                    <input type="text" name="prenom" placeholder="Prénom">
                    <input type="text" name="nom" placeholder="Nom">
                </div>

                <input type="text" name="adresse" placeholder="Adresse">

                <div class="flex lg:flex-row flex-col max-lg:space-y-4 lg:gap-4">
                    <input type="text" name="codePostal" placeholder="Code postal">
                    <input type="text" name="ville" placeholder="Ville">
                </div>

                <input type="text" name="telephone" placeholder="N° de téléphone">

                {#if shippingForm?.isErr}
                    <div class="flex flex-row bg-primary-100 border border-primary-500 p-4 w-full rounded-lg gap-4 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                        {shippingForm.errMessage}
                    </div>
                {/if}

                <div class="flex flex-row justify-between items-center">
                    <a href="/" class="flex flex-row gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                        Cancel
                    </a>
                    <button type="submit" class="button-primary">Continue to payment</button>
                </div>
            </form>
        </div>
    </div>
    <div class="bg-primary-500 md:w-1/2 w-full transition-all  {$navbar ? "md:min-h-[calc(100vh-40px)]" : "md:min-h-screen"}">
        <div class="md:p-6 p-2 flex flex-col gap-2 h-full w-full max-w-xl">
            {#each cartProducts as product}
                <div class="flex flex-row h-28 items-center justify-between gap-4">
                    <div class="flex flex-row gap-6 h-full">
                        <div class="relative">
                            <div class="bg-primary-300 font-bold text-primary-500 absolute top-0 right-0 translate-x-1/2 flex items-center justify-center w-5 h-5 rounded-full -translate-y-1/2">{product.quantity}</div>
                            <img src="{product.images[0]}" alt="" class="h-full">
                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="text-primary-100">{product.name}</p>
                            <span class="text-primary-300">{product.size.toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="flex flex-col w-4/6 items-end">
                        {#if product.promo}
                            <span class="line-through text-primary-100">€ {((product.price * product.quantity ?? 1)/100).toFixed(2)}</span>
                            <span class="text-red-500">- {(1- product.promo).toFixed(2)*100}%</span>
                            <span class="font-bold text-primary-100">€ {((product.price * product.quantity ?? 1)/100*product.promo).toFixed(2)}</span>
                        {:else}
                            <span class="font-bold">€ {((product.price * product.quantity ?? 1)/100).toFixed(2)}</span>
                        {/if}
                    </div>
                </div>
            {/each}
            <hr>
            <form use:enhance method="POST" action="?/coupon" class="flex flex-row gap-2 w-full">
                <input type="text" name="code" value="{form?.code ?? ''}" placeholder="Gift card or discount code">
                <button class="button-primary-reverse h-12 rounded-lg" type="submit">Apply</button>
            </form>
            {#if form?.isValid == false}
                <div class="flex flex-row bg-primary-100 border border-primary-500 p-4 w-full rounded-lg gap-4 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                    Not a valid promo code
                </div>
            {/if}
            <hr>
            <div class="flex flex-row w-full justify-between">
                <p class="text-primary-100">Subtotal</p>
                <span class="font-bold text-primary-100">€ {subtotal}</span>
            </div>
            {#if promoCodeReduction !== 1}
                <div class="flex flex-row w-full justify-between">
                    <p class="text-primary-100">Promo code</p>
                    <span class="font-bold text-red-500">- €{subtotal * promoCodeReduction}</span>
                </div>
            {/if}
            <div class="flex flex-row w-full justify-between">
                <p class="text-primary-100">Shipping</p>
                <span class="font-bold text-primary-100">€ 5.00</span>
            </div>
            <hr>
            <div class="flex flex-row w-full justify-between items-center">
                <div class="flex flex-col">
                    <p class="font-bold text-primary-100">Total</p>
                    <span class="text-sm text-primary-300">Including €{(total*0.2).toFixed(2)} in taxes</span>
                </div>
                <div class="flex flex-row items-center gap-2">
                    <span class="uppercase text-primary-300 text-sm">eur</span>
                    <p class="font-extrabold text-primary-100 text-lg">
                        € {total.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>