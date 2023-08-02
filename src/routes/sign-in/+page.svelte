<script>
    import { enhance } from '$app/forms';

    export let form;
</script>

<svelte:head>
	<title>Sign-in</title>
</svelte:head>

<div class="h-screen flex items-center justify-center max-w-md m-auto">
    <form class="w-full p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700 flex flex-col gap-6" use:enhance method="POST">
        <h3>Sign-in</h3>
        <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">E-mail</label>
            <input type="email" placeholder="E-mail" name="email" value="{form ? form.formData.email : ""}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
        </div>
        <div>
            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
            <input type="text" placeholder="Username" name="username" value="{form ? form.formData.username : ""}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
        </div>
        <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input type="password" placeholder="Password" name="password" value="{form ? form.formData.password : ""}" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500">
        </div>
    
        <button class="w-full button-primary">Sign-in</button>
    
        {#if form?.success == false}
            <div class="alert alert-error">
                <i class="bi bi-x-circle shrink-0 h-6 w-6"></i>
                <span>{form.message}</span>
            </div>
        {/if}
    
        <a class="link" href="/log-in">Already have an account ?</a>
    </form>
</div>