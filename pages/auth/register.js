import styles from "../../styles/Register.module.css";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import NotificationService from "../../services/notifications.service";
import { userRequests } from "../../services/request.service";
import Router from "next/router";
import authGuard from "../../guards/authGuard";

export default function Register({ data }) {
  const [fullName, setFullName] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  useEffect(async () => {
    if (await authGuard(localStorage.getItem("token"))) {
      Router.push("/");
    }
    return () => {};
  }, []);

  const SUPER_SECRET_PASSWORD = process.env.NEXT_PUBLIC_SUPER_SECRET_PASSWORD;

  const onSubmit = async () => {
    if (code !== SUPER_SECRET_PASSWORD) {
      return NotificationService(
        "Error",
        "Kodi Sekret nuk është korrekt",
        "danger"
      );
    }

    const resData = await userRequests.registerRequest(
      email,
      password,
      classNumber,
      fullName,
      code
    );
    if (resData.error) {
      return NotificationService("Error", resData.message, "danger");
    }
    NotificationService("Sukses", resData.message, "success");
    Router.push("/");
  };

  return (
    <>
      <Head>
        <title>Regjitro Llogari</title>
      </Head>
      <div className={styles.register}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="form"
        >
          <h1 className="title">Regjistro Llogari</h1>
          <input
            className="form-control"
            type={"text"}
            placeholder="Emri Juaj sh. Nart Aliti"
            required
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />
          <input
            className="form-control"
            type={"text"}
            placeholder="Klasa Juaj sh. VIII/3"
            required
            value={classNumber}
            onChange={(e) => {
              setClassNumber(e.target.value);
            }}
          />
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
            placeholder="Fjalëkalimi i juaj"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <input
            className="form-control"
            type={"password"}
            placeholder="Kodi"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
          <p className={styles.changeParagraph}>
            Keni llogari ?{" "}
            <span className={styles.changeLink}>
              <Link href={"/auth/login"}>Kyçuni</Link>
            </span>
          </p>
          <button className={styles.submitButton}>Krijo</button>
        </form>
      </div>
    </>
  );
}
