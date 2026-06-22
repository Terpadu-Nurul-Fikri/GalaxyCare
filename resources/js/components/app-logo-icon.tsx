import type { ImgHTMLAttributes } from 'react';
import sipaskaLogo from '../../images/sipaska.svg';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return <img src={sipaskaLogo} alt="SIPASKA" {...props} />;
}
