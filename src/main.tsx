import React, { useEffect, useState } from "react";
import { sandbox } from "./utils/utils";

// BOLT_SAMPLECODE_START
import boltIconLight from "./assets/bolt-express-lightmode.svg";
import viteIcon from "./assets/vite.svg";
import reactIcon from "./assets/react.svg";
import typescriptIcon from "./assets/typescript.svg";
import sassIcon from "./assets/sass.svg";

// BOLT_SAMPLECODE_END

export const App = () => {
  // BOLT_SAMPLECODE_START
  const [count, setCount] = useState(0);
  const increment = () => setCount((prev) => prev + 1);

  const helloWorld = async () => {
    let result = await sandbox.createBox(400, 400);
    console.log(result);
  };
  // BOLT_SAMPLECODE_END

  useEffect(() => {}, []);
  return (
    <>
      <main>
        {/* BOLT_SAMPLECODE_START */}
        <a
          className="bolt-icon"
          href="https://hyperbrew.co/resources/bolt-express/"
          target="_blank"
        >
          <img src={boltIconLight} alt="" />
        </a>
        <div className="stack-icons">
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteIcon} alt="" />
            <span>Vite</span>
          </a>
          +
          <a href="https://react.dev" target="_blank">
            <img src={reactIcon} alt="" />
            <span> React </span>
          </a>
          +
          <a href="https://www.typescriptlang.org/" target="_blank">
            <img src={typescriptIcon} alt="" />
            <span> TypeScript </span>
          </a>
          +
          <a href="https://sass-lang.com/" target="_blank">
            <img src={sassIcon} alt="" />
            <span> Sass </span>
          </a>
        </div>
        <div className="card">
          <button onClick={increment}>Count {count}</button>
          <button onClick={helloWorld}>Hello World</button>
        </div>
        <div>
          <p>
            Edit <code>main.tsx</code> and save to test HMR updates.
          </p>
        </div>
        {/* BOLT_SAMPLECODE_END */}
      </main>
    </>
  );
};
