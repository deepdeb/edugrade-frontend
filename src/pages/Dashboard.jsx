import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { BookOpen } from 'lucide-react';

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get('/courses/');
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Course Catalog</h2>
      <p className="text-gray-500 mb-8">Browse our available courses and start learning today.</p>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
          <p className="text-gray-500">No published courses available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition group overflow-hidden">
              <div className="h-40 bg-gray-100 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-gray-300 group-hover:text-yellow-500 transition" />
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{course.description || 'No description provided.'}</p>
                <button className="w-full bg-yellow-500 text-gray-900 font-semibold py-2.5 rounded-md hover:bg-yellow-600 transition duration-300">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;