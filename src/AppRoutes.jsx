import React from 'react'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import { Navigate, Route, Routes } from 'react-router-dom';
import TopBlackBar from './components/TopBlackBar';
import Landing from './pages/Landing';

const AppRoutes = () => {
    return (
        <>
            <TopBlackBar />
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
                                <TopBlackBar />
                                <main className="flex-1 p-6 lg:p-8">
                                    <div className='max-w-6xl mx-auto'>
                                        <Dashboard />
                                    </div>
                                </main>
                            </div>
                        </PrivateRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </>
    );
}

export default AppRoutes