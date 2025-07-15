import { ChangeEvent, useRef, useState } from "react";
import { useForm } from 'react-hook-form'

import { LogOut } from '@/assets/icons/components'
import Edit2Outline from '@/assets/icons/components/Edit2Outline'
import { SvgWrapper } from '@/assets/icons/wrapper'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ControlledTextField } from '@/components/ui/controlled/controlled-textfield/controlled-textfield'
import { Header } from '@/components/ui/header'
import { Typography } from '@/components/ui/typography'
import { editProfileFormValues, editProfileSchema } from '@/pages/profile/editProfile-schema'
import { useAuthMeQuery } from '@/services/auth/auth.service'
import { zodResolver } from '@hookform/resolvers/zod'

import s from './profile.module.scss'


export const Profile = () => {

  const hiddenInputRef = useRef<HTMLInputElement | null>(null);


  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    register,
  } = useForm<{name: string, avatar: File}>({
     // resolver: zodResolver(editProfileSchema),
  })


  const { ref: registerRef, ...rest } = register('avatar')

  const meResponse = useAuthMeQuery()

  const name = [...meResponse.data.name]

  const [avatar, setAvatar] = useState<File | string>()

  const onAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatar(e.target.files?.[0])
      // setAnswerImgURL(URL.createObjectURL(e.target.files?.[0]))
    }
  }

  console.log(avatar)

  const onSubmit = (data: editProfileFormValues) => {
    console.log(data)
    debugger
  }

  const onUpload = () => {
    hiddenInputRef.current.click();

  };

  return (
    <>
      <Header isAuthenticated={!meResponse.isUninitialized} userInfo={meResponse.data} />
      <Card className={s.wrapper}>
        <Typography className={s.center} variant={'h1'}>
          Personal Information
        </Typography>
        <form onSubmit={event => event.preventDefault()}>
          {meResponse.data.avatar ? (
            <img alt={meResponse.data.name} className={s.avatar} src={meResponse.data.avatar} />
          ) : (
            <div className={s.noImage}>
              <Typography variant={'h1'}>{name[0]}</Typography>
            </div>
          )}
          <input
            id={'avatar'}
            onChange={onAvatarFileChange}
            style={{ display: "none" }}
            type={'file'}
            // {...register('avatar')}
            name={'avatar'}
            ref={(e) => {
              registerRef(e);
              hiddenInputRef.current = e;
            }}
          />
          <p>{errors.avatar?.message}</p>
          <SvgWrapper
            SvgComponent={Edit2Outline}
            onClick={onUpload}
            size={'16'}
            wrapper={'button'}
          />
          <ControlledTextField
          control={control}
          defaultValue={meResponse.data.name}
          name={'name'}
          placeholder={'Name'}
          wrapperProps={{ className: s.txtFieldWrapper }}
        />
          {/*<Button*/}
          {/*  as={'label'}*/}
          {/*  htmlFor={'avatar'}*/}
          {/*  onClick={handleSubmit(onSubmit)}*/}
          {/*  variant={'primary'}*/}
          {/*>*/}
          {/*  Update Avatar*/}
          {/*</Button>*/}


        <Typography className={s.center} variant={'h2'}>
          {meResponse.data.name}
        </Typography>

        </form>

        <Typography className={s.email} variant={'body2'}>
          {meResponse.data.email}
        </Typography>
        <Button variant={'secondary'}>
          <LogOut width={'1rem'} />
          Logout
        </Button>
      </Card>
    </>
  )
}
