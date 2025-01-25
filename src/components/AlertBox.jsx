import * as React from 'react';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

export default function SimpleAlert(props) {
  return (
    <Alert icon={<CheckIcon fontSize="inherit" />} severity={props.severity}>
        {props.message}
      {/* Here is a gentle confirmation that your action was successful. */}
    </Alert>
  );
}
