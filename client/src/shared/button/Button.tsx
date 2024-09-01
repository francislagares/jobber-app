import { FC, ReactElement } from 'react';

import { ButtonProps } from '@/shared/shared.interface';

const Button: FC<ButtonProps> = ({
  id,
  type,
  label,
  role,
  className,
  disabled,
  onClick,
}): ReactElement => {
  return (
    <button
      id={id}
      type={type}
      role={role}
      className={className}
      disabled={disabled}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
