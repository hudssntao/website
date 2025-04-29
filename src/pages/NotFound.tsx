import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="w-full h-screen bg-rose-100 flex flex-col gap-6 justify-center items-center">
      <div className="text-3xl font-semibold text-center text-neutral-800">
        404 - Page Not Found
      </div>
      <p className="text-neutral-600">The page you are looking for doesn't exist.</p>
      <Link to="/">
        <Button variant="outline">Go Home</Button>
      </Link>
    </div>
  );
}
