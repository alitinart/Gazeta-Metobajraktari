import Head from "next/head";
import Router from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import authGuard from "../../guards/authGuard";
import NotificationService from "../../services/notifications.service";
import { userRequests } from "../../services/request.service";
import Link from "next/link";

export default function Account({ userObject }) {
  const state = useSelector((state) => state);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [classNumber, setClass] = useState("");

  useEffect(async () => {
    if (!(await authGuard(localStorage.getItem("token")))) {
      Router.push("/");
    }
    return () => {};
  }, []);

  const dispatch = useDispatch();

  const userSync = async () => {
    if (!localStorage.getItem("token")) {
      return;
    }
    const resSync = await userRequests.syncUser(localStorage.getItem("token"));
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

  const requestHandler = async (type) => {
    switch (type) {
      case "email":
        const resEmail = await userRequests.updateUser(state.token, { email });
        if (resEmail.error) {
          return NotificationService("Error", resEmail.message, "danger");
        }
        NotificationService("Sukses", resEmail.message, "success");
        userSync();
        setEmail("");
        break;
      case "password":
        if (password.length < 8) {
          return NotificationService(
            "Error",
            "Ju lutemi vendoseni një fjalë kalim më të sigurt",
            "danger"
          );
        }
        const resPassword = await userRequests.updateUser(state.token, {
          password,
        });
        if (resPassword.error) {
          return NotificationService("Error", resPassword.message, "danger");
        }
        NotificationService("Sukses", resPassword.message, "success");
        userSync();
        setPassword("");
        break;
      case "class":
        if (!classNumber.includes("/")) {
          return NotificationService(
            "Error",
            "Ju lutemi vendoseni klasën e juaj",
            "danger"
          );
        }
        const resClass = await userRequests.updateUser(state.token, {
          class: classNumber,
        });
        if (resClass.error) {
          return NotificationService("Error", resClass.message, "danger");
        }
        NotificationService("Sukses", resClass.message, "success");
        userSync();
        setClass("");
        break;
    }
  };

  const deleteHandler = async () => {
    const resDelete = userRequests.deleteUser(state.token);

    if (resDelete.error) {
      return NotificationService("Error", resDelete.message, "danger");
    }

    NotificationService("Sukses", resDelete.message, "success");
    console.log(resDelete);

    await userRequests.logout(localStorage.getItem("rTokenId"), state.token);
    localStorage.removeItem("token");
    localStorage.removeItem("rTokenId");
    dispatch({
      type: "logout",
    });

    Router.push("/");
  };

  return state && state.userObject ? (
    <>
      <Head>
        <title>{state.userObject.fullName}</title>
        <meta name="description" content={"Account"}></meta>
      </Head>
      <div className="account">
        <h1 className="title">Llogaria e juaj</h1>
        <h1 className="title">{state.userObject.fullName}</h1>
        {state.userObject.verified ? (
          <p
            style={{ textAlign: "center", color: "gray", marginBottom: "15px" }}
          >
            I Verifikuar
          </p>
        ) : (
          <button
            className="not-verified"
            onClick={() => {
              Router.push("/verify");
            }}
          >
            I pa verifikuar
          </button>
        )}
        <button className="btn btn-danger" onClick={deleteHandler}>
          Fshij Llogarinë
        </button>
        <div className="info-cards">
          <div className="email-card">
            <h1>{state.userObject.email}</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestHandler("email");
              }}
            >
              <input
                className="form-control"
                type={"email"}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Ndërro Email"
                required
              />
              <button className="btn" type="submit">
                Ndërro
              </button>
            </form>
          </div>
          <div className="password-card">
            <h1>Fjalëkalimi</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestHandler("password");
              }}
            >
              <input
                className="form-control"
                type={"password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                placeholder="Ndërro Fjalëkalimin"
                required
              />
              <button className="btn" type="submit">
                Ndërro
              </button>
            </form>
          </div>
          <div className="class-card">
            <h1>{state.userObject.class}</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                requestHandler("class");
              }}
            >
              <input
                className="form-control"
                type={"text"}
                value={classNumber}
                onChange={(e) => {
                  setClass(e.target.value);
                }}
                placeholder="Ndërro Klasën"
              />
              <button className="btn" type="submit">
                Ndërro
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
}
