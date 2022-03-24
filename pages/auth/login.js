import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import authGuard from "../../guards/authGuard";
import NotificationService from "../../services/notifications.service";
import { userRequests } from "../../services/request.service";
import styles from "../../styles/Register.module.css";

export default function Register({ data }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  useEffect(async () => {
    if (await authGuard(localStorage.getItem("token"))) {
      Router.push("/");
    }
    return () => {};
  }, []);

  const onSubmit = async () => {
    const res = await userRequests.loginRequest(email, password);

    if (res.error) {
      return NotificationService("Error", res.message, "danger");
    }

    NotificationService("Sukses", res.message, "success");
    const resUserObject = await userRequests.getUserObject(res.data.token);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("rTokenId", res.data.rTokenID);
    dispatch({
      type: "login",
      token: res.data.token,
      rTokenId: res.data.rTokenID,
      userObject: resUserObject.data,
    });

    Router.push("/");
  };

  return (
    <>
      <Head>
        <title>Kyçu në llogari</title>
      </Head>
      <div className={styles.register}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="form"
        >
          <h1 className="title">Kyçu në Llogari</h1>
          <input
            className="form-control"
            type={"email"}
            placeholder="Emaili Juaj"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            className="form-control"
            type={"password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <p className={styles.changeParagraph}>
            Nuk keni llogari ?{" "}
            <span className={styles.changeLink}>
              <Link href={"/auth/register"}>Krijo</Link>
            </span>
          </p>
          <button className={styles.submitButton}>Kyçu</button>
        </form>
      </div>
    </>
  );
}
