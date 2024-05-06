"use client"

import { useEffect, useState } from "react";

import { SettingsModal } from "@/components/modals/settings-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);                           //so none of the modals  will be gonna be redered on serverside unless we are fully on the client side, nothing on serverside and no hydration errors 

    if (!isMounted) {
        return null;
    }

    return (       // here gonna return a list of our Modals
        <>
            <SettingsModal />
        </>
    )
}