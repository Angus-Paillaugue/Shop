<script>
    import { Splide, SplideSlide } from '@splidejs/svelte-splide';
    import '@splidejs/svelte-splide/css';
    import { pageMetaData } from "$lib/stores"

    $pageMetaData.title = ` STORES – NUDE PROJECT `;
    $pageMetaData.description = "Our stores"
</script>

<div class="w-full p-6 space-y-20 max-w-screen-2xl mx-auto">

    <div class="flex lg:flex-row flex-col gap-4">
        <h1 class="max-lg:text-center">
            <sup>Our </sup>
            <span> Stores</span>
        </h1>
        <div class="flex flex-col gap-2 justify-end">
            <p class="font-bold text-xl lg:text-start text-center">We already are in Madrid, Valencia and Barcelona</p>
            <p class="text-base lg:text-start text-center">Nude Project is a ready-to-wear label founded in 2018 in a small dorm room by two friends eager to create something different. Now we have a real place were capture the essence of the brand made for the Nude Cult.</p>
        </div>
    </div>

    <div class="flex lg:flex-row flex-col gap-10 justify-between">
        <div class="flex flex-col">
            <a href="https://goo.gl/maps/nDCsRe9WFoJQqUmE6" class="link uppercase font-extrabold">Barcelona</a>
            <p class="text-xs mt-4">De la Canuda Street, 37</p>
            <p class="text-xs">08002 Barcelona</p>
            <div class="flex flex-col mt-4">
                <div class="flex flex-row justify-between md:w-44"><p>MON-SAT</p><p>11-21</p></div>
                <div class="flex flex-row justify-between md:w-44"><p>SUN</p><p>12-20</p></div>
            </div>
        </div>

        <Splide options={ { rewind: true, gap:"1rem", height:"35rem" } } class="lg:w-4/5">
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_51_454eb3d4-95ee-4963-947e-5f7fc6c7ac89.jpg?v=1681897616" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_89_aa60f7be-015b-4a73-b0e7-5e470f5cb426.jpg?v=1687043051" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_62_03db84e1-1efb-4bc8-ad5b-7a8cf5f8a113.jpg?v=1686310685" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_82_8d10d50c-fadc-41ce-9de6-9eee6107aab2.jpg?v=1681897506" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_66_079d8a78-1786-45d5-8d09-a23804d8cb4c.jpg?v=1687042969" alt="">
            </SplideSlide>
        </Splide>
    </div>

    <div class="flex lg:flex-row flex-col gap-10 justify-between">
        <div class="flex flex-col">
            <a href="https://goo.gl/maps/nVHytFeWjQ6CejE49" class="link uppercase font-extrabold">Valencia</a>
            <p class="text-xs mt-4">Martínez Ferrando Street, 1</p>
            <p class="text-xs">46004 Valencia</p>
            <div class="flex flex-col mt-4">
                <div class="flex flex-row justify-between md:w-44"><p>MON-SAT</p><p>11-21</p></div>
                <div class="flex flex-row justify-between md:w-44"><p>SUN</p><p>closed</p></div>
            </div>
        </div>

        <Splide options={ { rewind: true, gap:"1rem", height:"35rem" } } class="lg:w-4/5">
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_74_3d432bc0-8477-470c-924c-fb5a86f7ec5c.jpg?v=1687043166" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_69_ace3dd0b-90ea-4dff-ba2e-633590f3e140.jpg?v=1681460196" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_70_fce1fe51-a35c-4f55-a365-19950e36340b.jpg?v=1681460390" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/2_90f4012b-dd1d-48c5-b75d-eb09d8f05bf5.jpg?v=1681894285" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_80_3f8ed425-db7c-4960-89fa-16e2fba07fd4.jpg?v=1687043188" alt="">
            </SplideSlide>
        </Splide>
    </div>

    <div class="flex lg:flex-row flex-col gap-10 justify-between">
        <div class="flex flex-col">
            <a href="https://goo.gl/maps/4VWyN5MvFrjTzKD98" class="link uppercase font-extrabold">Madrid</a>
            <p class="text-xs mt-4">Fuencarral Street, 47</p>
            <p class="text-xs">28004 Madrid</p>
            <div class="flex flex-col mt-4">
                <div class="flex flex-row justify-between md:w-44"><p>MON-SAT</p><p>11-21</p></div>
                <div class="flex flex-row justify-between md:w-44"><p>SAT</p><p>11-21.30</p></div>
                <div class="flex flex-row justify-between md:w-44"><p>SUN</p><p>12-20</p></div>
            </div>
        </div>

        <Splide options={ { rewind: true, gap:"1rem", height:"35rem" } } class="lg:w-4/5">
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_96.jpg?v=1681899623" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_97.jpg?v=1681899624" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_100.jpg?v=1681899624" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_99.jpg?v=1681899624" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_103.jpg?v=1681899624" alt="">
            </SplideSlide>
        </Splide>
    </div>

    <div class="flex lg:flex-row flex-col gap-10 justify-between">
        <div class="flex flex-col">
            <a href="https://goo.gl/maps/FWTSDqcReyZq4bPr6" class="link uppercase font-extrabold">La roca village</a>
            <p class="text-xs mt-4">La Roca Village, Barcelona</p>
            <p class="text-xs">08430 Santa Agnès de Malanyanes</p>
            <div class="flex flex-col mt-4">
                <div class="flex flex-row justify-between md:w-44"><p>MON-SUN</p><p>11-22</p></div>
            </div>
        </div>

        <Splide options={ { rewind: true, gap:"1rem" } } class="lg:w-4/5">
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/1_1f28789a-94dc-4775-bbd7-e089abccfe1d.jpg?v=1690808571" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/2_71fb5dfa-8e7f-4c27-9329-3a247f179ac2.jpg?v=1690808585" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/4_7190e88c-921d-402f-a45e-91ac367e12bb.jpg?v=1690808585" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/iPhone_14_Pro_Max_99.jpg?v=1681899624" alt="">
            </SplideSlide>
            <SplideSlide class="flex items-center justify-center">
                <img src="https://nude-project.com/cdn/shop/files/3_2f062b09-d131-49cf-a708-d0b2b3f7bace.jpg?v=1690808585" alt="">
            </SplideSlide>
        </Splide>
    </div>
</div>