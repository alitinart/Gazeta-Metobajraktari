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
  const [type, setType] = useState("student");

  useEffect(async () => {
    if (await authGuard(localStorage.getItem("token"))) {
      Router.push("/");
    }
    return () => {};
  }, []);

  const SUPER_SECRET_PASSWORD = process.env.NEXT_PUBLIC_SUPER_SECRET_PASSWORD;

  const onSubmit = async () => {
    if (password.length < 8) {
      return NotificationService(
        "Error",
        "Ju lutemi vendoseni një fjalë kalim më të sigurt",
        "danger"
      );
    }
    if (type === "autor") {
      const resData = await userRequests.registerAutorRequest(
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
      Router.push("/auth/login");
    } else if (type === "student") {
      const resData = await userRequests.registerStudentRequest(
        email,
        password,
        classNumber,
        fullName
      );
      if (resData.error) {
        return NotificationService("Error", resData.message, "danger");
      }
      NotificationService("Sukses", resData.message, "success");
      Router.push("/auth/login");
    }
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
            placeholder="Emri Juaj sh. Filan Fisteku"
            required
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />
          <input
            className="form-control"
            type={"text"}
            placeholder="Klasa Juaj sh. IX/3"
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
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
            }}
            className="form-control"
          >
            <option value={"student"}>Student</option>
            <option value={"autor"}>Autor</option>
          </select>
          {type === "autor" ? (
            <input
              className="form-control"
              type={"password"}
              placeholder="Kodi"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
              }}
            />
          ) : (
            <></>
          )}
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
