import { ordersRef } from "$lib/server/db"

export async function load({ params }) {
    let { orderNo } = params;

    const order = await ordersRef
    return {};
};