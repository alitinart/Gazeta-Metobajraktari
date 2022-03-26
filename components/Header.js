import React, { useEffect } from "react";
import Search from "./Search";
import Link from "next/link";

import Router from "next/router";

import NotificationService from "../services/notifications.service";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { userRequests } from "../services/request.service";

import Logo from "../assets/images/logo.png";

export default function Header() {
  const router = useRouter();
  const dispatch = useDispatch();
  useEffect(() => {
    const autoLogin = async () => {
      if (!localStorage.getItem("token")) {
        return;
      }
      const resSync = await userRequests.syncUser(
        localStorage.getItem("token")
      );
      if (!resSync.data) {
        await userRequests.logout(
          localStorage.removeItem("token"),
          localStorage.removeItem("rTokenId")
        );
        localStorage.removeItem("token");
        localStorage.removeItem("rTokenId");
        return NotificationService(
          "Session Expired",
          "Sessioni i juaj ka mbaruar. Kyçuni përsëri !",
          "danger"
        );
      }
      localStorage.setItem("token", resSync.data.token);
      dispatch({
        type: "sync",
        token: resSync.data.token,
        userObject: resSync.data.user,
      });
    };
    autoLogin();
    return () => {};
  }, []);

  const state = useSelector((state) => state);

  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rTokenId");
    await userRequests.logout(localStorage.getItem("rTokenId"), state.token);
    dispatch({
      type: "logout",
    });
    Router.push("/");
  };

  return (
    <>
      <div className="mobile">
        <img src={Logo.src} width="100px" className="mobile-logo" />
        <div className="header-mobile">
          <ul className="menu">
            <div className={router.pathname == "/info" ? "active" : ""}>
              <Link href={"/"}>Ballina</Link>
            </div>
            <div className={router.pathname == "/info" ? "active" : ""}>
              <Link href={"/info"}>Për Ne</Link>
            </div>
          </ul>
        </div>
      </div>
      <div className="header">
        <ul className="nav">
          <img src={Logo.src} width="100px" />
          <div className={router.pathname == "/" ? "active" : ""}>
            <Link href={"/"} className={router.pathname == "/" ? "active" : ""}>
              Ballina
            </Link>
          </div>
          <div className={router.pathname == "/info" ? "active" : ""}>
            <Link href={"/info"}>Për Ne</Link>
          </div>
          {state && state.userObject ? (
            <>
              <div className="secondary">
                <a onClick={logout}>Ç'kyçuni</a>
              </div>
              <h1
                className="username"
                style={{
                  fontSize: "20px",
                  margin: "auto",
                  textDecoration: "underline",
                }}
              >
                {state.userObject.fullName}
              </h1>
            </>
          ) : (
            <div className={router.pathname.includes("auth") ? "active" : ""}>
              <Link href={"/auth/login"}>Kyçu</Link>
            </div>
          )}
        </ul>
        <Search />
      </div>
    </>
  );
}
