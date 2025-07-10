import { ChangeEvent, useEffect, useState } from 'react'
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
  answerImg?: string
  answerTxt?: string
  cardId: string
  onOpenChange: (open: boolean) => void
  open: boolean
  questionImg?: string
  questionTxt?: string
}

export const EditCardModal = ({
  answerImg,
  answerTxt,
  cardId,
  onOpenChange,
  open,
  questionImg,
  questionTxt,
}: PropsType) => {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<addNewCardFormValues>({
    defaultValues: {
      answer: answerTxt,
      question: questionTxt,
    },
    resolver: zodResolver(addNewCardSchema),
  })

  console.log('errors: ', errors)

  const [updateCard] = useUpdateCardMutation()

  useEffect(() => {
    setQuestionImgURL(questionImg)
    setAnswerImgURL(answerImg)
  }, [answerImg, questionImg])

  const [questionCover, setQuestionCover] = useState<File | string>()
  const [answerCover, setAnswerCover] = useState<File | string>()
  const [questionImgURL, setQuestionImgURL] = useState<string | undefined>()
  const [answerImgURL, setAnswerImgURL] = useState<string | undefined>()

  const onQuestionFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setQuestionCover(e.target.files?.[0])
      setQuestionImgURL(URL.createObjectURL(e.target.files?.[0]))
    }
  }

  console.log('questionCover: ', questionCover)

  const onAnswerFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setAnswerCover(e.target.files?.[0])
      setAnswerImgURL(URL.createObjectURL(e.target.files?.[0]))
    }
  }

  console.log('answerCover: ', answerCover)

  const onSubmit = async (data: addNewCardFormValues) => {
    console.log(data)
    const dataForRequest = {
      ...data,
      answerImg: answerCover,
      id: cardId,
      questionImg: questionCover,
    }

    console.log(dataForRequest)

    if (isValid) {
      try {
        await updateCard(dataForRequest).then(() =>
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useToast('Card ' + data.question + ' was successfully updated', ResultCode.Success)
        )
      } catch (e) {
        console.log(e)
      }
      onOpenChange(false)
      reset()
    }
  }

  const onDeleteQuestionImageHandler = () => {
    if (questionImgURL != undefined) {
      URL.revokeObjectURL(questionImgURL)
    }

    setQuestionCover('')
    setQuestionImgURL(undefined)
  }
  const onDeleteAnswerImageHandler = () => {
    if (answerImgURL != undefined) {
      URL.revokeObjectURL(answerImgURL)
    }
    setAnswerCover('')
    setAnswerImgURL(undefined)
  }

  return (
    <Modal onOpenChange={onOpenChange} open={open} title={'Edit Card'}>
      <form onSubmit={event => event.preventDefault()}>
        <Typography className={s.question} variant={'subtitle2'}>
          Question:
        </Typography>
        <ControlledTextField
          control={control}
          defaultValue={questionTxt}
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
        {questionImgURL && (
          <div className={s.coverImage}>
            <img alt={questionTxt} src={questionImgURL} width={'170px'} />
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
          defaultValue={answerTxt}
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
        {answerImgURL && (
          <div className={s.coverImage}>
            <img alt={answerTxt} src={answerImgURL} width={'170px'} />
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
