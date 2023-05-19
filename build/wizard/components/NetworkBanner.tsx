import React from "react";
import { useNetwork } from "../hooks/useServerInfo";

const NetworkBanner = () => {
    const { network } = useNetwork()

    return (
        <>
            {(network === "prater") && (
                <div className="flex items-center gap-x-3 px-6 sm:px-3.5 sm:before:flex-1">
                    <p className="text-sm leading-6 text-black">
                        ⚠️  Stader Testnet v2 ⚠️
                    </p>
                    <p className="text-sm leading-6 text-black">
                        
                    </p>
                </div>
            )}
        </>
    );
};

export default NetworkBanner


