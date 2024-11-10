import Image from "next/image";
import Link from "next/link";

type GalleryProps = {
  images: { id: number | string, url: string }[];
}

export default function Gallery({ images }: GalleryProps) {
  return (<div className="p-10">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image, index) => (
        <Link key={image.id} href={`/secret/albums/hudsonify?cnvt=${image.id}`}>
          <div className="relative group aspect-square">
            <Image
              src={image.url}
              alt={`Gallery image ${index + 1}`}
              width={1000}
              height={1000}
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-blue-950 scale-105 rounded-lg bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out flex items-center justify-center cursor-pointer">
              <span className="text-white text-lg font-semibold">Hudsonify Image</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
  )
}
