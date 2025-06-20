import { ComponentProps, ComponentRef, ReactNode, forwardRef, useEffect, useState } from 'react'

import CloseCrossOutline from '@/assets/icons/components/Close'
import { LinearProgress } from '@mui/material'
import * as Dialog from '@radix-ui/react-dialog'
import { clsx } from 'clsx'

import s from './modal.module.scss'

import { Typography } from '../typography'

type ModalProps = {
  contentContainerClassName?: string
  onOpenChange: (open: boolean) => void
  open?: boolean
  overlayClassName?: string
  showProgress?: boolean
  title?: string
  trigger?: ReactNode
} & ComponentProps<'div'>

export const Modal = forwardRef<ComponentRef<'div'>, ModalProps>((props, ref) => {
  const {
    children,
    className,
    contentContainerClassName,
    onOpenChange,
    open,
    overlayClassName,
    showProgress,
    title,
    trigger,
  } = props

  const classNames = {
    contentWrapper: clsx(s.contentWrapper, contentContainerClassName),
    dialogContent: clsx(s.dialogContent, className),
    dialogOverlay: clsx(s.dialogOverlay, overlayClassName),
    dialogTitle: s.dialogTitle,
    header: s.header,
    iconButton: s.iconButton,
  }

  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress === 100) {
          return 0
        }
        const diff = Math.random() * 10

        return Math.min(oldProgress + diff, 100)
      })
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={classNames.dialogOverlay} />
        <Dialog.Content aria-describedby={undefined} className={classNames.dialogContent} ref={ref}>
          <header className={classNames.header}>
            <Dialog.Title className={classNames.dialogTitle}>
              <Typography as={'span'} variant={'h2'}>
                {title}
              </Typography>
            </Dialog.Title>
            <Dialog.Close aria-label={'Close'} style={{ height: '25px' }}>
              <button aria-label={'Close'} className={classNames.iconButton}>
                <CloseCrossOutline />
              </button>
            </Dialog.Close>
          </header>
          {showProgress && <LinearProgress value={progress} variant={'determinate'} />}
          <div className={classNames.contentWrapper}>{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
})
