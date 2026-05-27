import { useState, useEffect } from 'react';
import apiClient from '../api/client';
import { BookOpen, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const response = await apiClient.get('/courses/my-courses/');
        setCourses(response.data);
      } catch (error) {
        console.error("Failed to fetch enrolled courses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">My Courses</h2>
      <p className="text-gray-500 mb-8">Track your progress and continue learning.</p>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading your courses...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">You haven't enrolled in any courses yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link to={`/courses/${course.id}`} key={course.id}>
              <div key={course.id} className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition group overflow-hidden">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-300 group-hover:text-yellow-500 transition" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">{course.description || 'No description provided.'}</p>

                  {/* Changed button state to show they are enrolled */}
                  <div className="flex items-center justify-center gap-2 text-green-600 font-semibold py-2.5 rounded-md bg-green-50 border border-green-100">
                    <CheckCircle className="w-5 h-5" />
                    Enrolled
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyCourses;