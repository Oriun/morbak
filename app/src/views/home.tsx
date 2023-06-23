import * as React from "react";
import { useMainContext } from "@/contexts/main";
import { Link, useNavigate } from "react-router-dom";

interface IHomeViewProps {}

const HomeView: React.FunctionComponent<IHomeViewProps> = (props) => {
  const navigate = useNavigate();
  const { user } = useMainContext();
  const [nextPage, setNextPage] = React.useState<string>("/name");

  React.useEffect(() => {
    if (user && user.name !== "Anonymous") {
      setNextPage("/select");
      const timeout = setTimeout(() => {
        navigate("/select");
      }, 5000);
      return () => {
        clearTimeout(timeout);
      };
    }
    const timeout = setTimeout(() => {
      navigate("/name");
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (
    <Link to={nextPage}>
      <img src="/monkey.gif" className="w-40 h-40 rounded-full" />
    </Link>
  );
};

export default HomeView;
