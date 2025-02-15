import Overview from '../pages/Overview.jsx'
import { Navigate } from 'react-router-dom'
import { useStore } from '../store/store.js'

const RequireAuth = () => {
    const {user} = useStore();   // value needs to come from backend to check if user is logged in or not
    // const user = true

  return (
    <div>
        {user ? <Overview /> :  <Navigate to="/login" />}

    </div>
  )
}

export default RequireAuth;
