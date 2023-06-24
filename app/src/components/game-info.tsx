import * as React from 'react';
import {
    ClockIcon,
    ArrowsPointingOutIcon,
    ArrowTrendingUpIcon,
  } from "@heroicons/react/24/outline";
import { Room } from '@/contexts/main';

interface IGameInfosProps  extends Room {
}

const GameInfos: React.FunctionComponent<IGameInfosProps> = ({...room}) => {
  return (<div className="flex items-center justify-center gap-4">
  <div className="flex items-center gap-2">
    <ClockIcon className="rounded-full w-6 h-6 p-1 bg-white text-indigo-dye" />
    <p>{room.timer} secondes</p>
  </div>
  <div className="flex items-center gap-2">
    <ArrowsPointingOutIcon className="rounded-full w-6 h-6 p-1 bg-white text-indigo-dye" />
    <p>{room.size.join("x")}</p>
  </div>
  <div className="flex items-center gap-2">
    <ArrowTrendingUpIcon className="rounded-full w-6 h-6 p-1 bg-white text-indigo-dye" />
    <p>{room.winLength} alignés</p>
  </div>
</div>)
};

export default GameInfos;
