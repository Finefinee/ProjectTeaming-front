import React from 'react';
import { Typography } from '@mui/material';

export default function ErrorMessage({ message }: { message: string }) {
  return <Typography color="error">{message}</Typography>;
}
