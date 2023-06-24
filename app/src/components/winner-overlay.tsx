import { User } from "@/contexts/main";
import * as React from "react";
import Button from "./button";
import WinnerSVG from "./winner";
import clsx from "clsx";

interface IWinnerOverlayProps {
  winner: User | null;
  close: () => void;
  next: () => void;
}

const WinnerOverlay: React.FunctionComponent<IWinnerOverlayProps> = ({
  winner,
  close, 
  next
}) => {
  return (
    <section
      className={clsx(
        "fixed bg-indigo-dye/80 z-50 flex flex-col items-center justify-center gap-8 transition-opacity duration-400",
        winner ? "opacity-100 inset-0" : "opacity-0 top-full"
      )}
    >
      <div
        className={clsx(
          "flex flex-col items-center justify-center gap-8 transition-all delay-200 duration-400",
          winner ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        )}
      >
        <WinnerSVG />
        <div>
          <img
            src={winner?.avatar ?? ""}
            alt="winner"
            className="w-16 h-16 rounded-full mx-auto"
          />
          <h2 className="text-2xl font-semibold text-center">{winner?.name}</h2>
        </div>
        <div className="flex items-center gap-5">
          <Button onClick={close} className="bg-indigo-dye/30 border-2 border-white text-white">
            Retour
          </Button>
          <Button onClick={next}>Terminer</Button>
        </div>
      </div>
    </section>
  );
};

export default WinnerOverlay;
