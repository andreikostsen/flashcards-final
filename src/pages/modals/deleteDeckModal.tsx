import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Typography } from '@/components/ui/typography'
import { useDeleteDeckMutation } from '@/services/base-api'

import s from './deleteDeckModal.module.scss'

type PropsType = {
  deckId: string
  name?: string
  onOpenChange: (open: boolean) => void
  open: boolean
}

export const DeleteDeckModal = ({ deckId, name, onOpenChange, open }: PropsType) => {
  const [deleteDeck] = useDeleteDeckMutation()
  const navigate = useNavigate()

  const deteteDeckHandler = () => {
    deleteDeck(deckId)
    onOpenChange(false)
    navigate('../')
  }

  return (
    <Modal onOpenChange={onOpenChange} open={open} title={'Delete Deck'}>
      <div className={s.mainTextWrapper}>
        <Typography variant={'subtitle1'}>
          <span className={s.normalTxt}>Do you really want to remove </span> {name}?<br />
          <span className={s.normalTxt}>All cards will be deleted. </span>
        </Typography>
      </div>
      <div className={s.buttonWrapper}>
        <Button onClick={() => onOpenChange(false)} variant={'secondary'}>
          Cancel
        </Button>
        <Button onClick={deteteDeckHandler} variant={'primary'}>
          Delete Deck
        </Button>
      </div>
    </Modal>
  )
}