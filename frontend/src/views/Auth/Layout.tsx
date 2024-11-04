import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";

const AuthLayout = () => {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="flex justify-center min-h-screen bg-primary items-center text-primary">
      <div className="flex justify-center items-center h-20">
        <Toaster />
      </div>
    </div>
  );
};

export default AuthLayout;
