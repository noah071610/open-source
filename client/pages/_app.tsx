import { AppProps } from "next/dist/shared/lib/router/router";
import { initSwrGlobalState } from "util/configSwrState";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  initSwrGlobalState();
  return <Component {...pageProps} />;
}

export default MyApp;
