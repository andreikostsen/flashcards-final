import { ResultCode } from "@/common/enams/statuses";
import { toast } from "react-toastify";

export const useToast = (message: string, toastType: ResultCode) => {



  if (toastType === ResultCode.Success) {
    toast.success(message)
  } else {
    toast.error(message)
  }


}