import Button from "@/components/button";
import MorbakLogo from "@/components/morbak";
import { User, useMainContext } from "@/contexts/main";
import { ask } from "@/services/socket";
import * as React from "react";

interface IMainLayoutProps {
  children: React.ReactNode | React.ReactNode[];
}

const MainLayout: React.FunctionComponent<IMainLayoutProps> = (props) => {
  const { user, update } = useMainContext();
  React.useEffect(() => {
    (async () => {
      const data = await ask("me")();
      if (!data) return;
      const user = JSON.parse(data) as User;
      console.log({user})
      update((state) => ({ ...state, user }));
    })();
  }, []);
  console.log("in layout", user)
  async function testFn() {
    await ask("test")();
  }
  return (
    <main className="w-screen min-h-screen bg-indigo-dye flex flex-col items-center justify-between px-10 py-20 text-white relative">
      <MorbakLogo />
      {user && (
      <div className="absolute top-2 left-2 flex items-center">
        <img className="mr-4 w-10 h-10 rounded-full border-2 border-white" src={user.avatar ?? "https://api.dicebear.com/6.x/bottts-neutral/svg?seed=Willow"} alt="" />
        <h4 className="text-lg">{user.name}</h4>
      </div>
      )}
      <section>{props.children}</section>
      <footer className="text-center text-xs">
        <Button onClick={testFn} className="mb-4">
          Test
        </Button>
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
