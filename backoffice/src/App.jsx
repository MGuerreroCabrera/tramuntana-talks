import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard'
import Login from './components/Login/Login'
import { getCurrentUser } from './services/authService'
import './App.css'

const TOKEN_STORAGE_KEY = 'tramuntanaBackofficeToken'
const USER_STORAGE_KEY = 'tramuntanaBackofficeUser'
const LAST_ACTIVITY_STORAGE_KEY = 'tramuntanaBackofficeLastActivity'
const INACTIVITY_LIMIT_MS = 5 * 60 * 1000
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

const getStoredUser = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY)

  if (!storedUser) return null

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [user, setUser] = useState(getStoredUser)
  const [isCheckingSession, setIsCheckingSession] = useState(Boolean(token))
  const [sessionMessage, setSessionMessage] = useState('')

  const handleLogout = useCallback((message = '') => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(LAST_ACTIVITY_STORAGE_KEY)
    setToken(null)
    setUser(null)
    setSessionMessage(message)
  }, [])

  const updateLastActivity = useCallback(() => {
    if (!localStorage.getItem(TOKEN_STORAGE_KEY)) return
    localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(Date.now()))
  }, [])

  const handleLoginSuccess = ({ token: sessionToken, user: sessionUser }) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, sessionToken)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(sessionUser))
    localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(Date.now()))
    setToken(sessionToken)
    setUser(sessionUser)
    setSessionMessage('')
  }

  useEffect(() => {
    if (!token) return

    const validateSession = async () => {
      try {
        const currentUser = await getCurrentUser(token)
        setUser(currentUser)
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser))
        localStorage.setItem(LAST_ACTIVITY_STORAGE_KEY, String(Date.now()))
      } catch {
        handleLogout('Tu sesión ya no es válida. Vuelve a iniciar sesión.')
      } finally {
        setIsCheckingSession(false)
      }
    }

    validateSession()
  }, [handleLogout, token])

  useEffect(() => {
    if (!token) return undefined

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, updateLastActivity, { passive: true })
    })

    const intervalId = window.setInterval(() => {
      const lastActivity = Number(localStorage.getItem(LAST_ACTIVITY_STORAGE_KEY))

      if (!lastActivity) {
        updateLastActivity()
        return
      }

      if (Date.now() - lastActivity > INACTIVITY_LIMIT_MS) {
        handleLogout('Sesión cerrada por inactividad.')
      }
    }, 10000)

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, updateLastActivity)
      })
      window.clearInterval(intervalId)
    }
  }, [handleLogout, token, updateLastActivity])

  if (isCheckingSession) {
    return (
      <main className="app-loading" aria-live="polite">
        Validando sesión...
      </main>
    )
  }

  if (!token || !user) {
    return <Login onLoginSuccess={handleLoginSuccess} sessionMessage={sessionMessage} />
  }

  return (
    <BrowserRouter>
      <Dashboard token={token} user={user} onLogout={handleLogout} />
    </BrowserRouter>
  )
}

export default App
