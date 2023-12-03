import { useEffect, useState } from "react";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";
import { firebaseAuth } from "@/utils/FirebaseConfig";
import axios from "axios";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

function Login() {
  const router = useRouter();

  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  useEffect(()=> {
    if(userInfo?.id && !newUser) router.push("/");
  },[userInfo,newUser])

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const {
        user: { displayName: name, email, photoURL: profileImage },
      } = await signInWithPopup(firebaseAuth, provider);

      if (email) {
        handleLoginSuccess(name, email, profileImage);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmailLogin = async () => {
    if (!isValidEmail(email)) {
      console.log("Invalid email format");
      return;
    }

    try {
      const { user } = await signInWithEmailAndPassword(firebaseAuth, email, password);

      if (user) {
        const { displayName: name, email, photoURL: profileImage } = user;
        handleLoginSuccess(name, email, profileImage);
      }
    } catch (error) {
      console.error("Email login error:", error.code, error.message);
    }
  };

  const handleRegister = async () => {
    if (!isValidEmail(email)) {
      console.log("Invalid email format");
      return;
    }

    try {
      const { user } = await createUserWithEmailAndPassword(firebaseAuth, email, password);

      if (user) {
        await updateProfile(user, { displayName });
        handleLoginSuccess(user.displayName, user.email, user.photoURL);
      }
      router.push("/onboarding");
    } catch (error) {
      console.error("Registration error:", error.code, error.message);
    }
  };

  const handleLoginSuccess = async (name, email, profileImage) => {
    try {
      const { data } = await axios.post(CHECK_USER_ROUTE, { email });

      if (!data.status) {
        dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            name,
            email,
            profileImage,
            status: "Available",
          },
        });
        router.push("/onboarding");
      } else {
        const {id,name,email,profilePicture:profileImage,status} = data.data;
        dispatch({
          type: reducerCases.SET_USER_INFO,
          userInfo: {
            id,name,email,profileImage,status
          },
        });
        router.push("/")
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleToggleMode = () => {
    setIsRegistering((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6rs">
      <div className="flex items-center justify-center gap-2 text-white">
        <img src="/rasapp.gif" alt="rasapp" loading="eager" height={300} width={300} />
        <span className="text-6xl">Rasapp</span>
      </div>
      <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-md">
        {isRegistering && (
          <input
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="p-3 m-2 border border-gray-300 rounded-md w-full"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-3 m-2 border border-gray-300 rounded-md w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-3 m-2 border border-gray-300 rounded-md w-full"
        />
        <button
          className="bg-search-input-container-background text-white p-3 rounded-md w-full mb-3"
          onClick={isRegistering ? handleRegister : handleEmailLogin}
        >
          {isRegistering ? "Register" : "Login With Email/Password"}
        </button>
        {/* Google Login */}
        <button
          className="flex items-center justify-center gap-6 bg-search-input-container-background p-5 rounded-lg"
          onClick={handleGoogleLogin}
        >
          <FcGoogle className="text-4xl" />
          <span className="text-white text-2xl">Login With Google</span>
        </button>
      </div>
      <button
        className="text-sm text-gray-500 cursor-pointer mt-2"
        onClick={handleToggleMode}
      >
        {isRegistering ? "Already have an account? Login" : "Don't have an account? Register"}
      </button>
    </div>
  )
}

export default Login;