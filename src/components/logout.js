import { supabase } from '../supabase-client';

const Logout = () => {
    const logOut = async () => {
        supabase.auth.signOut();
    };

    return (
        <button onClick={logOut}>Log out</button>
    );
}

export default Logout;