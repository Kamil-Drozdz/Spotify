import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './Auth';

interface PrivateRouteProps {
	children?: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
	const user = useContext(AuthContext);

	if (user) {
		return <Outlet />;
	} else {
		return <Navigate to='/' />;
	}
};

export default PrivateRoute;
