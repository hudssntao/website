import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col gap-6 justify-center items-center">
      <div className="flex flex-col items-center gap-4 text-3xl font-semibold text-center text-neutral-800">
        <div>Welcome!</div>
        <div>I&apos;m Hudson</div>
      </div>
      <div className="flex gap-2">
        <Link to="/resume">
          <Button variant="outline">Resume</Button>
        </Link>
        <Link to="/projects">
          <Button variant="outline">Projects</Button>
        </Link>
        <a href="https://github.com/hudssntao">
          <Button variant="outline">Github</Button>
        </a>
        <a href="https://www.linkedin.com/in/hudson-tao-194ab3290">
          <Button variant="outline">LinkedIn</Button>
        </a>
      </div>
    </div>
  );
}
