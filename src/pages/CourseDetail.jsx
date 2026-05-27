import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toast } from 'sonner';
import apiClient from '../api/client';
import { CheckCircle, Circle, ArrowLeft } from 'lucide-react';

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await apiClient.get(`/courses/${courseId}`);
        setCourse(response.data);
      } catch (error) {
        toast.error(error.response?.data?.detail || "Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleCompleteModule = async (moduleId) => {
    setCompletingId(moduleId);
    try {
      await apiClient.post(`/progress/${moduleId}/complete`);
      toast.success("Module completed!");
      
      // Optimistically update the UI without needing to refetch the whole course
      setCourse(prevCourse => ({
        ...prevCourse,
        modules: prevCourse.modules.map(mod =>
          mod.id === moduleId ? { ...mod, is_completed: true } : mod
        )
      }));
    } catch (err) {
      toast.error("Failed to mark complete.");
    } finally {
      setCompletingId(null);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-500">Loading course content...</div>;
  if (!course) return null;

  return (
    <div>
      {/* Back Button */}
      <Link to="/courses" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
        <ArrowLeft className="w-4 h-4" />
        Back to My Courses
      </Link>

      {/* Course Header */}
      <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{course.title}</h1>
        <p className="text-gray-500 leading-relaxed">{course.description || 'No description provided.'}</p>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Course Modules</h3>
        
        {course.modules.length === 0 ? (
          <p className="text-gray-400 text-sm">No modules available for this course yet.</p>
        ) : (
          course.modules
            .sort((a, b) => a.order - b.order) // Ensure they display in correct order
            .map((mod) => (
              <div 
                key={mod.id} 
                className={`flex items-center justify-between p-4 rounded-lg border transition ${
                  mod.is_completed ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-4">
                  {mod.is_completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-300 shrink-0" />
                  )}
                  <span className={`font-medium ${mod.is_completed ? 'text-green-800 line-through' : 'text-gray-800'}`}>
                    {mod.title}
                  </span>
                </div>

                {!mod.is_completed && (
                  <button 
                    onClick={() => handleCompleteModule(mod.id)}
                    disabled={completingId === mod.id}
                    className="bg-yellow-500 text-gray-900 text-sm font-semibold px-4 py-2 rounded-md hover:bg-yellow-600 transition disabled:opacity-50"
                  >
                    {completingId === mod.id ? 'Saving...' : 'Mark Complete'}
                  </button>
                )}
              </div>
            ))
        )}
      </div>
    </div>
  );
}

export default CourseDetail;