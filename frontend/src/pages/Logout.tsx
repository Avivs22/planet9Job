import { useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSetAtom } from "jotai/index";
import { loggedInAtom, loginStateAtom } from "../state/ui.ts";

export default function LogoutPage() {
  const updateLoggedIn = useSetAtom(loggedInAtom);
  const updateLoginState = useSetAtom(loginStateAtom);
  const navigate = useNavigate();
  useLayoutEffect(() => {
    localStorage.removeItem("token");
    updateLoggedIn(false);
    updateLoginState(0);
    navigate("/login");
  }, []);

  return <></>;
}
