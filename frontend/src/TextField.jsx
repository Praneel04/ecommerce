import React from "react";

export default function TextField({ ...otherProps }) {
  return (
    <input
      className="elegant-input"
      {...otherProps}
    />
  );
}
