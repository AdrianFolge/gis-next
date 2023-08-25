import '../styles/tailwind.css';
import { Albert_Sans } from 'next/font/google'
 
// If loading a variable font, you don't need to specify the font weight
const albert_sans = Albert_Sans({ subsets: ['latin'] })
function MyApp({ Component, pageProps }) {
  return(
    <main className={albert_sans.className}>
    <Component {...pageProps} />
    </main> 
  )
}

export default MyApp
