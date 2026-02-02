"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import { 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  QueueListIcon
} from "@heroicons/react/24/outline";

export default function UserMenu() {
  const user = {
    name: "Archive_User",
    image: null, 
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex items-center gap-2 group focus:outline-none">
          <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 p-[2px] transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <div className="w-full h-full rounded-full bg-[#0d061a] flex items-center justify-center overflow-hidden">
              {user.image ? (
                <img src={user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserCircleIcon className="w-7 h-7 text-zinc-500 group-hover:text-white transition-colors" />
              )}
            </div>
          </div>
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-4 w-64 origin-top-right bg-[#1a1625]/80 backdrop-blur-xl border border-white/10 rounded-[1.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] focus:outline-none overflow-hidden z-50">
          <div className="px-6 py-5 border-b border-white/5 bg-white/5">
            <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-1">
              Collector Profile
            </p>
            <p className="text-sm font-bold text-white truncate">{user.name}</p>
          </div>

          <div className="p-2">
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/account"
                  className={`${
                    active ? "bg-white/10 text-white" : "text-zinc-400"
                  } group flex w-full items-center rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300`}
                >
                  <UserCircleIcon className={`mr-3 h-5 w-5 transition-colors ${active ? "text-purple-500" : "text-zinc-500"}`} />
                  Account
                </Link>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/watchlist"
                  className={`${
                    active ? "bg-white/10 text-white" : "text-zinc-400"
                  } group flex w-full items-center rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300`}
                >
                  <QueueListIcon className={`mr-3 h-5 w-5 transition-colors ${active ? "text-indigo-500" : "text-zinc-500"}`} />
                  My Watchlist
                </Link>
              )}
            </Menu.Item>
          </div>

          <div className="p-2 border-t border-white/5 bg-black/40">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-red-500/10 text-red-400" : "text-zinc-500"
                  } group flex w-full items-center rounded-xl px-4 py-3 text-sm font-bold transition-all duration-300`}
                >
                  <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                  Sign Out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}