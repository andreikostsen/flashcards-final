import { LogOut } from '@/assets/icons/components'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Header } from '@/components/ui/header'
import { Typography } from '@/components/ui/typography'
import { useAuthMeQuery } from '@/services/auth/auth.service'

import s from './profile.module.scss'

export const Profile = () => {
  const meResponse = useAuthMeQuery()

  return (
    <>
      <Header isAuthenticated={!meResponse.isUninitialized} userInfo={meResponse.data} />
      <Card className={s.wrapper}>
        <Typography className={s.center} variant={'h1'}>
          Personal Information
        </Typography>
        {meResponse.data.avatar ? (
          <img alt={meResponse.data.name} src={meResponse.data.avatar} />
        ) : (
          <div>no image</div>
        )}
        <Typography className={s.center} variant={'h2'}>
          Ivan
        </Typography>
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
