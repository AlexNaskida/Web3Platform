import { CircleUserRound, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiInstance } from "@/hooks/mainhook";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { z } from "zod";
import { Toaster } from "@/components/ui/toaster";

const APIRegisterUrl = "/register";

const RegisterSchema = z.object({
  name: z.string().min(3).max(32),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

type FormFields = z.infer<typeof RegisterSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword_1, setShowPassword_1] = useState(false);
  const [showPassword_2, setShowPassword_2] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(RegisterSchema),
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    // Send this to backend
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });

      return;
    }

    try {
      const response = await apiInstance.post(APIRegisterUrl, data);

      if (response.data.status === 200) {
        toast({
          title: "Account Created Successfully!",
          description: "You can now login with your credentials",
          variant: "default",
          className: "bg-green-500 text-white border-none",
        });
        navigate("/login");
      }

      if (!response.data) {
        throw new Error("Error with receiving data");
      }
    } catch (err) {
      const error = err as AxiosError;
      const response = error.response as AxiosResponse;

      if (
        response.status === 400 &&
        response.data.detail == "Email already registered"
      ) {
        setError("email", {
          type: "manual",
          message: response.data.detail,
        });
        return; // What is this return for? What will happen if we remove it? Am i gonna to get stuck on this? IDK
      }
    }
  };

  const handleShowPasswordToggle = () => {
    setShowPassword_1(!showPassword_1);
  };

  const handleShowConfirmPasswordToggle = () => {
    setShowPassword_2(!showPassword_2);
  };

  return (
    <div className="flex justify-center min-h-screen bg-primary items-center text-primary z-0">
      {/* fix this later */}
      <div className="flex justify-center items-center h-20 z-50">
        <Toaster />
      </div>
      <div className="flex flex-col w-1/3 h-2/3 shadow-2xl bg-white rounded-3xl p-8">
        <h1 className="text-4xl font-bold text-center mb-8">Register</h1>
        <form
          className="flex flex-col h-full w-full gap-4 justify-center items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full gap-4 justify-start items-center border-2 border-primary rounded-2xl px-4 py-3">
              <CircleUserRound size={25} className="lg:size-8 text-primary" />
              <input
                {...register("name")}
                placeholder="Name"
                type="text"
                className="text-black font-medium text-lg flex-1 outline-0"
              />
            </div>
            {errors.name && (
              <div className="text-start text-red-500 mt-2">
                {errors.name.message}
              </div>
            )}
          </div>

          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full gap-4 justify-start items-center border-2 border-primary rounded-2xl px-4 py-3">
              <Mail size={25} className="lg:size-8 text-primary" />
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
            <div className="flex flex-row w-full gap-2 justify-start items-center border-2 border-primary rounded-2xl px-4 py-3">
              <Lock size={25} className="lg:size-8 text-primary" />
              <input
                {...register("password")}
                placeholder="Password"
                type={showPassword_1 ? "text" : "password"}
                className="text-black font-medium text-lg flex-1 outline-0"
              />
              <button
                type="button"
                onClick={handleShowPasswordToggle}
                className="text-primary"
              >
                {showPassword_1 ? <EyeOff size={30} /> : <Eye size={30} />}
              </button>
            </div>
            {errors.password && (
              <div className="text-red-500 mt-2">{errors.password.message}</div>
            )}
          </div>

          <div className="flex flex-col w-full">
            <div className="flex flex-row w-full gap-2 justify-start items-center border-2 border-primary rounded-2xl px-4 py-3">
              <Lock size={25} className="lg:size-8 text-primary" />
              <input
                {...register("confirmPassword")}
                placeholder="Confirm Password"
                type={showPassword_2 ? "text" : "password"}
                className="text-black font-medium text-lg flex-1 outline-0"
              />
              <button
                type="button"
                onClick={handleShowConfirmPasswordToggle}
                className="text-primary"
              >
                {showPassword_2 ? <EyeOff size={30} /> : <Eye size={30} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="text-red-500 mt-2">
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          <button
            className="w-56 h-12 text-lg bg-primary font-bold text-white rounded-3xl hover:bg-primary-600 transition-colors duration-300"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Loading..." : "CREATE ACCOUNT"}
          </button>
        </form>
        <p className="text-center text-primary mt-2">
          Already Have an Account?{" "}
          <Link to="/login" className="underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
