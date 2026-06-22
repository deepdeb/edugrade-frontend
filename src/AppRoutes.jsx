import React from 'react'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import Landing from './pages/Landing';
import TopBar from './components/TopBar';
import NotFound from './pages/NotFound';
import MyCourses from './pages/MyCourses';
import { Navigate, Route, Routes } from 'react-router-dom';
import CourseDetail from './pages/CourseDetail';
import Studio from './pages/Studio';

const AppRoutes = () => {
    return (
        <>
            <TopBar />
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Private Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <div className="min-h-screen bg-gray-50 flex flex-col">
                                <main className="flex-1 p-6 lg:p-8">
                                    <div className='max-w-6xl mx-auto'>
                                        <Dashboard />
                                    </div>
                                </main>
                            </div>
                        </PrivateRoute>
                    }
                />

                {/* Studio Route */}
                <Route
                    path="/studio"
                    element={
                        <PrivateRoute roles={['admin', 'instructor']}>
                            <div className="min-h-screen bg-gray-50 flex flex-col">
                                <main className="flex-1 p-6 lg:p-8">
                                    <div className="max-w-6xl mx-auto">
                                        <Studio />
                                    </div>
                                </main>
                            </div>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/courses/:courseId"
                    element={
                        <PrivateRoute>
                            <div className="min-h-screen bg-gray-50 flex flex-col">
                                <main className="flex-1 p-6 lg:p-8">
                                    <div className="max-w-3xl mx-auto"> {/* Narrower width for reading modules */}
                                        <CourseDetail />
                                    </div>
                                </main>
                            </div>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/courses"
                    element={
                        <PrivateRoute>
                            <div className="min-h-screen bg-gray-50 flex flex-col">
                                <main className="flex-1 p-6 lg:p-8">
                                    <div className="max-w-6xl mx-auto">
                                        <MyCourses />
                                    </div>
                                </main>
                            </div>
                        </PrivateRoute>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}

export default AppRoutes