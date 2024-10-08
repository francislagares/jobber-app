import { FC, lazy, LazyExoticComponent, ReactElement, useState } from 'react';

import { Link } from 'react-router-dom';

import LoginModal from '@/features/auth/components/Login';

import {
  HeaderModalProps,
  IHeader,
} from '@/shared/header/interfaces/header.interface';
import { ButtonProps } from '@/shared/shared.interface';

const Button: LazyExoticComponent<FC<ButtonProps>> = lazy(
  () => import('@/shared/button/Button'),
);

const Header: FC<IHeader> = ({ navClass }): ReactElement => {
  const [showModal, setShowModal] = useState<HeaderModalProps>({
    login: false,
    register: false,
    forgotPassword: false,
  });

  return (
    <>
      {showModal.login && (
        <LoginModal
          onClose={() =>
            setShowModal((item: HeaderModalProps) => ({
              ...item,
              login: false,
            }))
          }
          onToggle={() =>
            setShowModal((item: HeaderModalProps) => ({
              ...item,
              login: false,
              register: true,
            }))
          }
          onTogglePassword={() =>
            setShowModal((item: HeaderModalProps) => ({
              ...item,
              login: false,
              forgotPassword: true,
            }))
          }
        />
      )}
      <header>
        <nav className={navClass}>
          <div className="m-auto px-6 xl:container md:px-12 lg:px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 md:gap-0 md:py-3 lg:py-5">
              <div className="flex w-full items-center justify-between lg:w-auto">
                <Link
                  to="/"
                  className="relative z-10 cursor-pointer text-3xl font-semibold text-white"
                >
                  Jobber
                </Link>
                <div className="peer-checked:hamburger relative z-20 -mr-6 block cursor-pointer p-6 lg:hidden">
                  <Button
                    className="m-auto h-0.5 w-5 rounded transition duration-300"
                    label="label"
                  />
                </div>
              </div>
              <div className="navmenu mb-16 hidden w-full cursor-pointer flex-wrap items-center justify-end space-y-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl shadow-gray-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-7/12 lg:space-y-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none dark:border-gray-700 dark:bg-gray-800 dark:shadow-none">
                <div className="text-gray-600 lg:pr-4 dark:text-gray-300">
                  <ul className="space-y-6 text-base font-medium tracking-wide lg:flex lg:space-y-0 lg:text-sm">
                    <li>
                      <div className="hover:text-primary dark:hover:text-primaryLight block transition md:px-4">
                        <span>Become a Seller</span>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="border-primary/10 -ml-1 flex w-full flex-col space-y-2 sm:flex-row md:w-max lg:space-y-0 lg:border-l dark:border-gray-700">
                  <div
                    onClick={() =>
                      setShowModal((prop: HeaderModalProps) => ({
                        ...prop,
                        login: true,
                      }))
                    }
                    className="relative ml-auto flex h-9 items-center justify-center before:absolute before:inset-0 before:rounded-full before:transition before:duration-300 hover:before:scale-105 focus:before:bg-sky-600/10 active:duration-75 active:before:scale-95 sm:px-6 dark:focus:before:bg-sky-400/10"
                  >
                    <span className="relative text-sm font-semibold text-gray-600 dark:text-gray-300">
                      Sign In
                    </span>
                  </div>
                  <div
                    onClick={() =>
                      setShowModal((prop: HeaderModalProps) => ({
                        ...prop,
                        register: true,
                      }))
                    }
                    className="relative ml-auto flex h-9 items-center justify-center rounded-full bg-sky-500 font-bold text-white hover:bg-sky-400 sm:px-6"
                  >
                    <span className="relative text-sm font-semibold text-white">
                      Sign Up
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
