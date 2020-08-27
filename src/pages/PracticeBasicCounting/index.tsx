import React, { useState } from "react";

import { Box, Typography } from "@material-ui/core";

import { Runner } from "./Game";
import StartScreen from "./StartScreen";

export interface Settings {
  realLifeMode: boolean;
  deckCount: number;
}

export const initialSettings: Settings = {
  realLifeMode: false,
  deckCount: 1,
};

export function PracticeBasicCounting() {
  const [started, setStarted] = useState(false);

  const [settings, setSettings] = useState<Settings>(initialSettings);

  const handleStart = (settings: Settings) => {
    setSettings(settings);
    setStarted(true);
  };

  const handleReset = () => setStarted(false);

  return (
    <>
      <Box>
        <Typography variant="h4" align="center" gutterBottom>
          Practice Basic Counting
        </Typography>
      </Box>
      {started ? (
        <Runner onReset={handleReset} settings={settings} />
      ) : (
        <StartScreen onStart={handleStart} />
      )}
    </>
  );
}
