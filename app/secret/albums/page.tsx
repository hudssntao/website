import Link from "next/link";
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Popup from './_components/popup';
import { ArrowLeft } from 'lucide-react';

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
  })

  return (<>
    <div className="w-screen h-screen flex justify-center items-center bg-blue-950">
      <div className="absolute inset-0 top-10 left-10 text-white font-semibold cursor-pointer w-fit">
        <Link href="/" className="flex gap-1 items-center hover:text-gray-400 w-fit"><ArrowLeft size={15} /> Back to Home</Link>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={image.id} className="relative group">
              <img
                src={image.url}
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center">
                <span className="text-white text-lg font-semibold">View Image</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <Popup hasSeenPopup={seenPopup} />
  </>)
}
