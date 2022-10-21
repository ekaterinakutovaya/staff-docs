import React from 'react';
import { Navigate, useOutlet } from "react-router-dom";
import { useSelector } from "react-redux";

import { selectAuth, selectSidebarItem } from "store/selectors";

const PublicLayout: React.FC = () => {
    const { isAuth } = useSelector(selectAuth);
    const { selectedItem } = useSelector(selectSidebarItem);
    const outlet = useOutlet();
    
    if (isAuth) {
        return <Navigate to={`/dashboard${selectedItem}`} replace/>
    }
    return (
        <div>
            {outlet}
        </div>
    );
};

export default PublicLayout;