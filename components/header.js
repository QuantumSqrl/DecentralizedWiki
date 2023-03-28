import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import {useTheme} from 'next-themes'
import IconButton from '@mui/material/IconButton';
import NightlightRoundIcon from '@mui/icons-material/NightlightRound';
import LightModeIcon from '@mui/icons-material/LightMode';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../assets/wikitechtreelogo.png';

export default function Header() {
    const {theme, setTheme} = useTheme();

    return (
        <header class="grid grid-cols-3">

                <div className={utilStyles.topLeft}>
                    <MenuIcon />
                </div>

                <div className={utilStyles.top}>
                    <Link href="/">
                        <Image src={Logo} height={55} width={55} />
                    </Link>
                </div>

                <div className={utilStyles.topRight}>
                    <IconButton  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} color="inherit" >
                        {theme === 'dark' ? <LightModeIcon className={utilStyles.topRight} /> : <NightlightRoundIcon className={utilStyles.topRight} />}
                    </IconButton>
                </div>

        </header>
    )
}
