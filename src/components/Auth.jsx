import React, { useState } from 'react'
import { supabase } from '../supabaseClient'
import { LogIn, UserPlus, AlertCircle } from 'lucide-react'

export default function Auth() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [message, setMessage] = useState(null)
    const [error, setError] = useState(null)

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)
        setError(null)

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                setMessage('Check your email for the login link!')
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
            }
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container flex-center" style={{ minHeight: '100vh', flexDirection: 'column' }}>
            <div className="neu-card fade-in" style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '24px' }}>
                    {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h1>

                <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input
                        className="neu-input"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="neu-input"
                        type="password"
                        placeholder="Your password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button className="neu-btn" style={{ color: 'var(--primary-color)', justifyContent: 'center' }} disabled={loading}>
                        {loading ? (
                            'Processing...'
                        ) : (
                            isSignUp ? <><UserPlus size={18} /> Sign Up</> : <><LogIn size={18} /> Sign In</>
                        )}
                    </button>
                </form>

                {error && (
                    <div style={{ marginTop: '20px', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '0.9rem' }}>
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                {message && (
                    <div style={{ marginTop: '20px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {message}
                    </div>
                )}

                <div style={{ marginTop: '30px' }}>
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        style={{ color: 'var(--primary-color)', background: 'transparent', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </div>
        </div>
    )
}
