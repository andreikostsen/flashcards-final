import { LogOut } from '@/assets/icons/components'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/ui/header'
import { Typography } from '@/components/ui/typography'
import { useAuthMeQuery } from '@/services/auth/auth.service'

import s from './profile.module.scss'
import { SvgWrapper } from "@/assets/icons/wrapper";
import Edit2Outline from "@/assets/icons/components/Edit2Outline";
import { ChangeEvent, useState } from "react";

export const Profile = () => {
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


  const onSubmit = (data) => {

  }




  return (
    <>
      <Header isAuthenticated={!meResponse.isUninitialized} userInfo={meResponse.data} />
      <Card className={s.wrapper}>
       <Typography className={s.center} variant={'h1'}>
          Personal Information
        </Typography>
        <form onSubmit={event => event.preventDefault()}>

          {meResponse.data.avatar ? (
            <img alt={meResponse.data.name} src={meResponse.data.avatar} className={s.avatar} />
          ) : (
            <div className={s.noImage}><Typography variant={"h1"}>{name[0]}</Typography></div>
          )}
          <input
            id={"addCardAnswerImage"}
            onChange={onAvatarFileChange}
            // style={{ display: "none" }}
            type={"file"}
          />
          <SvgWrapper
            SvgComponent={Edit2Outline}
            onClick={() => {
            }}
            size={"16"}
            wrapper={"button"}
          />
          <Button onClick={handleSubmit(onSubmit)} variant={'primary'}>
            Update Card
          </Button>
        </form>


        <Typography className={s.center} variant={"h2"}>
          {meResponse.data.name}
        </Typography>
        <Typography className={s.email} variant={"body2"}>
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
