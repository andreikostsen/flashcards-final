import { useParams } from 'react-router-dom'

import { useVerifyUserEmailMutation } from '@/services/auth/auth.service'

export const ConfirmEmail = () => {
  const params = useParams()

  const [isVerified] = useVerifyUserEmailMutation()

  isVerified(params.code)
  
  
  return <div>token {params.code}</div>
}
