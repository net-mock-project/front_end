
import {
  Outlet,
} from 'react-router-dom'


import Header from '../components/layout/Header'


import type { User } from '../types/User'




// User tạm thời cho Header, sau này thay bằng user từ Auth/Login
const authUser: User = {
  userId: 1,
  fullName: 'Minh Anh',
  role: 'Volunteer',
  profileUrl: '',
  email: 'minhanh@example.com',
  phoneNumber: '0123456789',
  province: 'Hanoi',
  status: 'ACTIVE',
  location: {
    latitude: 21.0285,
    longitude: 105.8542,
  },
}


function App() {
  return (
    <>
      <Header user={authUser} />
      <Outlet/>
    </>
  )
}

export default App