<script>
    import { page } from '$app/stores';
    import { pageMetaData } from "$lib/stores";

    $pageMetaData.title = $page.status || "404" + "Error";
</script>


<div class="max-w-screen-md mx-auto flex flex-col items-center justify-center flex-1">
    <h1 class="mb-6 text-7xl tracking-tight font-extrabold lg:text-9xl">{$page.status || "404"}</h1>
    <p class="mb-6 text-xl tracking-tight font-bold">{$page.error.message || "Page not found"}</p> 

    <a href="{$page.error.link || "/"}" class="button-primary">{$page.error.buttonText || "Back to Homepage"}</a>
</div>