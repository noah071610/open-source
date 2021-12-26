import { AppProps } from "next/dist/shared/lib/router/router";
import { initSwrState } from "util/configSwrState";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  initSwrState();
  return <Component {...pageProps} />;
}

export default MyApp;
