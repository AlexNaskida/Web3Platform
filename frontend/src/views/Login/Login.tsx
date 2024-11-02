import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiInstance } from "@/hooks/mainhook";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { z } from "zod";

const APILoginUrl = "/login";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormFields = z.infer<typeof LoginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      console.log(data);
      const response = await apiInstance.post(APILoginUrl, data);
      console.log(response);
      if (response.status === 200) {
        toast({
          title: "User Authenticated Successfully!",
          description: "Welcome back!",
          variant: "default",
          className: "bg-green-500 text-white border-none",
        });
        navigate("/");
      }
    } catch (err) {
      console.log("Error code executed");
      const error = err as AxiosError;
      const response = error.response as AxiosResponse;
      console.log(response);
      if (
        response.status === 400 &&
        response.data.detail === "Incorrect password"
      ) {
        setError("password", {
          type: "manual",
          message: response.data.detail,
        });
      }
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-primary items-center text-primary">
      <div className="flex justify-center items-center h-20">
        <Toaster />
      </div>
      <div className="flex flex-col w-1/3 h-2/3 shadow-2xl bg-white rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Login</h1>
        <form
          className="flex flex-col h-full w-full gap-4 justify-center items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full gap-4 items-center border-2 border-primary rounded-2xl px-4 py-3">
              <Mail size={25} className="lg:size-10 text-primary" />
              <input
                {...register("email")}
                placeholder="E-mail"
                type="text"
                className="text-black font-medium text-lg flex-1 outline-0"
              />
            </div>
            {errors.email && (
              <div className="text-red-500 mt-2">{errors.email.message}</div>
            )}
          </div>

          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full gap-2 items-center border-2 border-primary rounded-2xl px-4 py-3">
              <Lock size={25} className="lg:size-10 text-primary" />
              <input
                {...register("password")}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                className="text-black font-medium text-lg flex-1 outline-0"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-primary"
              >
                {showPassword ? <EyeOff size={30} /> : <Eye size={30} />}
              </button>
            </div>
            {errors.password && (
              <div className="text-red-500 mt-2">{errors.password.message}</div>
            )}
          </div>

          <button
            className="w-56 h-12 text-lg bg-primary font-bold text-white rounded-3xl hover:bg-primary-600 transition-colors duration-300"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "Login"}
          </button>
        </form>
        <p className="text-center text-primary mt-2">
          Don't Have an Account?{" "}
          <Link to="/register" className="underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
