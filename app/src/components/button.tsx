import * as React from "react";
import { twMerge } from "tailwind-merge";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FunctionComponent<IButtonProps> = ({
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={twMerge("text-caribbean-current bg-white text-base font-medium px-6 py-2 rounded-md cursor-pointer", className)}
    />
  );
};

export default Button;
