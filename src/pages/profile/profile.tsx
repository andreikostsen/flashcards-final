import { ChangeEvent, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { LogOut } from '@/assets/icons/components'
import Edit2Outline from '@/assets/icons/components/Edit2Outline'
import { SvgWrapper } from '@/assets/icons/wrapper'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ControlledTextField } from '@/components/ui/controlled/controlled-textfield/controlled-textfield'
import { Header } from '@/components/ui/header'
import { Typography } from '@/components/ui/typography'
import { useAuthMeQuery, useUpdateUserMutation } from '@/services/auth/auth.service'
import { zodResolver } from '@hookform/resolvers/zod'

import s from './profile.module.scss'

const editProfileSchema = z.object({
  avatar: z
    .any()
    .refine((files) => files?.length === 1, {
      message: 'Avatar file is required',
    })
    .refine((files) => files?.[0]?.size <= 1_000_000, {
      message: 'File is too big (max 1MB)',
    })
    .refine((files) => ['image/png'].includes(files?.[0]?.type), {
      message: 'Only PNG files are allowed',
    }),
  userName: z.string().max(200, 'This name is too long').min(1, 'This name is too short'),
})

type editProfileFormValues = z.infer<typeof editProfileSchema>


export const Profile = () => {

  const meResponse = useAuthMeQuery()
  const [updateUser] = useUpdateUserMutation()

  // const hiddenInputRef = useRef<HTMLInputElement | null>(null)

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    register,
    watch
  } = useForm<editProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      userName: meResponse.data.name,
    },
  })

  const selectedFile = watch('avatar')?.[0]
  const filePreview = selectedFile ? URL.createObjectURL(selectedFile) : meResponse.data.avatar
  const nameInitial = meResponse.data.name?.[0]?.toUpperCase() || '?'

  // const { ref: registerRef, ...rest } = register('avatar')

  //
  //
  // const name = [...meResponse.data.name]
  //
  // const [avatar, setAvatar] = useState<File | null>()
  // const [showEditForm, setShowEditForm] = useState<boolean>(false)
  // const [userName, setUserName] = useState<string>(meResponse.data.name)


  // const onAvatarFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files?.[0]) {
  //     setAvatar(e.target.files?.[0])
  //     updateUser({ avatar: e.target.files?.[0], name: 'Andrei' })
  //   }
  // }

  const onSubmit = (data: editProfileFormValues) => {
    console.log(data)
    const file = data.avatar[0] // Extract file from FileList
    updateUser({ name: data.userName, avatar: file })
    // setShowEditForm(false)
    // setUserName(data.userName)
  }

  // const onUpload = () => {
  //   hiddenInputRef.current.click()
  // }

  return (
    <>
      <Header isAuthenticated={!meResponse.isUninitialized} userInfo={meResponse.data} />
      <Card className={s.wrapper}>
        <Typography className={s.center} variant={'h1'}>
          Personal Information
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={s.avatarWrapper}>
            {filePreview ? (
              <img alt={"avatar"} className={s.avatar} src={filePreview} />
            ) : (
              <div className={s.noImage}>
                <Typography variant={"h1"}>{nameInitial}</Typography>
              </div>
            )}
            <input
              id={"avatar"}
              {...register("avatar")}
              // name={'avatar'}
              // onChange={onAvatarFileChange}
              // ref={e => {
              //   registerRef(e)
              //   hiddenInputRef.current = e
              // }}
              style={{ display: "none" }}
              type={"file"}
            />
            <label htmlFor="avatar">
              <SvgWrapper
                SvgComponent={Edit2Outline}
                // onClick={onUpload}
                size={"16"}
                wrapperClassName={s.editIconWrapper}
              />
            </label>
          </div>
          {errors.avatar && (
            <Typography className="text-red-500 text-sm mt-2" variant="caption">
              {errors.avatar.message}
            </Typography>
          )}

          {/*{showEditForm && (*/}
          {/*  <>*/}
              <ControlledTextField
                control={control}
                // defaultValue={userName}
                name={'userName'}
                placeholder={'Name'}
                wrapperProps={{ className: s.txtFieldWrapper }}
              />
              <Button
                externalClassName={s.buttonMargin}
                fullWidth
                // onClick={handleSubmit(onSubmit)}
                type={'submit'}
                variant={'primary'}
              >
                Update Profile
              </Button>
          {/*  </>*/}
          {/*)}*/}
          {/*{!showEditForm && (*/}
          {/*  <Typography className={s.center} variant={'h2'}>*/}
          {/*    {userName}*/}
          {/*    <SvgWrapper*/}
          {/*      SvgComponent={Edit2Outline}*/}
          {/*      onClick={() => setShowEditForm(true)}*/}
          {/*      size={'16'}*/}
          {/*      wrapper={'button'}*/}
          {/*      wrapperClassName={s.editIconWrapper1}*/}
          {/*    />*/}
          {/*  </Typography>*/}
          {/*)}*/}
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
