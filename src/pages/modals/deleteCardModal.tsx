import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

type PropsType = {
  deckId: string
  name: string
  onOpenChange: (open: boolean) => void
  open: boolean
}

export const DeleteCardModal = ({ deckId, name, onOpenChange, open }: PropsType) => {
  const deteteDeckHandler = () => {
    console.log('detete deckHandler' + deckId)
  }

  return (
    <Modal onOpenChange={onOpenChange} open={open} title={'Delete Card'}>
      <>Do you really want to remove {name}?</>
      <Button onClick={deteteDeckHandler} variant={'primary'}>
        Delete Card
      </Button>
      <Button onClick={() => onOpenChange(false)} variant={'secondary'}>
        Cancel
      </Button>
    </Modal>
  )
}
