import { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import { Visibility, VisibilityOff } from '@mui/icons-material';

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
} & Omit<TextFieldProps, 'name' | 'error' | 'helperText'> & { InputProps?: any };

export default function FormInput<T extends FieldValues>({
  name,
  control,
  label,
  type,
  ...props
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const isPasswordField = type === 'password';
  const currentType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          value={field.value ?? ''}
          label={label}
          type={currentType}
          fullWidth
          variant="outlined"
          error={!!error}
          helperText={error?.message}
          slotProps={{
            ...(props as any).slotProps,
            inputLabel: {
              ...(props as any).InputLabelProps,
              shrink: field.value ? true : undefined,
            },
            input: {
              ...(props.slotProps as any)?.input,
              ...props.InputProps,
              endAdornment: isPasswordField ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ) : props.InputProps?.endAdornment || (props.slotProps as any)?.input?.endAdornment,
            }
          }}
        />
      )}
    />
  );
}
