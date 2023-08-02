import { productsRef } from "$lib/server/db"

export async function load({ url }) {
    const searchQuery = new RegExp( url.searchParams.get("q") || ".*", 'i' );
    let products = await productsRef.find({ $or: [ { quantity: { name:searchQuery } }, { categories:searchQuery }, { description:searchQuery } ] }).sort({ date:-1 }).toArray();

    products = structuredClone(await Promise.all(products.map(async (product) => {
        let a = structuredClone(await Promise.all(product.colors.map(async (id) => {
            return structuredClone(await productsRef.findOne({ id }));
        })));
        product.colors = a;
        return product; 
    }))).filter(n => n);

    return { products };
};