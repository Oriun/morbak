import Button from "@/components/button";
import MorbakLogo from "@/components/morbak";
import { User, useMainContext } from "@/contexts/main";
import { getMyself } from "@/services/functions";
import { ask } from "@/services/socket";
import * as React from "react";
import { Link } from "react-router-dom";

interface IMainLayoutProps {
  children: React.ReactNode | React.ReactNode[];
}

const MainLayout: React.FunctionComponent<IMainLayoutProps> = (props) => {
  const { user, update } = useMainContext();
  React.useEffect(() => {
    (async () => {
      try {
        if (user) return;
        const myself = await getMyself();
        update((state) => ({ ...state, user: myself }));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);
  async function testFn() {
    await ask("test")();
  }
  return (
    <main className="w-screen min-h-screen bg-indigo-dye flex flex-col items-center justify-between px-10 sm:py-20 text-white relative gap-2">
      <MorbakLogo className=" shrink-0" />
      {user && (
        <Link
          to="/name?redirect=true"
          className="absolute top-2 left-2 px-4 py-2 rounded-lg flex items-center hover:bg-lapis-lazuli"
        >
          <img
            className="mr-4 w-10 h-10 rounded-full border-solid border-2 border-white"
            src={
              user.avatar ??
              "https://api.dicebear.com/6.x/bottts-neutral/svg?seed=Willow"
            }
            alt=""
          />
          <h4 className="text-lg max-sm:hidden">{user.name}</h4>
        </Link>
      )}
      <section className="overflow-auto">{props.children}</section>
      <footer className="text-center text-xs shrink-0">
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
