import { FC, lazy, LazyExoticComponent, Suspense } from 'react';

import { IHeader } from '@/shared/header/interfaces/header.interface';

import Categories from './Categories';
import HowItWorks from './HowItWorks';

const WelcomeHeader: LazyExoticComponent<FC<IHeader>> = lazy(
  () => import('@/shared/header/components/Header'),
);
const Hero: LazyExoticComponent<FC> = lazy(
  () => import('@/features/welcome/Hero'),
);
const GigTabs: LazyExoticComponent<FC> = lazy(
  () => import('@/features/welcome/gig-tabs/GigTabs'),
);

const Welcome: FC = () => {
  return (
    <div className="flex flex-col">
      <Suspense>
        <WelcomeHeader navClass="navbar peer-checked:navbar-active fixed z-20 w-full border-b border-gray-100 bg-white/90 shadow-2xl shadow-gray-600/5 backdrop-blur dark:border-gray-800 dark:bg-gray-900/80 dark:shadow-none" />
        <Hero />
        <GigTabs />
        <HowItWorks />
        <Categories />
      </Suspense>
    </div>
  );
};

export default Welcome;
