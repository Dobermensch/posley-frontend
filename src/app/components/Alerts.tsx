'use client';

import { Alert, styled } from '@mui/material';
import { memo } from 'react';

type Props = {
  error: string;
  success: string;
};

const StyledAlert = styled(Alert)({
  marginBottom: '10px',
  maxWidth: '500px',
});

function Alerts({ error, success }: Props) {
  return (
    <>
      {error && (
        <StyledAlert className='alert' variant='filled' severity='error'>
          {error}
        </StyledAlert>
      )}

      {success && (
        <StyledAlert className='alert' variant='filled' severity='success'>
          {success}
        </StyledAlert>
      )}
    </>
  );
}

export default memo(Alerts);
