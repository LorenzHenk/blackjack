import React, { useState } from "react";
import {
  Button,
  Box,
  makeStyles,
  Typography,
  Checkbox,
  FormControlLabel,
  Slider,
} from "@material-ui/core";
import { PlayingCard, Suit } from "../../utils/card";
import { CARD_TO_COUNT_VALUE_MAPPING } from "../../utils/count";
import { Settings } from ".";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    height: "100%",
    gridTemplateAreas: `"description" "settings" "actions"`,
    gridTemplateRows: `1fr min-content max-content`,
    padding: theme.spacing(),
    justifyItems: "center",
    // TODO find out how to hide scrollbars
    overflow: "hidden",
  },
  description: {
    gridArea: "description",
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  rules: {
    display: "grid",
    gridTemplateRows: "1fr 1fr 1fr",
    gridTemplateColumns: "max-content minmax(min-content, 1fr)",
    alignItems: "center",
    overflow: "auto",
    gridGap: theme.spacing(),
    height: "100%",
  },
  value: {
    justifySelf: "end",
    ...theme.typography.h5,
  },
  cards: {
    justifySelf: "start",
    ...theme.typography.h1,
    borderLeft: "1px solid",
    borderLeftColor: theme.palette.action.selected,
  },
}));

interface Props {
  onStart: (settings: Settings) => void;
}

function StartScreen(props: Props) {
  const classes = useStyles();

  const [realLifeMode, setRealLifeMode] = useState(false);
  const [deckCount, setDeckCount] = useState(1);

  const handleSliderChange = (
    _event: React.ChangeEvent<{}>,
    value: number | number[]
  ) => {
    if (typeof value === "number") {
      setDeckCount(value);
    }
  };

  const handleStart = () => {
    props.onStart({ realLifeMode, deckCount });
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.description}>
        <Typography variant="body1" gutterBottom>
          In this mode you can practice assigning cards to their mental counter
          value.
        </Typography>
        <Typography align="center" variant="h5" gutterBottom>
          Card to mental counter - mapping
        </Typography>
        <Box className={classes.rules}>
          <div className={classes.value}>+1</div>
          <div className={classes.cards}>
            {CARD_TO_COUNT_VALUE_MAPPING.low.map((value) => (
              <PlayingCard key={value} card={{ suit: Suit.Spades, value }} />
            ))}
          </div>
          <div className={classes.value}>0</div>
          <div className={classes.cards}>
            {CARD_TO_COUNT_VALUE_MAPPING.neutral.map((value) => (
              <PlayingCard key={value} card={{ suit: Suit.Spades, value }} />
            ))}
          </div>
          <div className={classes.value}>-1</div>
          <div className={classes.cards}>
            {CARD_TO_COUNT_VALUE_MAPPING.high.map((value) => (
              <PlayingCard key={value} card={{ suit: Suit.Spades, value }} />
            ))}
          </div>
        </Box>
      </Box>

      <Box gridArea="settings">
        <Typography variant="h5">Settings</Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={realLifeMode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setRealLifeMode(event.target.checked)
              }
            />
          }
          label="Real life mode"
        />
        <Typography id="discrete-slider" gutterBottom>
          Amount of decks used
        </Typography>
        <Slider
          value={deckCount}
          onChange={handleSliderChange}
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1}
          max={8}
        />
      </Box>
      <Box gridArea="actions">
        <Button
          onClick={handleStart}
          variant="contained"
          color="secondary"
          size="large"
        >
          START
        </Button>
      </Box>
    </Box>
  );
}

export default StartScreen;
