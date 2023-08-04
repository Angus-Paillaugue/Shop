<script>
    import { pageMetaData } from "$lib/stores";

    export let data;

    const { order } = data;

    $pageMetaData.title = ` Thank you ${order.prenom} | By artists, for artists. `;
    $pageMetaData.description = "Nude Project is a ready-to-wear label founded in 2018 in a small dorm room by two friends eager to create something different. Our garments aim to inspire the new generation to pursue their passion, whether or not it is the traditional path, by empowering artists to create without fear of judgement.";
</script>

<section class="flex flex-col sm:flex-row grow">
    <article class="p-4 md:w-1/2 w-full flex flex-col items-end">
        <div class="max-w-xl w-full flex flex-col space-y-10 mt-10">
            <a href="/" class="w-1/2 mx-auto">
                <img src="/logo.svg" alt="Logo">
            </a>
            <div class="flex flex-row gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width=".6" stroke="currentColor" class="w-20 h-20"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div class="flex flex-col justify-between py-2">
                    <p>Order n° : <strong>{order.orderNo}</strong></p>
                    <h1 class="font-normal">Thank you, {order.prenom}</h1>
                </div>
            </div>
            <div class="pl-24">
                <div class="p-4 rounded border border-border">
                    <h3 class="font-normal">Order details</h3>
                    <div class="flex sm:flex-row flex-col gap-4 mt-4">
                        <div class="flex flex-col gap-4 w-1/2">
                            <div class="space-y-1">
                                <h5>Contact information</h5>
                                <p>{order.email}</p>
                            </div>
                            <div class="space-y-1">
                                <h5>Shipping address</h5>
                                <p>{order.adresse}</p>
                            </div>
                            <div class="space-y-1">
                                <h5>Shipping method</h5>
                                <p>European standard shipping (Z1)</p>
                            </div>
                        </div>
                        <div class="flex flex-co gap-4 w-1/2l">
                            <div class="space-y-1">
                                <h5>Billing address</h5>
                                <p>{order.prenom} {order.nom}</p>
                                <p>{order.adresse}</p>
                                <p>{order.telephone}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-10 justify-end flex flex-row w-full">
                    <a href="/" class="button-primary w-fit">Continue shopping</a>
                </div>
            </div>
        </div>
    </article>
    <article class="bg-primary-500 md:w-1/2 w-full">
        <div class="md:p-6 p-2 flex flex-col gap-2 h-full w-full max-w-xl">
            {#each order.articles as product}
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
            <div class="flex flex-row w-full justify-between">
                <p class="text-primary-100">Subtotal</p>
                <span class="font-bold text-primary-100">€ {order.subtotal}</span>
            </div>
            {#if order.promoCode}
                <div class="flex flex-row w-full justify-between">
                    <p class="text-primary-100">Promo code : <strong>{order.promoCode}</strong></p>
                    <span class="font-bold text-red-500">- €{(order.subtotal*((order.total-5)/order.subtotal)).toFixed(2)}</span>
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
                    <span class="text-sm text-primary-300">Including €{(order.total*0.2).toFixed(2)} in taxes</span>
                </div>
                <div class="flex flex-row items-center gap-2">
                    <span class="uppercase text-primary-300 text-sm">eur</span>
                    <p class="font-extrabold text-primary-100 text-lg">
                        € {order.total.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    </article>
</section>
