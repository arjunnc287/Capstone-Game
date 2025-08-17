// import { useState } from "react";
// import { clsx } from "clsx";
// import { languages } from "./languages";
// import { getFarewellText, getRandomWord } from "./utils";
// import Confetti from "react-confetti";

// export default function AssemblyEndgame() {
//   // State values
//   const [currentWord, setCurrentWord] = useState(() => getRandomWord());
//   const [guessedLetters, setGuessedLetters] = useState([]);

//   // Derived values
//   const numGuessesLeft = languages.length - 1;
//   const wrongGuessCount = guessedLetters.filter(
//     (letter) => !currentWord.includes(letter)
//   ).length;
//   const isGameWon = currentWord
//     .split("")
//     .every((letter) => guessedLetters.includes(letter));
//   const isGameLost = wrongGuessCount >= numGuessesLeft;
//   const isGameOver = isGameWon || isGameLost;
//   const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
//   const isLastGuessIncorrect =
//     lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

//   // Static values
//   const alphabet = "abcdefghijklmnopqrstuvwxyz";

//   function addGuessedLetter(letter) {
//     setGuessedLetters((prevLetters) =>
//       prevLetters.includes(letter) ? prevLetters : [...prevLetters, letter]
//     );
//   }

//   function startNewGame() {
//     setCurrentWord(getRandomWord());
//     setGuessedLetters([]);
//   }

//   const languageElements = languages.map((lang, index) => {
//     const isLanguageLost = index < wrongGuessCount;
//     const styles = {
//       backgroundColor: lang.backgroundColor,
//       color: lang.color,
//     };
//     const className = clsx("chip", isLanguageLost && "lost");
//     return (
//       <span className={className} style={styles} key={lang.name}>
//         {lang.name}
//       </span>
//     );
//   });

//   const letterElements = currentWord.split("").map((letter, index) => {
//     const shouldRevealLetter = isGameLost || guessedLetters.includes(letter);
//     const letterClassName = clsx(
//       isGameLost && !guessedLetters.includes(letter) && "missed-letter"
//     );
//     return (
//       <span key={index} className={letterClassName}>
//         {shouldRevealLetter ? letter.toUpperCase() : ""}
//       </span>
//     );
//   });

//   const keyboardElements = alphabet.split("").map((letter) => {
//     const isGuessed = guessedLetters.includes(letter);
//     const isCorrect = isGuessed && currentWord.includes(letter);
//     const isWrong = isGuessed && !currentWord.includes(letter);
//     const className = clsx({
//       correct: isCorrect,
//       wrong: isWrong,
//     });

//     return (
//       <button
//         className={className}
//         key={letter}
//         disabled={isGameOver}
//         aria-disabled={guessedLetters.includes(letter)}
//         aria-label={`Letter ${letter}`}
//         onClick={() => addGuessedLetter(letter)}
//       >
//         {letter.toUpperCase()}
//       </button>
//     );
//   });

//   const gameStatusClass = clsx("game-status", {
//     won: isGameWon,
//     lost: isGameLost,
//     farewell: !isGameOver && isLastGuessIncorrect,
//   });

//   function renderGameStatus() {
//     if (!isGameOver && isLastGuessIncorrect) {
//       return (
//         <p className="farewell-message">
//           {getFarewellText(languages[wrongGuessCount - 1].name)}
//         </p>
//       );
//     }

//     if (isGameWon) {
//       return (
//         <>
//           <h2>You win!</h2>
//           <p>Well done! 🎉</p>
//         </>
//       );
//     }
//     if (isGameLost) {
//       return (
//         <>
//           <h2>Game over!</h2>
//           <p>You lose! Better start learning Assembly 😭</p>
//         </>
//       );
//     }

//     return null;
//   }

//   return (
//     <main>
//       {isGameWon && <Confetti recycle={false} numberOfPieces={1000} />}
//       <header>
//         <h1>Assembly: Endgame</h1>
//         <p>
//           Guess the word within 8 attempts to keep the programming world safe
//           from Assembly!
//         </p>
//       </header>

//       <section aria-live="polite" role="status" className={gameStatusClass}>
//         {renderGameStatus()}
//       </section>

//       <section className="language-chips">{languageElements}</section>

//       <section className="word">{letterElements}</section>

//       {/* Combined visually-hidden aria-live region for status updates */}
//       <section className="sr-only" aria-live="polite" role="status">
//         <p>
//           {currentWord.includes(lastGuessedLetter)
//             ? `Correct! The letter ${lastGuessedLetter} is in the word.`
//             : `Sorry, the letter ${lastGuessedLetter} is not in the word.`}
//           You have {numGuessesLeft} attempts left.
//         </p>
//         <p>
//           Current word:{" "}
//           {currentWord
//             .split("")
//             .map((letter) =>
//               guessedLetters.includes(letter) ? letter + "." : "blank."
//             )
//             .join(" ")}
//         </p>
//       </section>

//       <section className="keyboard">{keyboardElements}</section>

//       {isGameOver && (
//         <button className="new-game" onClick={startNewGame}>
//           New Game
//         </button>
//       )}
//     </main>
//   );
// }

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
