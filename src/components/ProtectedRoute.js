import React, { useEffect, useContext } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { supabase } from '../supabase-client';

function ProtectedRoute () {
    const [session, setSession] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    
    const fetchSession = async () => {
        const currentSession = await supabase.auth.getSession();
        console.log(currentSession);
        setSession(currentSession.data.session);
        setLoading(false);
    }

    useEffect(() => {
        fetchSession();
    }, []);

    if (loading) return <div>Loading...</div>; 

    return session ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoute;