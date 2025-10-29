import CommonForm from '@/components/common/form'
import { PageSkeleton } from '@/components/common/Skeleton'
import { LoginFormControls } from '@/config'
import { loginUser } from '@/store/auth-slice'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'


const initialState = {
    email: '',
    password: '',
  }
  
  function AuthLogin() {
    const {isLoading } = useSelector((state)=> state.auth)
    const [formData, setFormData] = useState(initialState)
    const dispatch = useDispatch()
    function onSubmit(e) {
      e.preventDefault()
      dispatch(loginUser(formData)).then(data =>{
        console.log(data)
        if(data?.payload?.success){
          toast.success(data?.payload?.message,{
            description: "success"
          })
        }
        else{
          toast.error(data?.payload?.message,{
            description: "Failure"
          })
        }
      })
    }
    if (isLoading) return <PageSkeleton /> ;
    return (
      <div className='mx-auto w-full max-w-md space-y-6' >
        <div className='text-center' >
          <h1 className='text-3xl font-bold tracking-tight text-foreground'> LogIn to Your Account</h1>
        </div>
        <CommonForm formcontrols={LoginFormControls}
         buttonText={'Log In'} 
         onSubmit={onSubmit}
        formData={formData} setFormData={setFormData} />
  
  <p className='mt-2'> Dont Have an account ? 
          <Link to='/auth/register' className='ml-2 text-primary font-medium hover: underline'> Register</Link>
          </p>
      </div>
    )
  }
  
  export default AuthLogin