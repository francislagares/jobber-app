import { FC, ReactElement } from 'react';

import { ModalBgProps } from '@/shared/modals/interfaces/modal.interface';

const ModalBg: FC<ModalBgProps> = ({ children }): ReactElement => {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-50 h-full w-full overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 top-0 z-10 bg-black/[.65] py-2">
        {children}
      </div>
    </div>
  );
};

export default ModalBg;
