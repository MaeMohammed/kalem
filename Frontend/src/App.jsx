import { Route ,Routes ,Navigate } from "react-router-dom"
import Signup from "./pages/signup"
import Login from "./pages/login"
import { useAuthStore } from "./stores/useAuthStore"
import { useEffect } from "react"
import Home from "./pages/Home"
import { Loader2 } from "lucide-react"
import { Toaster } from "sonner"
import Profile from "./pages/Profile"

const App = () => {
  const {user,checkAuth,ischeckingAuth}=useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth])
  if(ischeckingAuth) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>;
  }
  return (
  <div>
    <Routes>
      <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
    </Routes>
    <Toaster position="top-center" theme="dark"/>
  </div>
  )
}

export default App
