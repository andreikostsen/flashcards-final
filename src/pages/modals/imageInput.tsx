import { ChangeEvent, useEffect, useState } from 'react'
import { FieldErrors } from 'react-hook-form'

import { Image } from '@/assets/icons/components'
import CloseCrossOutline from '@/assets/icons/components/Close'
import { Button } from '@/components/ui/button'
import { Typography } from '@/components/ui/typography'
import { addNewDeckFormValues } from '@/pages/modals/addNewDecksModal-schema'

import s from '@/pages/modals/imageInput.module.scss'

type PropsType = {
  cover?: string
  coverFromInput: (cover: File | string) => void
  errors: FieldErrors<addNewDeckFormValues>
  id: keyof addNewDeckFormValues
  setValue: any
  trigger: any
}

export const ImageInput = ({ errors, id, setValue, trigger, ...props }: PropsType) => {
  useEffect(() => {
    setCoverURL(props.cover)
  }, [props.cover])

  const [coverURL, setCoverURL] = useState<string | undefined>()

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCoverURL(URL.createObjectURL(e.target.files?.[0]))
      setValue(id, e.target.files?.[0])
      trigger(id)
      props.coverFromInput(e.target.files?.[0])
    }
  }

  const onDeleteImageHandler = () => {
    if (coverURL != null) {
      URL.revokeObjectURL(coverURL)
    }
    props.coverFromInput('')
    setCoverURL(undefined)
  }

  return (
    <>
      <div>
        <input id={id} onChange={onFileChange} style={{ display: 'none' }} type={'file'} />
      </div>
      <div className={s.coverWrapper}>
        {coverURL && (
          <div className={s.coverImage}>
            <img alt={id} src={coverURL} width={'170px'} />
            <button className={s.iconButton} onClick={onDeleteImageHandler}>
              <CloseCrossOutline />
            </button>
          </div>
        )}
        {errors[id] && (
          <Typography className={s.error} variant={'error'}>
            <>{errors[id]?.message}</>
          </Typography>
        )}
      </div>
      <Button as={'label'} fullWidth htmlFor={id} variant={'secondary'}>
        <Image width={'1rem'} /> {coverURL ? 'Change Image' : 'Upload Image'}
      </Button>
    </>
  )
}
