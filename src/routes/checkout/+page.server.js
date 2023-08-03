import { couponsRef } from "$lib/server/db"

export const actions = {
    coupon: async({ request }) => {
        const { code } = Object.fromEntries(await request.formData());

        let isValid = structuredClone(await couponsRef.findOne({ code }));

        return { code, isValid:!!isValid, data:{ ...isValid } }
    }
};