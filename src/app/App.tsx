import { useState } from 'react'
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'

import Header from '../components/layout/Header'
import ProfilePage from '../features/profile/pages/ProfilePage'

import type { User } from '../types/User'

import './App.css'

// React Query dùng chung cho toàn bộ ứng dụng
const queryClient = new QueryClient()

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

function AppContent() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Header dùng thông tin người dùng đăng nhập */}
      <Header user={authUser} />

      <Routes>
        {/* Trang chủ hiện tại */}
        <Route
          path="/"
          element={
            <>
              <section id="center">
                <div className="hero">
                  <img
                    src={heroImg}
                    className="base"
                    width="170"
                    height="179"
                    alt=""
                  />

                  <img
                    src={reactLogo}
                    className="framework"
                    alt="React logo"
                  />

                  <img
                    src={viteLogo}
                    className="vite"
                    alt="Vite logo"
                  />
                </div>

                <div>
                  <h1>Get started</h1>

                  <p>
                    Edit <code>src/App.tsx</code> and save to test{' '}
                    <code>HMR</code>
                  </p>
                </div>

                <button
                  type="button"
                  className="counter"
                  onClick={() =>
                    setCount((count) => count + 1)
                  }
                >
                  Count is {count}
                </button>
              </section>

              <div className="ticks"></div>

              <section id="next-steps">
                <div id="docs">
                  <svg
                    className="icon"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <use href="/icons.svg#documentation-icon"></use>
                  </svg>

                  <h2>Documentation</h2>
                  <p>Your questions, answered</p>

                  <ul>
                    <li>
                      <a
                        href="https://vite.dev/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          className="logo"
                          src={viteLogo}
                          alt=""
                        />
                        Explore Vite
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://react.dev/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          className="button-icon"
                          src={reactLogo}
                          alt=""
                        />
                        Learn more
                      </a>
                    </li>
                  </ul>
                </div>

                <div id="social">
                  <svg
                    className="icon"
                    role="presentation"
                    aria-hidden="true"
                  >
                    <use href="/icons.svg#social-icon"></use>
                  </svg>

                  <h2>Connect with us</h2>
                  <p>Join the Vite community</p>

                  <ul>
                    <li>
                      <a
                        href="https://github.com/vitejs/vite"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          className="button-icon"
                          role="presentation"
                          aria-hidden="true"
                        >
                          <use href="/icons.svg#github-icon"></use>
                        </svg>
                        GitHub
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://chat.vite.dev/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          className="button-icon"
                          role="presentation"
                          aria-hidden="true"
                        >
                          <use href="/icons.svg#discord-icon"></use>
                        </svg>
                        Discord
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://x.com/vite_js"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          className="button-icon"
                          role="presentation"
                          aria-hidden="true"
                        >
                          <use href="/icons.svg#x-icon"></use>
                        </svg>
                        X.com
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://bsky.app/profile/vite.dev"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <svg
                          className="button-icon"
                          role="presentation"
                          aria-hidden="true"
                        >
                          <use href="/icons.svg#bluesky-icon"></use>
                        </svg>
                        Bluesky
                      </a>
                    </li>
                  </ul>
                </div>
              </section>

              <div className="ticks"></div>

              <section id="spacer"></section>
            </>
          }
        />

        {/* Trang hồ sơ tự lấy dữ liệu Profile */}
        <Route
          path="/profile"
          element={<ProfilePage />}
        />
      </Routes>
    </>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Router quản lý việc chuyển trang */}
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App