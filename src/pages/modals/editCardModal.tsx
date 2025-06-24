import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Image } from '@/assets/icons/components'
import CloseCrossOutline from '@/assets/icons/components/Close'
import { ResultCode } from '@/common/enams/statuses'
import { useToast } from '@/common/hooks/useToast'
import { Button } from '@/components/ui/button'
import { ControlledTextField } from '@/components/ui/controlled/controlled-textfield/controlled-textfield'
import { Modal } from '@/components/ui/modal'
import { Typography } from '@/components/ui/typography'
import { addNewCardFormValues, addNewCardSchema } from '@/pages/modals/addNewCardModal-schema'
import { useUpdateCardMutation } from '@/services/base-api'
import { zodResolver } from '@hookform/resolvers/zod'

import s from './addNewCardModal.module.scss'

type PropsType = {
  answer?: string
  answerImg?: string
  cardId: string
  onOpenChange: (open: boolean) => void
  open: boolean
  question?: string
  questionImg?: string
}

export const EditCardModal = ({ cardId, onOpenChange, open }: PropsType) => {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<addNewCardFormValues>({
    defaultValues: {
      answer: '',
      question: '',
    },
    resolver: zodResolver(addNewCardSchema),
  })

  console.log('errors: ', errors)

  const [updateCard] = useUpdateCardMutation()

  const [questionCover, setQuestionCover] = useState<File>()
  const [answerCover, setAnswerCover] = useState<File>()

  const onQuestionFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setQuestionCover(e.target.files?.[0])
    }
  }

  console.log('questionCover: ', questionCover)

  const onAnswerFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAnswerCover(e.target.files?.[0])
    }
  }

  console.log('answerCover: ', answerCover)

  let questionCoverURL: string = ''
  let answerCoverURL: string = ''

  if (questionCover) {
    questionCoverURL = URL.createObjectURL(questionCover)
  }

  if (answerCover) {
    answerCoverURL = URL.createObjectURL(answerCover)
  }

  const onSubmit = async (data: addNewCardFormValues) => {
    console.log(data)
    const dataForRequest = { ...data, id: cardId }

    console.log(dataForRequest)

    if (isValid) {
      try {
        await updateCard(dataForRequest).then(() =>
          useToast('Card ' + data.question + ' was successfully updated', ResultCode.Success)
        )
      } catch (e) {
        console.log(e)
      }
      onOpenChange(false)
      reset()
    }
  }

  // const [open, setOpen] = useState(false)

  const onDeleteQuestionImageHandler = () => {
    URL.revokeObjectURL(questionCoverURL)
    setQuestionCover(undefined)
  }
  const onDeleteAnswerImageHandler = () => {
    URL.revokeObjectURL(answerCoverURL)
    setAnswerCover(undefined)
  }

  return (
    <Modal onOpenChange={onOpenChange} open={open} title={'Edit Card'}>
      <form onSubmit={event => event.preventDefault()}>
        <Typography className={s.question} variant={'subtitle2'}>
          Question:
        </Typography>
        <ControlledTextField
          control={control}
          defaultValue={''}
          labelText={'Question?'}
          name={'question'}
          placeholder={'Name'}
          wrapperProps={{ className: s.txtFieldWrapper }}
        />
        <div>
          <input
            id={'addCardQuestionImage'}
            onChange={onQuestionFileChange}
            style={{ display: 'none' }}
            type={'file'}
          />
        </div>
        {questionCover && (
          <div className={s.coverImage}>
            <img src={questionCoverURL} width={'170px'} />
            <button className={s.iconButton} onClick={onDeleteQuestionImageHandler}>
              <CloseCrossOutline />
            </button>
          </div>
        )}
        <div className={s.imageButton}>
          <Button as={'label'} fullWidth htmlFor={'addCardQuestionImage'} variant={'secondary'}>
            <Image width={'1rem'} /> {questionCover ? 'Change Image' : 'Upload Image'}
          </Button>
        </div>
        <Typography className={s.question} variant={'subtitle2'}>
          Answer:
        </Typography>
        <ControlledTextField
          control={control}
          defaultValue={''}
          labelText={'Answer'}
          name={'answer'}
          placeholder={'Name'}
          wrapperProps={{ className: s.txtFieldWrapper }}
        />
        <div>
          <input
            id={'addCardAnswerImage'}
            onChange={onAnswerFileChange}
            style={{ display: 'none' }}
            type={'file'}
          />
        </div>
        {answerCover && (
          <div className={s.coverImage}>
            <img src={answerCoverURL} width={'170px'} />
            <button className={s.iconButton} onClick={onDeleteAnswerImageHandler}>
              <CloseCrossOutline />
            </button>
          </div>
        )}
        <div className={s.imageButton}>
          <Button as={'label'} fullWidth htmlFor={'addCardAnswerImage'} variant={'secondary'}>
            <Image width={'1rem'} /> {answerCover ? 'Change Image' : 'Upload Image'}
          </Button>
        </div>
        <div className={s.footerWrapper}>
          <div>
            <Button onClick={() => onOpenChange(false)} variant={'secondary'}>
              Cancel
            </Button>
          </div>
          <div>
            <Button onClick={handleSubmit(onSubmit)} variant={'primary'}>
              Update Card
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
