import { FieldValues, UseControllerProps, useController } from 'react-hook-form'

import { TextField, TextFieldProps } from '@/components/ui/textField'

type Props<T extends FieldValues> = TextFieldProps & UseControllerProps<T>

export const ControlledTextField = <T extends FieldValues>({
  CloseIcon,
  control,
  defaultValue,
  disabled,
  labelText,
  name,
  onClear,
  onBlur,
  rules,
  shouldUnregister,
  wrapperProps,
  ...rest
}: Props<T>) => {
  const {
    field: { onChange, value, ...field },
    fieldState: { error },
  } = useController({
    control,
    defaultValue,
    disabled,
    name,
    rules,
    shouldUnregister,
  })

  return (
    <TextField
      {...rest}
      handleValueChange={onChange}
      wrapperProps={wrapperProps}
      {...field}
      CloseIcon={CloseIcon}
      defaultValue={defaultValue}
      labelText={labelText}
      onClear={onClear}
      validationError={error?.message}
      onBlur={onBlur}
    />
  )
}
