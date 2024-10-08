import {
  ChangeEvent,
  CSSProperties,
  Dispatch,
  KeyboardEvent,
  ReactNode,
  SetStateAction,
} from 'react';

export interface BannerProps {
  bgColor: string;
  text: string;
  showLink: boolean;
  linkText?: string;
  onClick?: () => void;
}

export interface AlertProps {
  type: string;
  message: string;
}

export interface AlertTypes {
  [key: string]: string;
  success: string;
  error: string;
  warning: string;
}

export interface BreadCrumbProps {
  breadCrumbItems: string[];
}

export interface DropdownProps {
  text: string;
  values: string[];
  maxHeight: string;
  mainClassNames?: string;
  dropdownClassNames?: string;
  showSearchInput?: boolean;
  style?: CSSProperties;
  setValue?: Dispatch<SetStateAction<string>>;
  onClick?: (item: string) => void;
}

export interface HtmlParserProps {
  input: string;
}

export interface PageMessageProps {
  header: string;
  body: string;
}

export interface TextInputProps {
  id?: string;
  name?: string;
  type?: string;
  value?: string | number;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  readOnly?: boolean;
  checked?: boolean;
  rows?: number;
  autoFocus?: boolean;
  maxLength?: number;
  min?: string | number;
  max?: string | number;
  onChange?: (event: ChangeEvent) => void;
  onClick?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyUp?: () => void;
  onKeyDown?: (event: KeyboardEvent) => void;
}

export interface ButtonProps {
  label?: string | ReactNode;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  className?: string;
  role?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (event?: any) => void;
  disabled?: boolean;
  testId?: string;
}

export interface SliderImagesText {
  header: string;
  subHeader: string;
}

export interface StarRatingProps {
  value?: number;
  size?: number;
  setReviewRating?: Dispatch<SetStateAction<number>>;
}

export interface GigCardItemModal {
  overlay: boolean;
  deleteApproval: boolean;
}
