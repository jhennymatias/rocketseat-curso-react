import styles from './styles.module.scss';
import { SigninButton } from '../SigninButton';

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/images/logo.svg" alt="Logo ignews" />
                <nav>
                    <a className={styles.active} >Home</a>
                    <a>Posts</a>
                </nav>
                <SigninButton />
            </div>
        </header>
    );
}