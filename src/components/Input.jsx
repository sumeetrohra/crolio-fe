import classnames from "classnames";
import React from "react";

const Input = (props) => {
  const {
    label,
    onChange,
    value,
    className,
    placeholder,
    width,
    containerClassName,
  } = props;

  return (
    <div className={classnames(["flex flex-col", containerClassName])}>
      {label && (
        <label className="text-sm text-p-secondary font-normal pb-2">
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={onChange}
        className={classnames([
          "border border-input-border h-10 rounded bg-transparent outline-none px-4 active:border-white focus:border-white",
          className,
        ])}
        placeholder={placeholder}
        style={{ width: width || "256px" }}
      />
    </div>
  );
};

export default Input;
