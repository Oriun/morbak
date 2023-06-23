import { ask } from "@/services/socket";
import * as React from "react";
import { Link, useNavigate } from "react-router-dom";

interface IHomeViewProps {}

const HomeView: React.FunctionComponent<IHomeViewProps> = (props) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      console.log("asking me")
      const data = await ask("me")();
      if(!data) {
        throw new Error("no data")
      }
      const me = JSON.parse(data)
      console.log({ me });
    })();
    // setTimeout(() => {
    //   navigate("/name");
    // }, 5000);
  }, []);
  return (
    <Link to="/name">
      <img src="/monkey.gif" className="w-40 h-40 rounded-full" />
    </Link>
  );
};

export default HomeView;
