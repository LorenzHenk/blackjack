import React, { useState, useCallback } from "react";
import { getCardEmoji, Card } from "../../utils/card";
import { createDeck } from "../../utils/deck";
import { getDeckCountValue, getCardCountValue } from "../../utils/count";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Typography, Box, makeStyles } from "@material-ui/core";

function useDeck(deckAmount: number) {
  const [deck, setDeck] = useState(() =>
    createDeck({ cardAmountFactor: deckAmount })
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = useCallback(() => setCurrentIndex((v) => v + 1), []);

  const currentCard: Card | null = deck[currentIndex] || null;

  const finished = currentCard === null;

  const deckCountValueWithoutCurrentCard = getDeckCountValue(
    deck.slice(0, currentIndex)
  );

  const cardCountValue = currentCard ? getCardCountValue(currentCard) : null;

  const cardsLeft = deck.length - currentIndex;

  const reset = () => {
    setDeck(createDeck({ cardAmountFactor: deckAmount }));
    setCurrentIndex(0);
  };

  return {
    deck,
    currentIndex,
    nextCard,
    currentCard,
    finished,
    deckCountValueWithoutCurrentCard,
    cardCountValue,
    cardsLeft,
    cardsDone: currentIndex,
    reset,
  };
}

function Runner() {
  const {
    cardCountValue,
    currentCard,
    cardsLeft,
    cardsDone,
    finished,
    reset: resetDeck,
    nextCard,
  } = useDeck(1);

  const [errors, setErrors] = useState(0);
  const increaseErrors = () => setErrors((err) => err + 1);

  const guessValue = (value: number) => () => {
    if (value === cardCountValue) {
      nextCard();
    } else {
      increaseErrors();
      alert("WRONG");
    }
  };

  const reset = () => {
    resetDeck();
    setErrors(0);
  };

  return (
    <>
      <Box display="flex" gridArea="statistics" flexDirection="column">
        <Typography variant="body1" align="center">
          {finished ? <>{cardsDone} cards done</> : <>{cardsLeft} cards left</>}
        </Typography>

        <Typography
          variant="body1"
          align="center"
          color={errors ? "error" : "initial"}
        >
          {errors} mistakes made
        </Typography>
      </Box>
      <Box gridArea="content" display="flex" alignItems="center">
        {finished ? (
          <Typography variant="h5" align="center">
            {errors === 0 ? (
              <>
                AWESOME, you made 0 mistakes
                <span role="img" aria-label="well done">
                  🎉
                </span>
              </>
            ) : (
              <>
                You need to practice {errors < 2 ? "a little bit " : ""}more 😉
              </>
            )}
          </Typography>
        ) : (
          <div style={{ fontSize: "200px" }}>
            {currentCard && getCardEmoji(currentCard)}
          </div>
        )}
      </Box>
      <Box gridArea="actions" paddingBottom={3}>
        {finished ? (
          <Button onClick={reset} variant="contained" color="primary">
            Practice again
          </Button>
        ) : (
          <ButtonGroup variant="contained" disableElevation color="primary">
            <Button disabled={finished} onClick={guessValue(-1)}>
              -
            </Button>
            <Button disabled={finished} onClick={guessValue(0)}>
              0
            </Button>
            <Button disabled={finished} onClick={guessValue(1)}>
              +
            </Button>
          </ButtonGroup>
        )}
      </Box>
    </>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    height: "100%",
    padding: theme.spacing(),
    gridTemplateAreas: `"heading" "statistics" "content" "actions"`,
    gridTemplateRows: `min-content min-content 1fr min-content`,
    justifyItems: "center",
  },
}));

export function PracticeBasicCounting() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Box gridArea="heading">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ gridArea: "heading" }}
        >
          Practice Basic Counting
        </Typography>
      </Box>
      <Runner />
    </div>
  );
}
