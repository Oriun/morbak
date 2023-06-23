import Button from "@/components/button";
import MorbakLogo from "@/components/morbak";
import { ask } from "@/services/socket";
import * as React from "react";

interface IMainLayoutProps {
  children: React.ReactNode | React.ReactNode[];
}

const MainLayout: React.FunctionComponent<IMainLayoutProps> = (props) => {
  async function testFn() {
    await ask("test")();
  }
  return (
    <main className="w-screen min-h-screen bg-indigo-dye flex flex-col items-center justify-between px-10 py-20 text-white ">
      <MorbakLogo />
      <section>{props.children}</section>
      <Button onClick={testFn}>Test</Button>
      <footer className="text-center text-xs">
        <p>
          Made with{" "}
          <span role="img" aria-label="heart">
            ❤️
          </span>{" "}
          by{" "}
          <a
            href="https://github.com/Oriun"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Oriun
          </a>
        </p>
      </footer>
    </main>
  );
};

export default MainLayout;
