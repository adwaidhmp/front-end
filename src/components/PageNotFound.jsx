import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const PageNotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-5xl font-bold text-gray-800 mb-2">404</h1>
        <p className="text-lg text-gray-600 mb-6">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="inline-block px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
