import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full h-screen bg-rose-100 flex flex-col gap-6 justify-center items-center">
      <div className="flex flex-col items-center gap-4 text-3xl font-semibold text-center text-neutral-800">
        <div>Welcome!</div>
        <div>I&apos;m Hudson</div>
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
      <div className="absolute top-10 right-10 w-fit ">
        <Link className="flex gap-1 items-center font-semibold hover:text-rose-900 w-fit" href="/secret" >
          Enter Vault<ArrowRight size={15} /></Link>
      </div>
    </div>
  );
}
