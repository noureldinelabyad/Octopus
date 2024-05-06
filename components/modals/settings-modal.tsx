"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader
} from "@/components/ui/dialog"
import { useSettings } from  "@/hooks/use-settings";
import { Label } from "@/components/ui/label";
import { ModeToggle }  from "@/components/mode-toggle";

export const SettingsModal =() => {
    const settings = useSettings();

    return (
        <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <h3 className="tex-lg font-medium">
                        My settings
                    </h3>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1 ">
                        <Label>
                            Appareance
                        </Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            Costomize how Octopus looks on your device
                        </span>
                    </div>
                    <ModeToggle />
                </div>
            </DialogContent>
        </Dialog>
    );
};