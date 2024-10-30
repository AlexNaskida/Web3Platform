import { Link } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { MoveRight } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center font-medium">
      <div className="flex flex-col items-center h-2/3">
        <span className="text-white font-bold text-8xl">404</span>
        <span className="mt-6 pb-6">Page not found</span>
        <Button className="h-12 bg-foreground py-2 px-10">
          <Link to="/">
            <div className="flex flex-col justify-center items-center">
              <p className="text-lg text-orange-600">Go back home</p>
              <MoveRight className="text-orange-600" size={25} />
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
