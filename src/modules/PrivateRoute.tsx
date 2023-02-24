import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './Auth';

interface PrivateRouteProps {
	children?: React.ReactNode;
}
interface User {
	user?: {
		email: string;
	};
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
	const user = useContext<User>(AuthContext);

	if (user?.user?.email) {
		return <Outlet />;
	} else {
		return <Navigate to='/' />;
	}
};

export default PrivateRoute;
