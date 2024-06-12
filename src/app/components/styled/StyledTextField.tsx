import { TextField, styled } from '@mui/material';

export const StyledTextField = styled(TextField)({
  input: {
    color: 'white',
  },
  '& .Mui-disabled': {
    WebkitTextFillColor: 'initial !important',
  },
  '& > .Mui-disabled': {
    color: '#1976d2',
  },
});
