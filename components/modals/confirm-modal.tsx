"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import React from "react";

interface confirmModalProps {
    children: React.ReactNode;
    onConfirm: () => void; 
};

export const ConfirmModal = ({ 
    children,
     onConfirm
    }: confirmModalProps) => {
        const handelConfirm = (
            e: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) => {
            e.stopPropagation();
            onConfirm();    
        };

  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={(e) => e.stopPropagation()} asChild>
          {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
         <AlertDialogHeader>
               <AlertDialogTitle>
                 Are you absolutely sure?
               </AlertDialogTitle>
               <AlertDialogDescription>
                 This action cannot be undone.
               </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
            <AlertDialogCancel onClick={e => e.stopPropagation()}>
                 Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handelConfirm}>
              Confirm
            </AlertDialogAction>
         </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};