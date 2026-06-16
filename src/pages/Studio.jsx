import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import apiClient from '../api/client';
import { Plus, ArrowLeft, Globe, GlobeLock, LoaderCircle } from 'lucide-react';

function Studio() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newModTitle, setNewModTitle] = useState('');
  const [newModOrder, setNewModOrder] = useState(1);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [toggleCourseId, setToggleCourseId] = useState(null);

  // Fetch all courses (including drafts) on load
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get('/courses/studio');
        setCourses(response.data);
      } catch (error) {
        toast.error("Failed to load studio courses.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Fetch modules when a course is selected
  const selectCourse = async (course) => {
    setSelectedCourse(course);
    try {
      const response = await apiClient.get(`/courses/studio/${course.id}`);
      setModules(response.data.modules || []);
      setNewModOrder((response.data.modules?.length || 0) + 1); // Auto-increment order
    } catch (error) {
      toast.error("Failed to load modules.");
    }
  };

  const goBack = () => {
    setSelectedCourse(null);
    setModules([]);
  };

  // Handler: Toggle Publish
  const handleTogglePublish = async (courseId) => {
    setToggleCourseId(courseId);
    try {
      const response = await apiClient.patch(`/courses/studio/${courseId}/publish`);

      const status = response.data.is_published ? 'published' : 'unpublished';
      toast.success(`Course ${status}!`);

      // Refresh the course list to show the new status
      const listRes = await apiClient.get('/courses/studio');
      setCourses(listRes.data);

      // If we are currently inside this course's detail view, update it there too
      if (selectedCourse && selectedCourse.id === courseId) {
        setSelectedCourse(response.data);
      }
    } catch (err) {
      toast.error("Failed to update course status.");
    } finally {
      setToggleCourseId(null);
    }
  };

  // Handler: Create Course
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setActionLoading(true);
    try {
      await apiClient.post('/courses/', { title: newTitle });
      toast.success(`"${newTitle}" created!`);
      setNewTitle('');

      // Refresh list
      const response = await apiClient.get('/courses/studio');
      setCourses(response.data);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create course.");
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Create Module
  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!newModTitle.trim()) return;

    setActionLoading(true);
    try {
      await apiClient.post(`/courses/${selectedCourse.id}/modules`, {
        title: newModTitle,
        order: newModOrder
      });
      toast.success(`Module "${newModTitle}" added!`);
      setNewModTitle('');
      setNewModOrder(prev => prev + 1); // Increment for the next one

      // Refresh modules list
      selectCourse(selectedCourse);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create module.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="text-center py-16 text-gray-500">Loading Studio...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Creator Studio</h2>
      <p className="text-gray-500 mb-8">Manage your courses and modules.</p>

      {/* VIEW 1: Course List & Creation */}
      {!selectedCourse ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Create Course Form */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 h-fit lg:sticky lg:top-24">
            <h3 className="font-bold text-gray-700 mb-4">Create a New Course</h3>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Course Title"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                required
              />
              <button
                type="submit"
                disabled={actionLoading}
                className="w-full bg-yellow-500 text-gray-900 font-semibold py-2.5 rounded-md hover:bg-yellow-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {actionLoading ? 'Creating...' : 'Add Course'}
              </button>
            </form>
          </div>

          {/* Course List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-gray-700">Your Courses</h3>
            {courses.length === 0 ? (
              <p className="text-gray-400 text-sm">You haven't created any courses yet.</p>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 flex items-center justify-between transition"
                >
                  <div
                    onClick={() => selectCourse(course)}
                    className="flex-1 cursor-pointer hover:text-yellow-600 transition"
                  >
                    <h4 className="font-semibold text-gray-800">{course.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {course.is_published ? 'Published' : 'Draft'} • ID: {course.id}
                    </p>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents opening the course detail
                      handleTogglePublish(course.id);
                    }}
                    disabled={toggleCourseId === course.id}
                    className={`ml-4 p-2 rounded-md transition cursor-pointer ${course.is_published
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}
                    title={course.is_published ? 'Unpublish' : 'Publish'}
                  >
                    {toggleCourseId === course.id ? <LoaderCircle className="w-5 h-5 text-yellow-500 animate-spin" /> : course.is_published ? <Globe className="w-5 h-5" /> : <GlobeLock className="w-5 h-5" />}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* VIEW 2: Module Management */
        <div>
          <button onClick={goBack} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>

          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-1">
              <div className='flex items-center gap-3'>
                <h3 className="text-xl font-bold text-gray-800">{selectedCourse.title}</h3>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${selectedCourse.is_published ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
                  {selectedCourse.is_published ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Toggle Button inside detail view */}

              <button
                onClick={() => handleTogglePublish(selectedCourse.id)}
                disabled={toggleCourseId === selectedCourse.id}
                className={`flex items-center gap-2 p-2 rounded-md text-sm font-medium transition cursor-pointer ${selectedCourse.is_published
                  ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                title={selectedCourse.is_published ? 'Unpublish' : 'Publish'}
              >
                {toggleCourseId === selectedCourse.id ? <><LoaderCircle className={`w-4 h-4 ${selectedCourse.is_published ? 'text-gray-500' : 'text-green-500'} animate-spin`} /> </> : selectedCourse.is_published ? <GlobeLock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-6">Manage the learning path for this course.</p>

            {/* Add Module Form */}
            <form onSubmit={handleCreateModule} className="flex flex-col sm:flex-row gap-3 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <input
                type="text"
                value={newModTitle}
                onChange={(e) => setNewModTitle(e.target.value)}
                placeholder="New Module Title (e.g., 'Introduction')"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                required
              />
              <input
                type="number"
                value={newModOrder}
                onChange={(e) => setNewModOrder(parseInt(e.target.value))}
                placeholder="Order"
                className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm"
                required
                min="1"
              />
              <button
                type="submit"
                disabled={actionLoading}
                className="bg-yellow-500 text-gray-900 font-semibold px-6 py-2 rounded-md hover:bg-yellow-600 transition disabled:opacity-50 flex items-center gap-2 text-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                {actionLoading ? 'Adding...' : 'Add Module'}
              </button>
            </form>

            {/* Modules List */}
            <h4 className="font-semibold text-gray-700 mb-3">Current Modules</h4>
            {modules.length === 0 ? (
              <p className="text-gray-400 text-sm">No modules yet. Add your first one above!</p>
            ) : (
              <div className="space-y-2">
                {modules
                  .sort((a, b) => a.order - b.order)
                  .map((mod) => (
                    <div key={mod.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100 text-sm">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-gray-400">#{mod.order}</span>
                        <span className="text-gray-700">{mod.title}</span>
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Studio;