import React from "react";
import classnames from "classnames";

export const COLORS = {
  BLUE: "BLUE",
  GREEN: "GREEN",
  INVERTED: "INVERTED",
};

const Button = (props) => {
  const { onClick, color, text, className } = props;
  return (
    <button
      onClick={onClick}
      className={classnames([
        "py-4 w-full rounded",
        { "bg-b-blue": color === COLORS.BLUE },
        { "bg-p-green": color === COLORS.GREEN },
        {
          "border border-b-blue text-b-blue bg-b-inverted":
            color === COLORS.INVERTED,
        },
        className,
      ])}
    >
      {text}
    </button>
  );
};

export default Button;
