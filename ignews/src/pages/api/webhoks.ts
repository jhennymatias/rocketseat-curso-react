
import { NextApiRequest } from 'next';
import { NextApiResponse } from 'next';
import {Readable} from 'stream';
import Stripe from 'stripe';
import { stripe } from '../../services/stripe';
import { saveSubscription } from './_lib/manageSubscription';

async function buffer(readable: Readable){

    const chunks = [];

    for await (const chunk of readable){
        chunk.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks)
}

export const config = {
    api:{
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed',
    'checkout.subscription.created',
    'checkout.subscription.updated',
    'checkout.subscription.deleted'
])

export default async function (req: NextApiRequest, res: NextApiResponse){
    if(req.method === 'POST'){
        const buf = await buffer(req);
        const secret = req.headers['stripe-signature']

        let event : Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK)
        }catch(err){
            return res.status(400).send(err.message)
        }

        const type = event.type

        if(relevantEvents.has(type)){
            try{
                switch(type){
                    case 'customer.subscription.created':
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':    
                        const subscription = event.data.object as Stripe.Subscription;
                        await saveSubscription(
                            subscription.id, 
                            subscription.customer.toString(),
                            type === 'customer.subscription.created')
                        break;
                    case 'checkout.session.completed':
                        const checkoutSession =  event.data.object as Stripe.Checkout.Session
                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(), true)                          
                        break
                    default:
                        throw new Error("Unhandled Event.")
                }
            }catch(err){
                return res.json({error: err.message})
            }
        }
        res.status(200).json({received: true})
    }else{
        res.status(405).end("Method not allowed")
    }
    
}
