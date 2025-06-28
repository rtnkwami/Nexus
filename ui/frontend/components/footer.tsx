'use client'

import { use, useState } from 'react';

export default function DropdownMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Menu ▼
      </button>

      {open && (
        <ul className="absolute mt-2 w-40 bg-white border rounded shadow-lg z-10">
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Profile</li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Settings</li>
          <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Logout</li>
        </ul>
      )}
    </div>
  );
}
