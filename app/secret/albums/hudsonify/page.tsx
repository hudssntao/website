import Link from "next/link";
import { ArrowLeft } from 'lucide-react';
import ImageMosaic from "./mosaic";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function Page({ searchParams }: { searchParams: { [key: string]: string } }) {
  const prisma = new PrismaClient();

  const mainImageId = searchParams.cnvt;

  const mainImage = await prisma.image.findFirst({
    where: {
      id: parseInt(mainImageId),
    }
  })

  if (!mainImage) {
    redirect("/secret/albums");
  }

  const tileImages = await prisma.image.findMany({
    where: {
      role: "ALT",
      averageColor: {

      }
    }
  }).then(images => images.map(image => ({ ...image, id: image.id.toString(), averageColor: image.averageColor ?? "" })))


  return (<div className="flex flex-col justify-center items-center min-h-screen bg-white overflow-x-hidden">
    <div className="w-fit z-10 p-10">
      <div className="font-semibold cursor-pointer">
        <Link href="/secret/albums" className="flex gap-1 items-center hover:text-gray-800 w-fit">
          <ArrowLeft size={15} /> Back to Gallery
        </Link>
      </div>
    </div>

    <ImageMosaic mainImageSrc={mainImage.url} tileImages={tileImages} />
  </div>)
}
