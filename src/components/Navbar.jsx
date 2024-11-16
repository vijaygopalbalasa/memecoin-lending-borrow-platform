import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Moon, Sun, Menu as MenuIcon } from 'lucide-react';

export default function Navbar() {
    const [isDark, setIsDark] = useState(true);

    return (
        <nav className="bg-gray-900/50 backdrop-blur-lg border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex items-center">
                            <span className="text-2xl font-display bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                                MemeBank
                            </span>
                        </Link>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:space-x-8">
                        <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                            Dashboard
                        </Link>
                        <Link to="/deposit" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                            Deposit
                        </Link>
                        <Link to="/borrow" className="text-gray-300 hover:text-white px-3 py-2 rounded-md">
                            Borrow
                        </Link>
                        <button
                            className="ml-3 flex items-center justify-center p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
                            onClick={() => setIsDark(!isDark)}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg font-medium hover:from-primary-600 hover:to-secondary-600">
                            Connect Wallet
                        </button>
                    </div>

                    <div className="sm:hidden flex items-center">
                        <Menu as="div" className="relative inline-block text-left">
                            <Menu.Button className="p-2">
                                <MenuIcon className="h-6 w-6" />
                            </Menu.Button>
                            <Menu.Items className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/dashboard"
                                                className={`${active ? 'bg-gray-700' : ''
                                                    } block px-4 py-2 text-sm text-gray-300`}
                                            >
                                                Dashboard
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/deposit"
                                                className={`${active ? 'bg-gray-700' : ''
                                                    } block px-4 py-2 text-sm text-gray-300`}
                                            >
                                                Deposit
                                            </Link>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <Link
                                                to="/borrow"
                                                className={`${active ? 'bg-gray-700' : ''
                                                    } block px-4 py-2 text-sm text-gray-300`}
                                            >
                                                Borrow
                                            </Link>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
            </div>
        </nav>
    );
}