'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabaseClient'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for verification!')
  }

  return (
    <div className="p-6 space-y-3 max-w-md mx-auto">
      <h2 className="text-xl font-bold">Sign Up</h2>
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
      <button onClick={signUp} className="bg-blue-600 text-white p-2 w-full">
        Sign Up
      </button>
      <p>{message}</p>
    </div>
  )
}
