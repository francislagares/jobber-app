import { Dispatch, SetStateAction } from 'react';

export interface ReduxHeader {
  type: string;
  payload: string;
}

export interface ReduxShowCategory {
  type: string;
  payload: boolean;
}

export interface ReduxNotification {
  type?: string;
  payload: Notification;
}

export interface Notification {
  hasUnreadMessage?: boolean;
  hasUnreadNotification?: boolean;
}

export interface HomeHeaderProps {
  buyer?: BuyerDocument;
  seller?: SellerDocument;
  authUser?: AuthUser;
  type?: string;
  showCategoryContainer?: boolean;
  setIsDropdownOpen?: Dispatch<SetStateAction<boolean>>;
  setIsOrderDropdownOpen?: Dispatch<SetStateAction<boolean>>;
  setIsMessageDropdownOpen?: Dispatch<SetStateAction<boolean>>;
  setIsNotificationDropdownOpen?: Dispatch<SetStateAction<boolean>>;
}

export interface HeaderSideBarProps {
  setShowRegisterModal?: Dispatch<SetStateAction<HeaderModalProps>>;
  setShowLoginModal?: Dispatch<SetStateAction<HeaderModalProps>>;
  setOpenSidebar?: Dispatch<SetStateAction<boolean>>;
}

export interface IHeader {
  navClass: string;
}

export interface Settings {
  id: number;
  name: string;
  url: string;
  show: boolean;
}

export interface HeaderModalProps {
  login: boolean;
  register: boolean;
  forgotPassword: boolean;
}
