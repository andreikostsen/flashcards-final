import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Typography } from '@/components/ui/typography'
import { useDeleteCardMutation } from "@/services/base-api";

import s from './deleteDeckModal.module.scss'

type PropsType = {
  cardId: string | undefined
  name?: string
  onOpenChange: (open: boolean) => void
  open: boolean
}

export const DeleteCardModal = ({ cardId, name, onOpenChange, open }: PropsType) => {
  const [deleteCard] = useDeleteCardMutation()

  const deteteCardHandler = () => {
    cardId? deleteCard(cardId) : ''
    onOpenChange(false)
  }

  return (
    <Modal onOpenChange={onOpenChange} open={open} title={'Delete Card'}>
      <div className={s.mainTextWrapper}>
        <Typography variant={'subtitle1'}>
          <span className={s.normalTxt}>Do you really want to remove </span> "{name}" <span className={s.normalTxt}>card?</span>
        </Typography>
      </div>
      <div className={s.buttonWrapper}>
        <Button onClick={() => onOpenChange(false)} variant={'secondary'}>
          Cancel
        </Button>
        <Button onClick={deteteCardHandler} variant={'primary'}>
          Delete Card
        </Button>
      </div>
    </Modal>
  )
}