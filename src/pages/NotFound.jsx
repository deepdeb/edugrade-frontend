import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-gray-500 mb-6">The page you are looking for doesn't exist yet.</p>
      <Link to="/dashboard" className="bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-md hover:bg-yellow-600 transition">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default NotFound;