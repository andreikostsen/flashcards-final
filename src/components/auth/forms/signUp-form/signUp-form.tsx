import { useForm } from 'react-hook-form'

import { signUpFormValues, signUpSchema } from '@/components/auth/forms/signUp-form/signUp-schema'
import { Button } from '@/components/ui/button'
import { ControlledTextField } from '@/components/ui/controlled/controlled-textfield/controlled-textfield'
import { Typography } from '@/components/ui/typography'
import { zodResolver } from '@hookform/resolvers/zod'

import s from './signUp-form.module.scss'

type signUpFormType = {
  onSubmit: (data: signUpFormValues) => void
}

export const SignUpForm = ({ onSubmit }: signUpFormType) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<signUpFormValues>({
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(signUpSchema),
  })

  // console.log('errors: ', errors)

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={s.emailField}>
          <ControlledTextField control={control} labelText={'Email'} name={'email'} />
        </div>
        <div className={s.emailField}>
          <ControlledTextField
            control={control}
            labelText={'Password'}
            name={'password'}
            type={'password'}
          />
        </div>
        <div className={s.emailField}>
          <ControlledTextField
            control={control}
            labelText={'Confirm Password'}
            name={'confirmPassword'}
            type={'password'}
          />
        </div>
        <div className={s.signUpButtonWrapper}>
          <Button fullWidth type={'submit'}>
            Sign Up
          </Button>
        </div>
        <Typography
          className={s.alreadyHaveAccountTxt}
          color={'var(--color-light-900'}
          variant={'body2'}
        >
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Already have an account?
        </Typography>
        <Typography
          as={'a'}
          className={s.signInLink}
          color={'var(--color-accent-500'}
          href={'#'}
          variant={'subtitle1'}
        >
          Sign In
        </Typography>
      </form>
    </>
  )
}
