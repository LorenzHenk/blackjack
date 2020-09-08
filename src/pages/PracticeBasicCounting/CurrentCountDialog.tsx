import React, { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  Box,
} from "@material-ui/core";

function generateValues(correctValue: number, amount = 8): number[] {
  const values = [];
  const correctIndex = Math.floor(Math.random() * amount);

  for (let i = 0; i < correctIndex; i++) {
    values.push(correctValue - (correctIndex - i));
  }

  values.push(correctValue);

  for (let i = correctIndex + 1; i < amount; i++) {
    values.push(correctValue + (i - correctIndex));
  }

  return values;
}

interface Props {
  onClose: () => void;
  correctValue: number;
}

export function CurrentCountDialog({ correctValue, onClose }: Props) {
  const [fakeValues] = useState(generateValues(correctValue));

  const [failingValues, setFailingValues] = useState<number[]>([]);

  const guessValue = (value: number) => {
    if (value === correctValue) {
      onClose();
    } else {
      setFailingValues((vs) => [...vs, value]);
    }
  };

  return (
    <Dialog open>
      <DialogTitle>Pick current total count value</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Pick the correct current total count value (excluding the current card
          value) from the list below.
        </DialogContentText>

        <Box
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          {fakeValues.map((v) => (
            <Button
              disabled={failingValues.includes(v)}
              onClick={() => guessValue(v)}
            >
              {v}
            </Button>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
