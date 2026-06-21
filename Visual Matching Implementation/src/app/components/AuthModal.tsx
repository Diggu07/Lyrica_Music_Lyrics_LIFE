import { useState, FormEvent } from 'react'

interface AuthModalProps {
  onLoginSuccess: (user: any) => void
}

export function AuthModal({ onLoginSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register'
    const body = isLogin
      ? { email, password }
      : { username, email, password, first_name: firstName, last_name: lastName }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      if (isLogin) {
        // Use user from response, or fetch profile as fallback
        if (data.user) {
          onLoginSuccess(data.user)
        } else {
          const profileRes = await fetch('/api/auth/profile')
          const profileData = await profileRes.json()
          onLoginSuccess(profileData.user || { email })
        }
      } else {
        // After signup, automatically log in the user
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })
        const loginData = await loginResponse.json()
        if (loginResponse.ok) {
          const userData = loginData.user || (await (await fetch('/api/auth/profile')).json()).user
          onLoginSuccess(userData || { email })
        } else {
          setIsLogin(true)
          setError('Signup successful! Please log in.')
        }
      }

    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-[12px]">
      <div
        className="w-full max-w-[440px] p-8 rounded-[24px] flex flex-col gap-6"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Title */}
        <div className="flex flex-col gap-1 items-center">
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 36, color: 'var(--text)' }}>
            Lyrica
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, color: 'var(--primary)', letterSpacing: '1.1px', textTransform: 'uppercase' }}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg text-xs font-medium text-red-400 bg-red-950/30 border border-red-900/30 text-center" style={{ fontFamily: 'var(--font-sans)' }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <div className="flex flex-col gap-1.5">
                <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm focus:outline-none focus:border-primary transition-colors"
                  style={{ fontFamily: 'var(--font-sans)', borderColor: 'var(--border)' }}
                  placeholder="johndoe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    style={{ fontFamily: 'var(--font-sans)', borderColor: 'var(--border)' }}
                    placeholder="John"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm focus:outline-none focus:border-primary transition-colors"
                    style={{ fontFamily: 'var(--font-sans)', borderColor: 'var(--border)' }}
                    placeholder="Doe"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex flex-col gap-1.5">
            <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm focus:outline-none focus:border-primary transition-colors"
              style={{ fontFamily: 'var(--font-sans)', borderColor: 'var(--border)' }}
              placeholder="name@example.com"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label style={{ fontFamily: 'var(--font-sans)', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border text-white text-sm focus:outline-none focus:border-primary transition-colors"
              style={{ fontFamily: 'var(--font-sans)', borderColor: 'var(--border)' }}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full font-bold transition-all mt-4 disabled:opacity-50"
            style={{
              background: 'var(--primary)',
              color: 'var(--background)',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {/* Footer switch */}
        <div className="text-center text-xs font-semibold text-stone-500 mt-2" style={{ fontFamily: 'var(--font-sans)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
            }}
            className="text-white hover:text-primary underline transition-colors"
          >
            {isLogin ? 'Sign up free' : 'Sign in here'}
          </button>
        </div>
      </div>
    </div>
  )
}
