import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { MoveRight } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center font-medium">
      <div className="flex flex-col items-center h-2/3">
        <span className="text-primary font-bold text-9xl">404</span>
        <span className="text-primary mt-6 pb-6">Page not found</span>
        <Button className="h-12 bg-primary py-2 px-10">
          <Link to="/">
            <div className="flex flex-col justify-center items-center">
              <p className="text-xl text-white">Go back home</p>
              <MoveRight className="text-white" size={25} />
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
