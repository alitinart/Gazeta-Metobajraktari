import Router from "next/router";
import React from "react";
import { useSelector } from "react-redux";

export default function AccountIcon() {
  const state = useSelector((state) => state);

  return state && localStorage.getItem("token") ? (
    <div className="account-button">
      <i
        className="bi bi-person"
        onClick={() => {
          Router.push(`/account/${state.userObject._id}`);
        }}
      ></i>
    </div>
  ) : (
    <></>
  );
}
