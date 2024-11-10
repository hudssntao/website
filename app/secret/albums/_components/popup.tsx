'use client';

import { useState } from 'react';
import { setSeenPopupCookie } from '../_actions';
import { Button } from '@/components/ui/button';

type PopupProps = {
  hasSeenPopup?: boolean;
}

export default function Popup({ hasSeenPopup }: PopupProps) {
  const [isOpen, setIsOpen] = useState(hasSeenPopup);

  const closePopup = () => {
    setIsOpen(false);
    setSeenPopupCookie();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed w-screen h-screen inset-0 bg-opacity-50 z-50 flex items-center justify-center backdrop-blur">
      <div className="flex flex-col gap-3 bg-white p-8 rounded-lg max-w-lg w-full">
        <div className="text-2xl font-bold">Happy Birthday Honey! 🎉</div>
        <p><strong>You&apos;re finally legal</strong> and that is insane. You have lived 18 years of life and I am so so lucky to have been part of almost <strong>1 and a half years of that.</strong></p>

        <p>Thought you might enjoy your first day as an adult with some throwback photos from this year&apos;s adventures, with a <strong>twist...</strong></p>

        <p>Love,</p>
        <p>Hudson ❤️</p>

        <Button
          onClick={closePopup}
          className="bg-blue-950 hover:bg-blue-100 text-white hover:text-blue-950 font-bold py-2 px-4 rounded mt-5"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

