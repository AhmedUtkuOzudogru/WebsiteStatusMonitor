import React, {useEffect} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import BackgroundShape from "./components/BackgroundShape.jsx";
import LoadingAnimation from "./components/LoadingAnimation.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import EmailVerification from "./pages/EmailVerification.jsx";
import {Toaster} from "react-hot-toast";
import {useAuthStore} from "./store/authStore.js";
import ResetPassword from "./pages/ResetPassword.jsx";
import AddWebsite from "./pages/AddWebsite.jsx";
import DeleteWebsite from "./pages/DeleteWebsite.jsx";

const ProtectedRoute = ({children}) => {
    const {isAuthenticated,user} = useAuthStore();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>
    }
    if(!user.isVerified){
        return <Navigate to="/verify-email" replace/>
    }
    return children;
};

const RedirectAuthenticatedUser = ({children}) => {
    const {isAuthenticated,user} = useAuthStore();
    if (isAuthenticated && user.isVerified) {
        return <Navigate to="/dashboard" replace/>
    }
    return children;
};

function App() {
    const {isCheckingAuth,checkAuth} = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if(isCheckingAuth) return <LoadingAnimation/>;

    return (
        <>
            <div
                className='min-h-screen bg-gradient-to-br
    from-teal-800 via-cyan-500 to-blue-300 flex items-center justify-center relative overflow-hidden'
            >
                <BackgroundShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
                <BackgroundShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
                <BackgroundShape color='bg-red-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
                <Routes>
                    <Route path="/dashboard" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                    }
                    />
                    <Route path="/add-website" element={
                    <ProtectedRoute>
                        <AddWebsite />
                    </ProtectedRoute>
                    }
                    />
                    <Route path="/delete-website" element={
                    <ProtectedRoute>
                        <DeleteWebsite />
                    </ProtectedRoute>
                    }
                    />
                    <Route path="/signup"
                           element={
                        <RedirectAuthenticatedUser>
                        <SignUp />
                        </RedirectAuthenticatedUser>
                    }
                    />
                    <Route path="/login" element={
                        <RedirectAuthenticatedUser>
                        <Login />
                        </RedirectAuthenticatedUser>
                    }
                    />
                    <Route path="/verify-email" element={<EmailVerification />} />
                    <Route path="/forgot-password" element=
                        {
                        <RedirectAuthenticatedUser>
                          <ForgotPassword/>
                         </RedirectAuthenticatedUser>
                        }
                    />
                    <Route
                        path='/reset-password/:token'
                        element={
                        <RedirectAuthenticatedUser>
                            <ResetPassword />
                        </RedirectAuthenticatedUser>
                        }
                    />
                </Routes>
                <Toaster />
            </div>
        </>
    );
}

export default App;