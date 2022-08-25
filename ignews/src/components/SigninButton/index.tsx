import { FaGithub} from 'react-icons/fa';
import {FiX} from 'react-icons/fi';

import styles from './styles.module.scss';

export function SigninButton(){
    const isUserLoggedIn = false;

    return isUserLoggedIn ? (
        <button className={styles.button} type="button">
            <FaGithub color="#04d361" />
            Jhenny Matias  
            <FiX color="#737380" className={styles.closeIcon}/>
        </button>
    )
    : (
        <button className={styles.button} type="button">
            <FaGithub color="#eba417" />
            Sign in with Github 
        </button>
    )
}