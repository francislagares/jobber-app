/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, ReactElement } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { categories } from '@/shared/utils/static-data';

const Categories: FC = (): ReactElement => {
  return (
    <section className="container mx-auto bg-white">
      <div className="mx-auto px-4 py-8 text-center lg:px-6 lg:py-10">
        <div className="mx-auto mb-2 lg:mb-16">
          <h2 className="mb-4 text-left text-xl font-normal tracking-tight text-sky-400 sm:text-center lg:text-2xl">
            Explore <strong className="font-extrabold">Freelance</strong>{' '}
            Categories
          </h2>
        </div>
        <div className="hidden gap-8 sm:grid sm:grid-cols-3 md:grid-cols-4">
          {categories.map((category: any) => (
            <div key={uuidv4()} className="w-full cursor-pointer py-5">
              <img
                className="mx-auto mb-4 hidden sm:flex sm:h-8 sm:w-8 md:h-12 md:w-12"
                src={category.icon}
                alt={category.name}
              />
              <h3 className="mb-1 text-base hover:text-sky-400">
                <a className="w-full">{category.name}</a>
              </h3>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-x-2 gap-y-4 py-1 sm:hidden">
          {categories.map((category: any) => (
            <div
              key={uuidv4()}
              className="w-auto cursor-pointer rounded-3xl border border-black p-2 text-black hover:bg-[#f7f9fa]"
            >
              <h3 className="mb-1 text-xs font-bold">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
