import React, { useEffect } from 'react'
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useAuth';

const Protected = ({ children, role, roleComponentMap = null }) => {
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

        if (!roleComponentMap && role && user?.role !== role) {
            navigate("/");
        }
    }, [user, role, roleComponentMap, navigate]);

    if (user === null) {
        return <div>Loading...</div>;
    }

    if (!user) return null;

    if (roleComponentMap) {
        console.log("check", roleComponentMap);
        console.log("USER:", user);
        console.log("ROLE:", user?.role);
        console.log("MAP KEYS:", Object.keys(roleComponentMap || {}));
        const Component = roleComponentMap[user?.role];
        return Component ? <Component /> : <div>Unauthorized</div>;
    }

    return <div>{children}</div>;
}

export default Protected;