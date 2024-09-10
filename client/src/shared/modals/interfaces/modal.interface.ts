import { Dispatch, MouseEventHandler, ReactNode, SetStateAction } from 'react';

export interface ModalBgProps {
  children?: ReactNode;
  onClose?: MouseEventHandler<HTMLButtonElement>;
  onToggle?: Dispatch<SetStateAction<boolean>>;
  onTogglePassword?: Dispatch<SetStateAction<boolean>>;
}

export interface ModalProps {
  header?: string;
  gigTitle?: string;
  /* singleMessage?: IMessageDocument;
  order?: IOrderDocument;
  receiver?: IBuyerDocument;
  authUser?: IAuthUser; */
  type?: string;
  approvalModalContent?: ApprovalModalContent;
  hideCancel?: boolean;
  cancelBtnHandler?: () => void;
  onClick?: () => void;
  onClose?: () => void;
}

export interface ApprovalModalContent {
  header: string;
  body: string;
  btnText: string;
  btnColor: string;
}
