import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen bg-rose-100 flex flex-col gap-6 justify-center items-center">
      <div className="text-6xl text-neutral-800">
        <h1>Hi!</h1>
        <h1>I&apos;m Hudson.</h1>
      </div>
      <div className="flex gap-2">
        <Link href="/resume">
          <Button variant="outline">Resume</Button>
        </Link>
        <Link href="/projects">
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
