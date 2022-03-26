import { userRequests } from "../services/request.service";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import NotificationService from "../services/notifications.service";

import Router from "next/router";
import verifyGuard from "../guards/verifyGuard";

import Head from "next/head";

export default function Verify() {
  const [code, setCode] = useState("");

  const state = useSelector((state) => state);

  useEffect(async () => {
    if (await verifyGuard(localStorage.getItem("token"))) {
      Router.push("/");
    }
  }, []);

  const verificationHandler = async () => {
    const resVerify = await userRequests.verifyUser(state.token, code);

    if (resVerify.error) {
      return NotificationService("Error", resVerify.message, "danger");
    }

    NotificationService("Sukses", resVerify.message, "success");
    Router.push("/");
  };

  return (
    <>
      <Head>
        <title>Verifikimi</title>
      </Head>
      {state ? (
        <div className="verify">
          <h1 className="title">Verifiko Llogarinë</h1>
          <p
            style={{
              textAlign: "center",
              color: "#0a0e3c",
              marginBottom: "20px",
            }}
          >
            Shikoni email-in e juaj. Aty duhet të keni një mesazh të ri ku është
            kodi i verifikimit{" "}
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              verificationHandler();
            }}
          >
            <input
              className="form-control"
              type={"password"}
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
              placeholder="Kodi Verifikues"
            />
            <button className="btn" type="submit">
              Verifiko
            </button>
          </form>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
