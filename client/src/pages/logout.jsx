import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";
import { useEffect } from "react";

function logout() {
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const router = useRouter();
  useEffect(() => {
    if (socket && socket.current && userInfo && userInfo.id) {
      socket.current.emit("Signout", userInfo.id);
    }
  
    dispatch({ type: reducerCases.SET_USER_INFO, userInfo: undefined });
    signOut(firebaseAuth);
    router.push("/login");
  }, [socket, userInfo, dispatch, router, firebaseAuth]);
  return <div className="bg-conversation-panel-background"></div>
}

export default logout;
