import { productsRef } from "$lib/server/db"

export async function load({ params }) {
    const { id } = params;
    let product = structuredClone( await productsRef.findOne({ id }) );

    let othersColors = structuredClone(await Promise.all(product.colors.map(async (id) => {
        return await productsRef.findOne({ id })
    }))).filter(n => n);

    let recommandedProducts = await productsRef.find({  }).sort({ date:-1 }).limit(15).project({ _id:0 }).toArray();

    return { product, othersColors, recommandedProducts:recommandedProducts.sort((a, b) => 0.5 - Math.random()) };
};