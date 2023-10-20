import { Outlet, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Home, Login, Profile, Register, ResetPassword } from "./pages";
import Adminlogin from "./components/adminpage/AdminLogin";
import AdminHome from "./components/adminpage/AdminHome";
import {  useSelector } from "react-redux/es/hooks/useSelector";


function Layout() {
  
  const {user} = useSelector((state)=>state.user);
  const loaction = useLocation()
  

  return user?.token ? (
    <Outlet />
    
  ) : (
      <Navigate to="/login" state={{from:loaction} } replace />
  )
}



function Adminlayout() {
  
  const { adminInfo } = useSelector((state) => state.adminInfo)
  const adminloaction = useLocation()
  
  return adminInfo?.token ? (
    <Outlet/>
  ):(<Navigate to="/adminlogin" state={{from:adminloaction}} replace />)
}


function App() {

  const { theme } = useSelector((state) => state.theme)


  
  return (
    <div  data-theme={theme} className='w-full min-h-[100vh]'>
      <Routes>

        <Route element={<Layout/>} >
        <Route path="/" element={<Home />} />
          <Route path="/profile/:id?" element={<Profile />} />
          <Route path="*" element={<ErrorPage} />
        
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/adminlogin" element={<Adminlogin />} />


        {/* admin route */}
         <Route element={<Adminlayout/>} >
          <Route path="/adminHome" element={<AdminHome />} />
           <Route path="*" element={<ErrorPage} />
         </Route>
        
        

        {/*  for invalid route */}
         

      </Routes>
  
    </div>
  );
}

export default App;
