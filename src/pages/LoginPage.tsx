import React, { useState } from 'react'

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    // logic
  }

  const handleChange = (type: 'email' | 'password', value: string ) => {
    if (type === 'email') setEmail(value);
    else setPassword(value);
  }

  return (
    <div className='min-h-screen bg-blue-700 flex items-center justify-center px-5'>
      <div className='bg-white rounded-r-2xl w-full max-w-md p-8'>
      <form onSubmit={handleSubmit}>
        <div>
          <label
            className='block text-sm font-semibold text-gray-700 mb-1'
            htmlFor="email">Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </div>
        <div>
          <label
            className='block text-sm font-semibold text-gray-700 mb-1'
            htmlFor="password">Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="•••••••"
            value={password}
            onChange={(e) => handleChange('password', e.target.value)}
          />
        </div>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
          type="submit">Login
        </button>
      </form>
      </div>
    </div>
  )
}
