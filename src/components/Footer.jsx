import { Link } from 'react-router-dom';
import { Twitter, Github, MessageSquare } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-900/50 backdrop-blur-lg border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-display bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text mb-4">
                            MemeBank
                        </h3>
                        <p className="text-gray-400 text-sm">
                            The first meme token lending protocol built for the community.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Protocol</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/dashboard" className="text-gray-400 hover:text-white">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/deposit" className="text-gray-400 hover:text-white">
                                    Deposit
                                </Link>
                            </li>
                            <li>
                                <Link to="/borrow" className="text-gray-400 hover:text-white">
                                    Borrow
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Resources</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Whitepaper
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    Security
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Community</h4>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                            >
                                <MessageSquare className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        © 2024 MemeBank. All rights reserved.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-gray-400 hover:text-white text-sm">
                            Terms of Service
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white text-sm">
                            Privacy Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}