import React from "react";

type S = HTMLElement & { value: any };

export type UseInputHandler<T extends S = HTMLInputElement> = {
  value: string;
  onChange: (v: React.ChangeEvent<T> | string) => void;
};

export type UseInputOptions<V extends string | number = string> = {
  transform?: (v: V) => V;
  validate?: (v: V) => boolean;
  onError?: (v: V) => void;
};

const useInput = <
  T extends S = HTMLInputElement | HTMLTextAreaElement,
  V extends string | number = string
>(
  initialValue: V,
  {
    transform = (v) => v,
    validate = (v) => true,
    onError = (v) => {},
  }: UseInputOptions<V> = {}
) => {
  const [value, setValue] = React.useState<V>(initialValue as V);
  const onChange = (e: React.ChangeEvent<T> | V) => {
    const value = typeof e === "object" ? e.target.value : e;
    if (!validate(value)) {
      onError(value);
      return;
    }
    setValue(transform(value));
  };
  return { value, onChange };
};

export default useInput;
