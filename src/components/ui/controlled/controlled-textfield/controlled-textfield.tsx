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
  onBlur: customOnBlur, // ⬅️ rename to avoid conflict
  onClear,
  rules,
  shouldUnregister,
  wrapperProps,
  ...rest
}: Props<T>) => {
  const {
    field: { onBlur, onChange, value, ...field },
    fieldState: { error },
  } = useController({
    control,
    // defaultValue,
    disabled,
    name,
    rules,
    shouldUnregister,
  })

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onBlur() // Call react-hook-form's blur tracking
    customOnBlur?.(e) // Call your custom handler
  }

  return (
    <TextField
      {...rest}
      {...field}
      CloseIcon={CloseIcon}
      handleValueChange={onChange}
      // defaultValue={defaultValue}
      labelText={labelText}
      onBlur={handleBlur} // ✅ merged blur handler
      onClear={onClear}
      validationError={error?.message}
      value={value ?? ''} // ✅ use value from react-hook-form
      wrapperProps={wrapperProps}
    />
  )
}
