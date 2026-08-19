
import {
  Outlet,
} from 'react-router-dom'


import Header from '../components/layout/Header'







// User tạm thời cho Header, sau này thay bằng user từ Auth/Login


function App() {
  return (
    <>
      <Header />
      <Outlet/>
    </>
  )
}

export default App