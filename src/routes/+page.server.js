import { productsRef } from "$lib/server/db";

export async function load({  }) {
    let products = await productsRef.find({  }).sort({ createdAt:-1 }).limit(12).project({ _id:0 }).toArray();

    products = structuredClone(await Promise.all(products.map(async (product) => {
        let a = structuredClone(await Promise.all(product.colors.map(async (id) => {
            return structuredClone(await productsRef.findOne({ id }))
        })));
        product.colors = a;
        return product 
    }))).filter(n => n);

    return { products };
};