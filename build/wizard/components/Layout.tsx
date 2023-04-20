import React, { FunctionComponent, ReactNode } from "react";
import NavBar from "./NavBar";
import Header from "./Header";

interface Props {
    children: ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <>
            <div className="py-10 bg-white">
                <Header />
                {/* <NavBar /> */}

                <main className="bg-white">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="lg:flex lg:items-center lg:justify-between">
                            <div className="min-w-0 flex-1">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="bg-white">
                    <div className="mx-auto max-w-7xl overflow-hidden px-6 py-20 sm:py-24 lg:px-8">
                        <p className="mt-10 text-center text-xs leading-5 text-gray-500">
                            <a href="https://ava.do" target="_blank" rel="noopener noreferrer">
                                &copy; Made with ❤️ by your frens at Avado
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
};
export default Layout;