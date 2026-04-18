import { Route ,Routes ,Navigate } from "react-router-dom"
import Signup from "./pages/signup"
import Login from "./pages/login"
const App = () => {
  return (
  <div>
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  </div>
  )
}

export default App
