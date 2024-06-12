'use client';

import Button from '@mui/material/Button';

type Props = {
  onClickCallback?: () => void;
  title: string;
};

function TokenAmountRow({ onClickCallback, title }: Props) {
  return (
    <div className='token-amount-row'>
      <div>{title}</div>
      {onClickCallback && (
        <Button onClick={onClickCallback} size='small' variant='contained'>
          Max
        </Button>
      )}
    </div>
  );
}

export default TokenAmountRow;
