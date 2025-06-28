import React from 'react'
import Logo from '../../assets/logo.png'
import Button from '../ui/Button'

const Header = () => {
  return (
    <header className="bg-slate-50 text-white py-4 shadow-md">
      <div className="container mx-auto md:px-16 px-10 flex items-center justify-between">
        <img  
          src={Logo} 
          className='h-5'
          alt='Workabroad Logo'
        />

        <div className='flex items-center justify-end gap-4'>          
          <Button 
            type='button'
            variant='secondary'
          > 
            Sign in Agency
          </Button>
          <Button 
            type='button'
            variant='primary'
          > 
            Sign in Candidate
          </Button>
        </div>

      </div>
    </header>
  )
}

export default Header