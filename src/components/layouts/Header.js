import React from 'react'
import Logo from '../../assets/logo.png'
import Button from '../ui/Button'

const Header = () => {
  return (
    <header className="bg-slate-50 text-white py-4 shadow-md">
      <div className="container mx-auto md:px-16 px-10 flex items-center justify-between">
        <p>
          Resume Parser Application 
        </p>

      </div>
    </header>
  )
}

export default Header