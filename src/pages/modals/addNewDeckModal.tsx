import { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Image } from '@/assets/icons/components'
import CloseCrossOutline from '@/assets/icons/components/Close'
import { ResultCode } from '@/common/enams/statuses'
import { useToast } from '@/common/hooks/useToast'
import { Button } from '@/components/ui/button'
import { ControlledCheckbox } from '@/components/ui/controlled/controlled-checkbox/controlled-checkbox'
import { ControlledTextField } from '@/components/ui/controlled/controlled-textfield/controlled-textfield'
import { Modal } from '@/components/ui/modal'
import { addNewDeckFormValues, addNewDeckSchema } from '@/pages/modals/addNewDecksModal-schema'
import { useCreateDeckMutation } from '@/services/base-api'
import { zodResolver } from '@hookform/resolvers/zod'

import s from './addNewDeckModal.module.scss'

export const AddNewDeckModal = () => {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    reset,
  } = useForm<addNewDeckFormValues>({
    defaultValues: {
      isPrivate: true,
      name: '',
    },
    resolver: zodResolver(addNewDeckSchema),
  })

  console.log('errors: ', errors)

  const [createDeck] = useCreateDeckMutation()

  const [cover, setCover] = useState<File>()
  const [open, setOpen] = useState(false)

  let coverURL: string = ''

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCover(e.target.files?.[0])
    }
  }

  if (cover) {
    coverURL = URL.createObjectURL(cover)
  }

  console.log('cover: ', cover)

  console.log('coverURL: ', coverURL)

  const onSubmit = (data: addNewDeckFormValues) => {
    console.log(data)
    const dataWithCover = { ...data, cover }

    console.log(dataWithCover)

    if (isValid) {
      createDeck(dataWithCover)
        .then((result: any) => {
          result.error && result.error.data.errorMessages[0].message
            ? useToast(
                result.error.data.errorMessages[0].message
                  ? result.error.data.errorMessages[0].message
                  : result.error.error,
                ResultCode.Error
              )
            : useToast(
                'New deck ' + '"' + result.data.name + '"' + ' has been created',
                ResultCode.Success
              )
        })
        .catch(reason => {
          useToast(reason.message, ResultCode.Error)
        })
        .finally(() => {
          setOpen(false)
          reset()
        })
    }
  }

  const onDeleteImageHandler = () => {
    URL.revokeObjectURL(coverURL)
    setCover(undefined)
  }

  return (
    <>
      <Modal
        onOpenChange={setOpen}
        open={open}
        title={'Add New Deck'}
        trigger={<Button variant={'primary'}>Add New Deck</Button>}
      >
        <form onSubmit={event => event.preventDefault()}>
          <ControlledTextField
            control={control}
            defaultValue={''}
            labelText={'Name Pack'}
            name={'name'}
            wrapperProps={{ className: s.txtFieldWrapper }}
          />
          <div>
            <input
              id={'addDeckCoverInput'}
              onChange={onFileChange}
              style={{ display: 'none' }}
              type={'file'}
            />
          </div>
          {cover && (
            <div className={s.coverImage}>
              <img src={coverURL} width={'170px'} />
              <button className={s.iconButton} onClick={onDeleteImageHandler}>
                <CloseCrossOutline />
              </button>
            </div>
          )}
          <Button as={'label'} fullWidth htmlFor={'addDeckCoverInput'} variant={'secondary'}>
            <Image width={'1rem'} /> {cover ? 'Change Image' : 'Upload Image'}
          </Button>
          <div className={s.checkBoxWrapper}>
            <ControlledCheckbox control={control} labelText={'Private Pack'} name={'isPrivate'} />
          </div>
          <div className={s.footerWrapper}>
            <div>
              <Button onClick={() => setOpen(false)} variant={'secondary'}>
                Cancel
              </Button>
            </div>
            <div>
              <Button onClick={handleSubmit(onSubmit)} variant={'primary'}>
                Add New Deck
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  )
}
