import { ArrowLeft, Text } from "lucide-react";
import { Link } from "react-router-dom";

export default function Blog() {
  return (
    <div className="w-full flex flex-col gap-6 justify-center items-center bg-background overflow-y-auto">
      <div className="w-full h-screen flex flex-col justify-center items-start p-5 select-none">
        <Link to="/" className="flex gap-2 items-center">
          <ArrowLeft /> back
        </Link>
        <div className="text-[15rem] font-bold">blog</div>
        <div className="flex justify-center items-center gap-2 pl-5 animate-bounce text-primary">
          read read read read
          <Text />
        </div>
      </div>
      <div
        className="flex gap-2 h-screen items-center justify-center cursor-pointer"
        onClick={() => {
          window.location.href = "https://yeezy.com";
        }}
      >
        kanye west
      </div>
    </div>
  );
}
