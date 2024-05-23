import React, { ReactNode, useEffect } from "react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import { loggedInAtom, loginStateAtom } from "../state/ui.ts";
import axios from "axios";
import { useSetAtom } from "jotai/index";

export interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard(props: AuthGuardProps) {
  const loggedIn = useAtomValue(loggedInAtom);
  const navigate = useNavigate();

  const updateLoggedIn = useSetAtom(loggedInAtom);
  const updateLoginState = useSetAtom(loginStateAtom);
  useEffect(() => {
    if (!loggedIn) {
      let savedToken = localStorage.getItem("token");
      if (savedToken) {
        if (savedToken.startsWith('"'))
          savedToken = savedToken.substring(1, savedToken.length - 1);

        // restore login state from token
        axios.defaults.headers.common["Authorization"] = "Bearer " + savedToken;
        updateLoginState(4);
        updateLoggedIn(true);
      } else {
        navigate("/login");
      }
    }
  }, [loggedIn]);

  return <>{loggedIn && props.children}</>;
}
