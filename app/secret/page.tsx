import Link from "next/link";
import { SecretForm } from "./secret-form";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <div className="absolute inset-0 top-10 left-10 text-white font-semibold cursor-pointer w-fit">
        <Link href="/" className="flex gap-1 items-center hover:text-gray-400 w-fit"><ArrowLeft size={15} /> Back to Home</Link>
      </div>
      <div className="flex flex-col gap-2">
        <SecretForm />
      </div>
    </div>
  )

}
