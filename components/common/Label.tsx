
import React from 'react';

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label: React.FC<LabelProps> = ({ children, ...props }) => {
  return (
    <label
      {...props}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {children}
    </label>
  );
};

export default Label;
