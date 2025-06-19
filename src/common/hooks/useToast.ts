import { toast } from 'react-toastify'

import { ResultCode } from '@/common/enams/statuses'

export const useToast = (message: string, toastType: ResultCode) => {
  if (toastType === ResultCode.Success) {
    toast.success(message)
  } else {
    toast.error(message)
  }
}
