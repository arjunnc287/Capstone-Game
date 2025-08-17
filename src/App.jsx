import { useEffect, useState } from "react";
import { clsx } from "clsx";
import Confetti from "react-confetti";
import { languages } from "./languages";
import { getFarewellText, getRandomWord } from "./utils";
import "./index.css";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

export default function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  const wrongLetters = guessedLetters.filter((l) => !currentWord.includes(l));
  const wrongGuessCount = wrongLetters.length;
  const maxAttempts = languages.length;
  const attemptsLeft = maxAttempts - wrongGuessCount;

  const isGameWon = currentWord
    .split("")
    .every((l) => guessedLetters.includes(l));
  const isGameLost = attemptsLeft <= 0 && !isGameWon;
  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  function addGuessedLetter(letter) {
    if (isGameOver || guessedLetters.includes(letter)) return;
    setGuessedLetters((prev) => [...prev, letter]);
  }

  function startNewGame() {
    setCurrentWord(getRandomWord());
    setGuessedLetters([]);
  }

  useEffect(() => {
    function onKeyDown(e) {
      const key = e.key.toLowerCase();
      if (/^[a-z]$/.test(key)) addGuessedLetter(key);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isGameOver]);

  const languageElements = languages.map((lang, index) => {
    const isLost = index < wrongGuessCount;
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    return (
      <span
        key={lang.name}
        className={clsx("chip", isLost && "lost")}
        style={styles}
      >
        {isLost ? <s>{lang.name} 💀</s> : lang.name}
      </span>
    );
  });

  const letterElements = currentWord.split("").map((letter, index) => {
    const showLetter = isGameLost || guessedLetters.includes(letter);
    return (
      <span key={index} className={clsx("letter", !showLetter && "hidden")}>
        {showLetter ? letter.toUpperCase() : "_"}
      </span>
    );
  });

  const keyboardElements = ALPHABET.map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isWrong = isGuessed && !isCorrect;

    return (
      <button
        key={letter}
        className={clsx({ correct: isCorrect, wrong: isWrong })}
        onClick={() => addGuessedLetter(letter)}
        disabled={isGuessed || isGameOver}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">
          {getFarewellText(languages[wrongGuessCount - 1]?.name || "")}
        </p>
      );
    }

    if (isGameWon) {
      return (
        <div className="winning-message">
          <h2>You Win!</h2>
          <p>Well done! 🎉</p>
        </div>
      );
    }

    if (isGameLost) {
      return (
        <div className="losing-message">
          <h2>Game Over</h2>
          <p>The word was {currentWord.toUpperCase()}</p>
        </div>
      );
    }

    return null;
  }

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={800} />}
      <header className="Header">
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under {maxAttempts} attempts to keep the programming
          world safe from Assembly!
        </p>
      </header>

      <section className="game-status">{renderGameStatus()}</section>

      <section className="language-chips">{languageElements}</section>

      <div className="status">
        <strong>Attempts Left:</strong> {attemptsLeft}
      </div>

      <section className="word-container">{letterElements}</section>

      <section className="keyboard">{keyboardElements}</section>

      {isGameOver && (
        <button className="new-game" onClick={startNewGame}>
          New Game
        </button>
      )}
    </main>
  );
}
