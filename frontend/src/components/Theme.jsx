import React from 'react';
import { useTheme } from '../context/Toggle';

const ToggleSwitch = () => {
  const { theme, toggleTheme } = useTheme();
  const isToggled = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isToggled ? 'bg-blue-600' : 'bg-gray-200'
      }`}
      aria-pressed={isToggled}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          isToggled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

export default ToggleSwitch;