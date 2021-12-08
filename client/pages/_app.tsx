import { AppProps } from 'next/dist/shared/lib/router/router';
import { initGlobalState, ISwrState } from 'util/configSwrState';
import '../styles/globals.css';


declare global {
  export interface Window {
    swrState:ISwrState
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  initGlobalState();
  return <Component {...pageProps} />
}

export default MyApp
