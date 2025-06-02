import { useState } from 'react'

import * as Toast from '@radix-ui/react-toast'

export const ToastDemo = () => {
  const [open, setOpen] = useState(true)

  return (
    <Toast.Provider swipeDirection={'right'}>
      <button
        onClick={() => {
          setOpen(false)
        }}
      >
        Add to calendar
      </button>

      <Toast.Root onOpenChange={setOpen} open={open}>
        <Toast.Title>Scheduled: Catch up</Toast.Title>
        <Toast.Description asChild>sdfsdfsdf</Toast.Description>
        <Toast.Action altText={'Goto schedule to undo'} asChild>
          <button>Undo</button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport />
    </Toast.Provider>
  )
}
