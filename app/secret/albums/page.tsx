import Link from "next/link";
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Popup from './_components/popup';
import { ArrowLeft } from 'lucide-react';
import Gallery from "./gallery";

export default async function Page() {
  const cookieStore = cookies();

  const validated = cookieStore.get("valid")?.value === "true";
  const seenPopup = cookieStore.get("hasSeenPopup")?.value === "true";

  if (!validated) {
    redirect("/");
  }

  const prisma = new PrismaClient();

  const images = await prisma.image.findMany({
    where: {
      role: "MAIN"
    },
    orderBy: {
      createdAt: "asc"
    }
  })

  const marqueeText = "Happy Birthday! -- You're finally legal! -- Wow she's 18!! -- Holy moley she getting old! -- Still cant legally drink!! -- You can vote... after this election!! -- The prettiest girl I know!! -- I'm running out of things to say!! -- Just scroll down at this point!! -- Why are you still reading this??? -- Please scroll! -- Happy birthday ok!? -- Now move on!!! -- "

  return (
    <div className="flex flex-col min-h-screen bg-indigo-50 overflow-x-hidden">
      <div className="w-fit z-10 p-10">
        <div className="font-semibold cursor-pointer">
          <Link href="/" className="flex gap-1 items-center hover:text-gray-800 w-fit">
            <ArrowLeft size={15} /> Back to Home
          </Link>
        </div>
      </div>

      <div className="flex justify-center items-center w-full animate-marquee text-nowrap whitespace-nowrap">
        <span>{marqueeText}</span>
        <span>{marqueeText}</span>
      </div>

      <Gallery images={images} />


      <Popup hasSeenPopup={seenPopup} />
    </div>)
}
