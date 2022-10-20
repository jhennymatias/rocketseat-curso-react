import styles from './style.module.scss';
import { useSession, signIn } from 'next-auth/react';
import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

interface SubscribeButtonProps{
    priceId: string 
}
export function SubscribeButton({priceId}:SubscribeButtonProps){
    const {data: session} = useSession();
    async function handleSubscribe(){
        if(!session){
            signIn('github')
            return;
        }
        try {
            const response = await api.post('/subscribe');
            const {sessionId} = response.data;
            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({"sessionId": sessionId.id})
        }catch(err){
            alert(err.message)
        }
    }
    return (
        <button className={styles.button} type="button" onClick={handleSubscribe}>
            Subscribe now
        </button>
    )
}