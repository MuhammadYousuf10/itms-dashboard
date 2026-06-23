import React from 'react';
import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material';
import { Controller } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';

type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
} & Omit<TextFieldProps, 'name' | 'error' | 'helperText'>;

export default function FormInput<T extends FieldValues>({ 
  name, 
  control, 
  label, 
  ...props 
}: FormInputProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          label={label}
          fullWidth
          variant="outlined"
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}
