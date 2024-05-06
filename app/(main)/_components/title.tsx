"use client"

import { useRef, useState } from "react";
import { useMutation } from "convex/react";

import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TitleProps {
    initialData: Doc<"documents">;
};

export const Title = ({
    initialData,
}: TitleProps) => {
    const inputref = useRef<HTMLInputElement>(null);
    const update = useMutation(api.documents.update);

    const [title, setTitle] = useState(initialData.title || "Untitled");
    const [isEditing, setIsEditing] = useState(false);

    const enableInput = () => {
        setTitle(initialData.title);  // incase in has chnaged  since first render
        setIsEditing(true);
        setTimeout(() => {
            inputref.current?.focus();
            inputref.current?.setSelectionRange(0, inputref.current.value.length)
        }, 0);
    };

    const disableInput = () => {
        setIsEditing(false);
    };

    const onChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setTitle(event.target.value);
        update({
            id: initialData._id,
            title: event.target.value || "Untitled",    // so if the user deletes it it  goes back to Untitled not allawing the user to leave the doc with no title
        });
    };

    const onKeyDown = (       // save when the user press enter using the disableinput function 
        event: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (event.key === "Enter") {
            disableInput();
        }
    };

    return (
        <div className="flex items-center gap-x-1">
         {!!initialData.icon && <p>{initialData.icon}</p>}
         {isEditing ? (
            <Input
             ref={inputref}
             onClick={enableInput}
             onBlur={disableInput}
             onChange={onChange}
             onKeyDown={onKeyDown}
             value={title}
             className="h-7 px-2 focus-visible:ring-transparent"
            />
         ) : (
            <Button
             onClick={enableInput}
             variant= "ghost"
             size="sm"
             className="font-normal h-auto p-1"
            >
                <span className="truncate">
                 {initialData?.title}
                </span>
            </Button>
         )}
        </div>
    )
}

Title.Skeleton = function  TitleSkeleton() {
    return (
        <Skeleton className="h-9 w-20 rounded-md" />
    );
};