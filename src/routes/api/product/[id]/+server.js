import { productsRef } from "$lib/server/db"

export async function GET({ params }) {
    const { id } = params;

    const product = structuredClone(await productsRef.findOne({ id }));

    return new Response(JSON.stringify(product));
};