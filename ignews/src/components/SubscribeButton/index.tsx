import styles from './style.module.scss';

export function SubscribeButton(){
    const isUserLoggedIn = false;

    return (
        <button className={styles.button} type="button">
            Subscribe now
        </button>
    )
}