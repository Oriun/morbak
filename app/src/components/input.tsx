import * as React from "react";
import { twMerge } from "tailwind-merge";

interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FunctionComponent<IInputProps> = ({
  className,
  type = "text",
  ...props
}) => {
  return (
    <input
      type={type}
      {...props}
      className={twMerge("rounded-md h-10 w-52 text-black px-2", className)}
    />
  );
};

export default Input;
