import "../styles/globals.css";
import Header from "../components/Header";

import "react-notifications-component/dist/theme.css";
import { ReactNotifications } from "react-notifications-component";

import { Provider, useDispatch } from "react-redux";
import store from "../store/store";
import { userRequests } from "../services/request.service";
import NotificationService from "../services/notifications.service";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Header />
      <ReactNotifications />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
