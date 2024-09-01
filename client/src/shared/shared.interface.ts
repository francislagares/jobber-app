import {
  ChangeEvent,
  CSSProperties,
  Dispatch,
  KeyboardEvent,
  ReactNode,
  SetStateAction,
} from 'react';

import {
  AuthDocument,
  AuthResponse,
  BuyerDocument,
  ConversationDocument,
  CreateGig,
  Education,
  Experience,
  Language,
  MessageDocument,
  OrderDocument,
  OrderNotifcation,
  ResetPassword,
  ReviewDocument,
  SellerDocument,
  SellerGig,
  SignInPayload,
  SignUpPayload,
} from '@francislagares/jobber-shared';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export type validationErrorsType =
  | SignInPayload
  | SignUpPayload
  | ResetPassword
  | CreateGig
  | Experience
  | Education
  | Language;

export interface IQueryResponse {
  data: AuthResponse;
  error: FetchBaseQueryError | SerializedError;
}

export interface IResponse {
  message?: string;
  token?: string;
  user?: AuthDocument;
  buyer?: BuyerDocument;
  seller?: SellerDocument;
  sellers?: SellerDocument[];
  gig?: SellerGig;
  gigs?: SellerGig[];
  total?: number;
  sortItems?: string[];
  conversations?: ConversationDocument[] | MessageDocument[];
  messages?: MessageDocument[];
  messageData?: MessageDocument;
  conversationId?: string;
  clientSecret?: string;
  paymentIntentId?: string;
  order?: OrderDocument;
  orders?: OrderDocument[];
  review?: ReviewDocument;
  reviews?: ReviewDocument[];
  notifications?: OrderNotifcation[];
  browserName?: string;
  deviceType?: string;
}

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
