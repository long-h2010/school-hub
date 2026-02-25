import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/auth-context';
import { Loading } from '../components/common';
import NotFound from '../pages/not-found';

interface Props {
    requiredRole?: string;
}

const ProtectedRoute = ({requiredRole}: Props) => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) return <Loading />;
    if (!isAuthenticated) return <Navigate to='/login' replace />;
    if (requiredRole && user.role != requiredRole) return <NotFound />;

    return <Outlet />;
}

export default ProtectedRoute;
