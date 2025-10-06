import { ToastContainer } from 'react-toastify'

import { ResultCode } from '@/common/enams/statuses'
import { useToast } from '@/common/hooks/useToast'
import { signUpFormValues } from '@/components/auth/forms/signUp-form/signUp-schema'
import { Header } from '@/components/ui/header'
import { SignUp } from '@/pages/auth/signUp/signUp'
import { useSignupMutation } from '@/services/auth/auth.service'
import { SignUpRequest } from '@/services/flashcards.types'

export const SignUpPage = () => {
  const [signup] = useSignupMutation()

  const onSubmitHandler = async (data: signUpFormValues) => {
    try {
      const updatedData: SignUpRequest = {
        email: data.email,
        html: '<b>Hello, ##name##!</b><br/>Please confirm your email by clicking on the link below:<br/><a href="http://localhost:3000/confirm-email/##token##">Confirm email</a>. If it doesn\'t work, copy and paste the following link in your browser:<br/>http://localhost:3000/confirm-email/##token##',
        name: 'Andrei',
        password: data.password,
        sendConfirmationEmail: true,
        subject: 'flashcards registration',
      }

      console.log(updatedData)
      await signup(updatedData)
        .then((result: any) => {
          console.log(result)
          if (result.error.status == 400) {
            useToast(result.error.data.errorMessages[0], ResultCode.Error)
          } else {useToast('Please check your e-mail to proceed with registration', ResultCode.Info)}
        })
        .catch((e: any) => {
          console.log(e)
        })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <Header isAuthenticated={false} />
      <div style={{ paddingTop: '36px' }}>
        <SignUp onSubmit={onSubmitHandler}></SignUp>
      </div>
      <ToastContainer />
    </>
  )
}
