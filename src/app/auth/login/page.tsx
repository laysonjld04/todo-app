'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Logged in!')
      router.push('/dashboard')   // ⬅ redirect here
    }
  }

  return (
    <div className="p-6 space-y-3 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Login</h2>
      <input
        className="border p-2 w-full"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-full"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login} className="bg-blue-600 text-white p-2 w-full">
        Login
      </button>
      <p>{message}</p>
    </div>
  )
}
