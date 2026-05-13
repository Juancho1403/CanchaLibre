import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/userContext';
import { FormLogin } from '../Components/Login/FormLogin'

export  function IndexLogin() {
  const navigate = useNavigate();
  const { user , isLoggedIn} = useAppContext();


  useEffect(() => {
    if (isLoggedIn && user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <>
      <div>
          <FormLogin />
      </div>
    </>
  )
}