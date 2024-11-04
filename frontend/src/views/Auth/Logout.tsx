import { useNavigate } from "react-router-dom";
import { apiInstance } from "@/hooks/mainhook";
// import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { AxiosError, AxiosResponse } from "axios";

const APILogoutUrl = "/logout";

interface UserLogoutResponse {
  status: number;
  detail: string;
}

const Logout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const response = await apiInstance.post<UserLogoutResponse>(
        APILogoutUrl,
        {},
        { withCredentials: true }
      );

      console.log(response);
      if (response.data.status === 200) {
        toast({
          title: "User Logged Out Successfully!",
          variant: "default",
          className: "bg-green-500 text-white border-none",
        });

        navigate("/login");
      }
    } catch (err) {
      console.log("Error code executed");
      const error = err as AxiosError;
      const response = error.response as AxiosResponse;
      console.log(response);
      if (response.status === 401) {
        toast({
          title: response?.data?.detail || "Logout failed",
          variant: "default",
          className: "bg-red-500 text-white border-none",
        });
      }
    }
  };

  return (
    <button
      type="button"
      onClick={() => handleLogout()}
      className="flex w-full justify-center items-center"
    >
      <div className="flex justify-center items-center w-2/3 h-12 border-3 border-primary rounded-full">
        <p className="text-primary text-center text-xl font-bold">Logout</p>
      </div>
    </button>
  );
};

export default Logout;
