import "../styles/globals.css";
import Header from "../components/Header";

import "react-notifications-component/dist/theme.css";
import { ReactNotifications } from "react-notifications-component";

import { Provider } from "react-redux";
import store from "../store/store";
import AddArticle from "../components/AddArticle";

import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";

NProgress.configure({
  minimum: 0.3,
  easing: "ease",
  speed: 800,
  showSpinner: false,
});

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Header />
      <ReactNotifications />
      <Component {...pageProps} />
      <AddArticle />
    </Provider>
  );
}

export default MyApp;
