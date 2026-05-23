import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="w-full max-w-md text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
      <p className="text-gray-600 mb-8">Logged in as: <strong>{user?.email}</strong></p>
      
      <button 
        onClick={logout}
        className="w-full bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-lg hover:bg-gray-300 transition"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;