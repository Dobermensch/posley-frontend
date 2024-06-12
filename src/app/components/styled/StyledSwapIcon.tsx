import SwapVertIcon from '@mui/icons-material/SwapVert';
import { styled } from '@mui/material';

export const StyledSwapIcon = styled(SwapVertIcon)({
  cursor: 'pointer',
  '&:active': {
    transform: 'scale(0.8)',
  },
  '&:hover': {
    transform: 'scale(0.9)',
  },
});
