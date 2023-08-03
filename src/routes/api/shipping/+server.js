import { ordersRef } from "$lib/server/db"

export async function POST({ request }) {
    let { prenom, nom, codePostal, adresse, ville, telephone, email, articles, promoCode, subtotal, total } = Object.fromEntries(await request.formData());
    articles = JSON.parse(articles);
    subtotal = parseFloat(subtotal);
    total = parseFloat(subtotal);

    if(prenom.length == 0 || nom.length == 0 || codePostal.length == 0 || adresse.length == 0 || ville.length == 0 || telephone.length == 0 || email.length == 0 || articles.length == 0){
        return new Response(JSON.stringify({isErr:true, errMessage:`Tous les champs doivent être remplis`}));
    }else {
        let orderNo = new Date().valueOf().toString().slice(-6);
        let gouvAdressRes = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${adresse} ${codePostal} ${ville}`, { method:"GET" });
        let gouvAdress = await gouvAdressRes.json();
        if(gouvAdress.length == 0){
            return new Response(JSON.stringify({isErr:true, errMessage:`Adresse introuvable`}));
        }
        gouvAdress = gouvAdress.features[0].properties.label;
        await ordersRef.insertOne({ prenom, nom, adresse:gouvAdress, telephone, email, orderNo, date:new Date(), articles, promoCode, subtotal, total });
        return new Response(JSON.stringify({isErr:false, url:`/tracking/${orderNo}`}));
    }
};