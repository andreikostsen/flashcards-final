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
  rules, onBlur: customOnBlur, // ⬅️ rename to avoid conflict
  shouldUnregister,
  wrapperProps,
  ...rest
}: Props<T>) => {
  const {
    field: { onChange, onBlur, value, ...field },
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
    onBlur(); // Call react-hook-form's blur tracking
    customOnBlur?.(e); // Call your custom handler
  };

  return (
    <TextField
      {...rest}
      {...field}
      onBlur={handleBlur} // ✅ merged blur handler
      handleValueChange={onChange}
      wrapperProps={wrapperProps}
      CloseIcon={CloseIcon}
      // defaultValue={defaultValue}
      labelText={labelText}
      onClear={onClear}
      validationError={error?.message}
      value={value ?? ''} // ✅ use value from react-hook-form
    />
  )
}
