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
import { useAuthMeQuery, useUpdateUserMutation } from "@/services/auth/auth.service";
import { zodResolver } from '@hookform/resolvers/zod'

import s from './profile.module.scss'

export const Profile = () => {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null)

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    // register,
  } = useForm<{userName: string}>()

  // const { ref: registerRef, ...rest } = register('avatar')

  const meResponse = useAuthMeQuery()
  const [updateUser] = useUpdateUserMutation()

  const name = [...meResponse.data.name]

  const [avatar, setAvatar] = useState<File | null>()
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [userName, setUserName] = useState<string>(meResponse.data.name)

  console.log(userName)

  const onAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAvatar(e.target.files?.[0])
      updateUser({name: 'Andrei', avatar: e.target.files?.[0]})
    }
  }


  const onSubmit = (data: editProfileFormValues) => {
    console.log(data)
    // updateUser({name: data.name, avatar})
  }

  const onUpdateHandler = () => {
    console.log('update handler: ')
  }

  const onUpload = () => {
    hiddenInputRef.current.click()
  }


  return (
    <>
      <Header isAuthenticated={!meResponse.isUninitialized} userInfo={meResponse.data} />
      <Card className={s.wrapper}>
        <Typography className={s.center} variant={'h1'}>
          Personal Information
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/*<div className={s.avatarWrapper}>*/}
          {/*  {meResponse.data.avatar ? (*/}
          {/*    <img alt={meResponse.data.name} className={s.avatar} src={meResponse.data.avatar} />*/}
          {/*  ) : (*/}
          {/*    <div className={s.noImage}>*/}
          {/*      <Typography variant={'h1'}>{name[0]}</Typography>*/}
          {/*    </div>*/}
          {/*  )}*/}
          {/*  <input*/}
          {/*    id={'avatar'}*/}
          {/*    // {...register('avatar')}*/}
          {/*    {...rest}*/}
          {/*    name={'avatar'}*/}
          {/*    onChange={onAvatarFileChange}*/}
          {/*    ref={e => {*/}
          {/*      registerRef(e)*/}
          {/*      hiddenInputRef.current = e*/}
          {/*    }}*/}
          {/*    style={{ display: 'none' }}*/}
          {/*    type={'file'}*/}
          {/*  />*/}
          {/*  <SvgWrapper*/}
          {/*    SvgComponent={Edit2Outline}*/}
          {/*    onClick={onUpload}*/}
          {/*    size={'16'}*/}
          {/*    wrapperClassName={s.editIconWrapper}*/}
          {/*  />*/}
          {/*</div>*/}

          {showEditForm && <>
            <ControlledTextField
            control={control}
            defaultValue={meResponse.data.name}
            // value={userName}
            name={'userName'}
            placeholder={"Name"}
            // onBlur={() => setShowEditForm(false)}
            // onChange={(event: ChangeEvent<HTMLInputElement>) => {setUserName(event.target.value)}}
            wrapperProps={{ className: s.txtFieldWrapper }} />
            <Button
            // onClick={handleSubmit(onSubmit)}
              type={'submit'}
            variant={"primary"}
            fullWidth
            externalClassName={s.buttonMargin }
          >
            Update Name
          </Button></>
        }
          {!showEditForm && <Typography className={s.center} variant={'h2'}>
            {userName}
            <SvgWrapper
            SvgComponent={Edit2Outline}
            onClick={()=>setShowEditForm(true)}
            size={'16'}
            wrapper={'button'}
            wrapperClassName={s.editIconWrapper1}
          />
          </Typography>}

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
