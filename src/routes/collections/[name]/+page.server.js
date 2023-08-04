import { productsRef } from "$lib/server/db"

export async function load({ params }) {
    const { name } = params;

    let products = await productsRef.find({ collection:name }).project({ _id:0 }).sort({ createdAt:-1 }).toArray();
    
    products = structuredClone(await Promise.all(products.map(async (product) => {
        let a = await Promise.all(product.colors.map(async (id) => {
            return structuredClone(await productsRef.findOne({ id }));
        }));
        product.colors = a;
        return product;
    }))).filter(n => n);

    return { products, collectionName:name };
};