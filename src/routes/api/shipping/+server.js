import { ordersRef, productsRef } from "$lib/server/db"
import { Message, SMTPClient, } from 'emailjs';
import { EMAIL_APP_PASSWORD } from "$env/static/private"
import { emailTemplate } from "$lib/server/emailTemplate";

const client = new SMTPClient({
    user: "angus.paillaugue40@gmail.com",
    password: EMAIL_APP_PASSWORD,
    host: `smtp.gmail.com`,
    ssl: true,
});

export async function POST({ request }) {
    let { prenom, nom, codePostal, adresse, ville, telephone, email, articles, promoCode, subtotal, total } = Object.fromEntries(await request.formData());
    articles = JSON.parse(articles);
    subtotal = parseFloat(subtotal);
    total = parseFloat(total);

    if(prenom.length == 0 || nom.length == 0 || codePostal.length == 0 || adresse.length == 0 || ville.length == 0 || telephone.length == 0 || email.length == 0 || articles.length == 0){
        return new Response(JSON.stringify({isErr:true, errMessage:`Tous les champs doivent être remplis`}));
    }else {
        let orderNo = new Date().valueOf().toString().slice(-6);
        let gouvAdressRes = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${adresse} ${codePostal} ${ville}`, { method:"GET" });
        let gouvAdress = await gouvAdressRes.json();
        if(gouvAdress.length == 0) return new Response(JSON.stringify({isErr:true, errMessage:`Adresse introuvable`}));
        gouvAdress = gouvAdress.features[0].properties.label;

        for(const article of articles) {
            let temp = `sizes.${article.size}`;
            await productsRef.findOneAndUpdate({ name:article.name }, { $set:{ [temp]:article.sizes[article.size]-article.quantity } });
        }

        await ordersRef.insertOne({ prenom, nom, adresse:gouvAdress, telephone, email, orderNo, date:new Date(), articles, promoCode, subtotal, total });


        let htmlEmail = emailTemplate;
        let replaceArray = ["prenom", "orderNo", "total", "trackingUrl",'adresse', "websiteUrl", "subtotal", "nom"];
        let replaceWith = [prenom, orderNo, total, `http://localhost:5173/tracking/${orderNo}`, adresse, "http://localhost:5173", subtotal, nom];
        for(var i = 0; i < replaceArray.length; i++) {
            htmlEmail = htmlEmail.replace(new RegExp('{{' + replaceArray[i] + '}}', 'gi'), replaceWith[i]);
        }
        const msg = new Message({
            text: `Merci pour votre commande n°${orderNo}`,
            from: 'angus.paillaugue40@gmail.com',
            to: email,
            subject: "Merci pour votre commande",
            attachment: [{
                data: htmlEmail,
                alternative: true
            }],
        });

        try {
            await client.sendAsync(msg);
        } catch (error) {
            console.log(error);
        }

        return new Response(JSON.stringify({isErr:false, url:`/tracking/${orderNo}`}));
    }
};