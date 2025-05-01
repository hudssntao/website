import { Button } from "@/components/ui/button";
import { ArrowDown, MousePointerClick } from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full flex flex-col gap-6 justify-center items-center bg-background overflow-y-auto">
      <div className="w-full h-screen flex flex-col justify-center items-start p-5 select-none">
        <div className="flex flex gap-2">
          <div className="text-[15rem] font-bold">hudson</div>
          <div className="text-[6rem] font-bold text-primary animate-pulse">tao</div>
        </div>
        <div className="flex justify-center items-center gap-2 pl-5 animate-bounce text-primary">
          scroll scroll scroll scroll
          <ArrowDown />
        </div>
      </div>
      <div className="flex gap-2 h-screen items-center justify-center">
        <div className="flex flex-col gap-4 select-none">
          <div className="flex justify-center items-center gap-2 font-bold text-primary">
            click click click <MousePointerClick />
          </div>
          <div className="flex gap-4">
            <Link to="/resume">
              <Button variant="outline">Resume</Button>
            </Link>
            <a href="https://github.com/hudssntao">
              <Button variant="outline">Github</Button>
            </a>
            <a href="https://www.linkedin.com/in/hudson-tao-194ab3290">
              <Button variant="outline">LinkedIn</Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
