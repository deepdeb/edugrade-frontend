import React from 'react'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './PrivateRoute';
import { Navigate, Route, Routes } from 'react-router-dom';
import TopBlackBar from './components/TopBlackBar';

const AppRoutes = () => {
    return (
        <>
            <TopBlackBar />
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="rounded-lg bg-white p-8 shadow-lg w-full max-w-md">
                    <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Edugrade</h1>

                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="*" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
            </div>
        </>
    );
}

export default AppRoutes