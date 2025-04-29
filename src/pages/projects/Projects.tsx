import { Link } from "react-router-dom";

export default function Projects() {
  return (
    <div className="w-full min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Projects</h1>
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
