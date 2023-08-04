import { productsRef } from "$lib/server/db"

export async function load({ params }) {
    const { name } = params;
    const categories = name.split("&");

    let products = await productsRef.find({ }).project({ _id:0 }).sort({ createdAt:-1 }).toArray();

    if(!categories.includes("*")) products = products.filter(product => product.categories.some(r=> categories.indexOf(r) >= 0));

    products = structuredClone(await Promise.all(products.map(async (product) => {
        let a = await Promise.all(product.colors.map(async (id) => {
            return structuredClone(await productsRef.findOne({ id }));
        }));
        product.colors = a;
        return product;
    }))).filter(n => n);

    return { products, categoryName:name };
};