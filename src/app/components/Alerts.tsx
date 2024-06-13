'use client';

import { Alert, CircularProgress, styled } from '@mui/material';
import { memo } from 'react';

type Props = {
  error: string;
  success: string;
  loading: boolean;
};

const StyledAlert = styled(Alert)({
  marginBottom: '10px',
  maxWidth: '500px',
});

const StyledCircularProgress = styled(CircularProgress)({
  alignSelf: 'center',
  marginBottom: '10px',
});

function Alerts({ error, success, loading }: Props) {
  return (
    <>
      {error && (
        <StyledAlert variant='filled' severity='error'>
          {error}
        </StyledAlert>
      )}

      {success && (
        <StyledAlert variant='filled' severity='success'>
          {success}
        </StyledAlert>
      )}

      {loading && <StyledCircularProgress />}
    </>
  );
}

export default memo(Alerts);
