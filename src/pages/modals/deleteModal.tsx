import { useNavigate } from 'react-router-dom'

import { ResultCode } from '@/common/enams/statuses'
import { useToast } from '@/common/hooks/useToast'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Typography } from '@/components/ui/typography'
import { useDeleteCardMutation, useDeleteDeckMutation } from '@/services/base-api'

import s from './deleteDeckModal.module.scss'

type PropsType = {
  card?: boolean
  id?: string
  name?: string
  onOpenChange: (open: boolean) => void
  open: boolean
}

export const DeleteModal = ({ card = false, id, name, onOpenChange, open }: PropsType) => {
  const [deleteDeck] = useDeleteDeckMutation()
  const [deleteCard] = useDeleteCardMutation()
  const navigate = useNavigate()

  const deleteDeckHandler = async () => {
    id ? await deleteDeck(id) : null
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useToast('Deck ' + '"' + name + '"' + ' was successfully deleted', ResultCode.Success)
    onOpenChange(false)
    navigate('../')
  }

  const deleteCardHandler = async () => {
    id ? await deleteCard(id) : null
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useToast('Card ' + '"' + name + '"' + ' was successfully deleted', ResultCode.Success)
    onOpenChange(false)
  }

  return (
    <Modal onOpenChange={onOpenChange} open={open} title={card ? 'Delete Card' : 'Delete Deck'}>
      <div className={s.mainTextWrapper}>
        <Typography variant={'subtitle1'}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          <span className={s.normalTxt}>Do you really want to remove </span> "{name}"
          {card ? (
            <span className={s.normalTxt}> card?</span>
          ) : (
            <>
              <span className={s.normalTxt}> deck?</span>
              <br />
              <span className={s.normalTxt}>All cards will be deleted. </span>
            </>
          )}
        </Typography>
      </div>
      <div className={s.buttonWrapper}>
        <Button onClick={() => onOpenChange(false)} variant={'secondary'}>
          Cancel
        </Button>
        <Button onClick={card ? deleteCardHandler : deleteDeckHandler} variant={'primary'}>
          {card ? 'Delete Card' : 'Delete Deck'}
        </Button>
      </div>
    </Modal>
  )
}
