import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut, isAuthenticated } from "../auth";
import { itemTotal } from "./cartHelpers";

const isActive = (history, path) => {
  const location = useLocation();
  if (location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "#ffffff" };
  }
};

const Menu = ({ history }) => {
  const navigate = useNavigate();
  return (
    <div>
      <ul className="nav nav-tabs bg-primary">
        <li className="nav-items">
          <Link className="nav-link" style={isActive(history, "/")} to="/">
            Home
          </Link>
        </li>

        <li className="nav-items">
          <Link className="nav-link" style={isActive(history, "/")} to="/shop">
            Shop
          </Link>
        </li>

        <li className="nav-items">
          <Link
            className="nav-link"
            style={isActive(history, "/cart")}
            to="/cart"
          >
            Cart
            <sup>
              <small className="cart-badge">{itemTotal()}</small>
            </sup>
          </Link>
        </li>

        {isAuthenticated() && isAuthenticated().user.role === 0 && (
          <li className="nav-items">
            <Link
              className="nav-link"
              style={isActive(history, "/user/dashboard")}
              to="/user/dashboard"
            >
              Dashboard
            </Link>
          </li>
        )}
        {isAuthenticated() && isAuthenticated().user.role === 1 && (
          <li className="nav-items">
            <Link
              className="nav-link"
              style={isActive(history, "/admin/dashboard")}
              to="/admin/dashboard"
            >
              Dashboard
            </Link>
          </li>
        )}

        {!isAuthenticated() && (
          <>
            <li className="nav-items">
              <Link
                className="nav-link"
                style={isActive(history, "/signin")}
                to="/signin"
              >
                Signin
              </Link>
            </li>
            <li className="nav-items">
              <Link
                className="nav-link"
                style={isActive(history, "/signup")}
                to="/signup"
              >
                Signup
              </Link>
            </li>
          </>
        )}

        {isAuthenticated() && (
          <li className="nav-items">
            <span
              className="nav-link"
              style={{ cursor: "pointer", color: "#ffffff" }}
              onClick={() =>
                signOut(() => {
                  navigate("/");
                })
              }
            >
              Signout
            </span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Menu;
