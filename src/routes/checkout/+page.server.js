import { couponsRef } from "$lib/server/db"

export const actions = {
    shipping: async({ request }) => {
        const { prenom, nom, codePostal, adresse, ville, telephone, email } = Object.fromEntries(await request.formData());
        let isErr = false
        let errMessage = "";

        let orderNo = new Date().valueOf().toString().slice(-6);

        return { prenom, nom, codePostal, ville, telephone, email, isErr, errMessage }
    },
    coupon: async({ request }) => {
        const { code } = Object.fromEntries(await request.formData());

        let isValid = structuredClone(await couponsRef.findOne({ code }));

        return { code, isValid:!!isValid, data:{ ...isValid } }
    }
};