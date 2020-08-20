import React, { useState, useCallback } from "react";
import { getCardEmoji, Card, isRedCard } from "../../utils/card";
import { createDeck } from "../../utils/deck";
import { getDeckCountValue, getCardCountValue } from "../../utils/count";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Typography, Box, makeStyles } from "@material-ui/core";

import { animated, useTransition } from "react-spring";

function useDeck(deckAmount: number) {
  const [deck, setDeck] = useState(() =>
    createDeck({ cardAmountFactor: deckAmount })
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextCard = useCallback(() => setCurrentIndex((v) => v + 1), []);

  const currentCard = (deck[currentIndex] || null) as Card | null;

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

  const transitions = useTransition(
    { currentCard, cardCountValue },
    ({ currentCard: c }) => (c ? c.suit + " " + c.value : "NO CARD LEFT"),
    {
      from: {
        opacity: 0,
        transform: "translate3d(-50%,-50%,0)",
        // absolute position needed for card positioning not to affect each other
        position: "absolute",
      },
      enter: { opacity: 1, transform: "translate3d(-50%,0,0)" },
      leave: ({ cardCountValue: countValue }) => ({
        opacity: 0,
        transform: [
          "translate3d(-200%,0,0)",
          "translate3d(-50%,100%,0)",
          "translate3d(150%,0,0)",
        ][(countValue ?? 0) + 1],
      }),
    }
  );

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
          transitions.map(({ item, props, key }) => (
            <animated.div
              key={key}
              style={{
                ...props,
              }}
            >
              {item.currentCard && (
                <span
                  style={{
                    fontSize: "200px",
                    color: isRedCard(item.currentCard) ? "red" : "black",
                    background: "white",
                    // only show background behind the card icon
                    clipPath:
                      "polygon(4px 19px, 127px 19px, 127px 203px, 4px 203px)",
                  }}
                >
                  {getCardEmoji(item.currentCard)}
                </span>
              )}
            </animated.div>
          ))
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
    // TODO find out how to hide scrollbars
    overflow: "hidden",
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
