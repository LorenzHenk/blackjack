import React, { useState, useCallback, useEffect } from "react";
import { Card, PlayingCard } from "../../utils/card";
import { createDeck } from "../../utils/deck";
import { getDeckCountValue, getCardCountValue } from "../../utils/count";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { Typography, Box, makeStyles } from "@material-ui/core";

import { animated, useTransition, useSpring } from "react-spring";

import { useHotkeys } from "react-hotkeys-hook";
import { Settings } from ".";
import { CurrentCountDialog } from "./CurrentCountDialog";

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

function randomRotation(): number {
  return Math.round(Math.random() * 180);
}

const ASK_PROBABILITY = 0.05;

function randomShouldAskForCurrentCount(): boolean {
  return Math.random() < ASK_PROBABILITY;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "grid",
    height: "100%",
    padding: theme.spacing(),
    gridTemplateAreas: `"statistics" "content" "actions"`,
    gridTemplateRows: `min-content 1fr min-content`,
    justifyItems: "center",
    // TODO find out how to hide scrollbars
    overflow: "hidden",
  },
}));

interface Props {
  onReset: () => void;
  settings: Settings;
}

export function Runner({ settings, onReset }: Props) {
  const {
    cardCountValue,
    deckCountValueWithoutCurrentCard,
    currentCard,
    cardsLeft,
    cardsDone,
    finished,
    nextCard,
  } = useDeck(settings.deckCount);

  const classes = useStyles();

  const [errors, setErrors] = useState(0);
  const increaseErrors = () => setErrors((err) => err + 1);

  const [startTime] = useState(() => new Date());
  const [endTime, setEndTime] = useState<Date | null>(null);

  const [rotation, setRotation] = useState(
    settings.realLifeMode ? randomRotation : 0
  );

  const [shouldAskForCurrentCount, setShouldAskForCurrentCount] = useState(
    settings.askForCurrentCount ? randomShouldAskForCurrentCount : false
  );

  const guessValue = (value: number) => () => {
    if (!finished) {
      if (value === cardCountValue) {
        if (settings.realLifeMode) {
          setRotation(randomRotation);
        }
        if (settings.askForCurrentCount) {
          setShouldAskForCurrentCount(randomShouldAskForCurrentCount());
        }
        nextCard();
      } else {
        console.log(
          `Incorrectly guessed ${value}, the actual value is ${cardCountValue}`
        );
        increaseErrors();
      }
    }
  };

  const reset = () => {
    onReset();
  };

  useEffect(() => {
    if (finished) {
      setEndTime(new Date());
    }
  }, [finished]);

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

  const errorProps = useSpring({
    o: errors % 2,
    from: {
      o: 0,
    },
  });

  const realLifeMode = useSpring({
    r: rotation,
    from: { r: 0 },
  });

  useHotkeys("right", guessValue(+1), [guessValue]);
  useHotkeys("left", guessValue(-1), [guessValue]);
  useHotkeys("down", guessValue(0), [guessValue]);

  return (
    <div className={classes.root}>
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

        {!finished && (
          <Box color="error.main" display="flex" justifyContent="center">
            <Button color="inherit" variant="outlined" onClick={reset}>
              Give up
            </Button>
          </Box>
        )}

        {finished && (
          <Typography variant="body1" align="center">
            You made it in{" "}
            {endTime &&
              ((endTime.getTime() - startTime.getTime()) / 1000).toPrecision(
                2
              )}{" "}
            seconds
          </Typography>
        )}
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
                <animated.div
                  style={{
                    transform: errorProps.o
                      .interpolate({
                        range: [0, 0.2, 0.4, 0.6, 0.8, 1],
                        output: [0, -10, 10, -10, 10, 0],
                      })
                      .interpolate((o) => `translateX(${o.toPrecision(2)}%)`),
                  }}
                >
                  <animated.div
                    style={{
                      transform: realLifeMode.r.interpolate(
                        (r) => `rotate(${r}deg)`
                      ),
                    }}
                  >
                    <span
                      style={{
                        fontSize: "200px",
                      }}
                    >
                      <PlayingCard card={item.currentCard} />
                    </span>
                  </animated.div>
                </animated.div>
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
          <ButtonGroup
            size="large"
            variant="contained"
            disableElevation
            color="primary"
          >
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

      {shouldAskForCurrentCount && (
        <CurrentCountDialog
          onClose={() => setShouldAskForCurrentCount(false)}
          correctValue={deckCountValueWithoutCurrentCard}
        />
      )}
    </div>
  );
}
