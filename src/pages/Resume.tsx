import { useEffect } from "react";

export default function Resume() {
  useEffect(() => {
    // Open the PDF in a new tab when the component mounts
    window.open("/resume.pdf", "_blank");
    // Navigate back to the previous page
    window.history.back();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Opening Resume...</h1>
        <p className="text-lg">The resume should open in a new tab.</p>
        <p className="text-sm text-gray-400 mt-2">
          If it doesn't open automatically,{" "}
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}
