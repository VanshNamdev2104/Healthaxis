import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useAuth';

const Protected = ({ children, role }) => {
    const { handleGetCurrentUser } = useAuth()
    const { user } = useSelector((state) => state.auth);

    const navigate = useNavigate();

    // Fetch user only once
    useEffect(() => {
        handleGetCurrentUser();
    }, []);

    // Handle auth logic
    useEffect(() => {
        if (user === null) return;

        if (!user) {
            navigate("/");
        }

        if (role && user?.role !== role) {
            navigate("/");
        }
    }, [user, role, navigate]);

    return <div>{children}</div>;
}

export default Protected;