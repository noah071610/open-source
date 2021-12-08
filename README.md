# SWR Local State

Local state management tool with SWR

Let's use local state more easy!

<br/>

# Getting started

In the simple case you just need to add `initState()` function at the root component

```
import { AppProps } from 'next/dist/shared/lib/router/router';
import { initGlobalState, ISwrState } from 'util/configSwrState';

declare global {
  export interface Window {
    swrState:ISwrState
  }
} // If you are using typescript

function MyApp({ Component, pageProps }) {
  initGlobalState();
  return <Component {...pageProps} />
}

export default MyApp

```

So simple :)

<br/>

# Installation

npm :

```
npm i swr swr-localstate
```

yarn :

```
yarn add swr swr-localstate
```

# Features

# Examples

# Documentation

# License

<span style="color:red"> MIT </span>
