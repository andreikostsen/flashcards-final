import {
  ChangeEvent,
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentType,
  KeyboardEvent,
  forwardRef,
  useState,
} from 'react'

import { Close, Search } from '@/assets/icons/components'
import { SvgWrapper } from '@/assets/icons/wrapper'
import { Label } from '@/components/ui/label'
import {
  PasswordVisibilityToggle,
  getInputFieldClasses,
  useGetId,
} from '@/components/ui/textField/Interdependence'
import { Typography } from '@/components/ui/typography'

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
  const {
    CloseIcon = Close,
    PasswordVisibilityToggleIcon = PasswordVisibilityToggle,
    SearchIcon = Search,
    className,
    handleValueChange,
    id,
    labelCustomProps,
    labelText,
    onChange,
    onClear,
    onEnter,
    onBlur,
    onKeyDown,
    placeholder,
    type = 'text',
    validationError,
    wrapperProps,
    ...inputRestProps
  } = props

  const [isPasswordVisible, togglePasswordVisibility] = useState(false)

  const isTypeSearch = type === 'search'
  const isTypePassword = type === 'password'

  const inputId = useGetId(id)

  const showError = !!validationError && validationError.length > 0
  const isShowClearButton = onClear && inputRestProps?.value?.length! > 0

  const resolvedInputType = resolveInputType(type, isPasswordVisible)

  const handleInputChange = useHandleInputChange(onChange, handleValueChange)
  const handleKeyDown = useHandleKeyDown(onEnter, onKeyDown)

  const handleTogglePasswordVisibility = (): void => {
    togglePasswordVisibility(prevState => !prevState)
  }

  const InputFieldClasses = getInputFieldClasses({
    className,
    inputRestProps,
    isShowClearButton,
    isTypePassword,
    isTypeSearch,
    labelCustomProps,
    showError,
    wrapperProps,
  })

  return (
    <div className={InputFieldClasses.wrapperClass}>
      {labelText && (
        <Label
          aria-label={labelText}
          className={InputFieldClasses.labelClass}
          htmlFor={inputId}
          label={labelText}
        />
      )}

      <div className={InputFieldClasses.inputWrapperClass}>
        <input
          className={InputFieldClasses.inputClass}
          id={inputId}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
          placeholder={placeholder}
          ref={ref}
          type={resolvedInputType}
          {...inputRestProps}
        />
        {isTypeSearch && SearchIcon && (
          <SvgWrapper
            SvgComponent={Search}
            svgClassName={InputFieldClasses.svgIconsClass}
            wrapperClassName={InputFieldClasses.svgWrapperClasses}
          />
        )}
        {isShowClearButton && !isTypePassword && CloseIcon && (
          <SvgWrapper
            SvgComponent={Close}
            onClick={onClear}
            size={'0.875rem'}
            svgClassName={InputFieldClasses.svgClearClass}
            wrapper={'button'}
            wrapperClassName={
              isShowClearButton ? InputFieldClasses.svgWrapperClassesForClearSvg : undefined
            }
          />
        )}
        {isTypePassword && PasswordVisibilityToggleIcon && (
          <PasswordVisibilityToggle
            isTypePassword
            isVisible={isPasswordVisible}
            onClick={handleTogglePasswordVisibility}
            size={'1.25rem'}
          />
        )}
      </div>
      {!!validationError && (
        <Typography className={InputFieldClasses.errorTextClass} variant={'error'}>
          {validationError}
        </Typography>
      )}
    </div>
  )
})

/**
 * Resolves the input type based on the given input type and password visibility.
 *
 * @param {ComponentProps<"input">["type"]} inputType - The input type.
 * @param {boolean} isPasswordVisible - Indicates whether the password is visible.
 * @return {ComponentProps<"input">["type"]} The resolved input type.
 */
function resolveInputType(
  inputType: ComponentProps<'input'>['type'],
  isPasswordVisible: boolean
): ComponentProps<'input'>['type'] {
  return inputType === 'password' && isPasswordVisible ? 'text' : inputType
}

/**
 * Returns a callback function that handles input change events on an input element.
 *
 * @param {function} onChange - Optional callback function to be called when the input value changes.
 * @param {function} handleValueChange - Optional callback function to be called with the new input value.
 * @return {function} The callback function that handles input change events.
 */
const useHandleInputChange = (
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void,
  handleValueChange?: (value: string) => void
): ((event: ChangeEvent<HTMLInputElement>) => void) => {
  return (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value

    onChange?.(event)
    handleValueChange?.(inputValue)
  }
}

/**
 * Returns a callback function that handles keydown events on an input element.
 *
 * @param {function} onEnter - Optional callback function to be called when the 'Enter' key is pressed.
 * @param {function} onKeyDown - Optional callback function to be called when any key is pressed.
 * @return {function} The callback function that handles keydown events.
 */
const useHandleKeyDown = (
  onEnter?: (event: KeyboardEvent<HTMLInputElement>) => void,
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void
): ((e: KeyboardEvent<HTMLInputElement>) => void) => {
  return (e: KeyboardEvent<HTMLInputElement>) => {
    if (onEnter && e.key === 'Enter') {
      onEnter(e)
    }
    onKeyDown?.(e)
  }
}

export interface TextFieldProps extends ComponentPropsWithoutRef<'input'> {
  CloseIcon?: ComponentType
  PasswordVisibilityToggleIcon?: ComponentType
  SearchIcon?: ComponentType
  handleValueChange?: (value: string) => void
  labelCustomProps?: ComponentProps<'label'>
  labelText?: string
  onClear?: () => void
  onEnter?: (e: KeyboardEvent<HTMLInputElement>) => void
  type?: ComponentProps<'input'>['type']
  validationError?: string
  value?: string
  wrapperProps?: ComponentProps<'div'>
}
