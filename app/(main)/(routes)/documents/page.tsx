"use client"

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const DocumentsPage = () => {
    const {user} = useUser();
    const create = useMutation(api.documents.create);   // calling the create function from documents.ts
    const router = useRouter();

    const onCreate = () => {   // handelr to fire a toast on creting new doc and maybe rediricte 
        const promise = create ({ title: "Untitled" })     // as tittle is requored in the db  we set it to untitled as defualte 
        .then((documentId) => {
            router.push(`/documents/${documentId}`);
        });

        toast.promise(promise, {        // showing msgs  with toasts onCreate new doc
            loading: "Creatign a new note...",
            success: "New note Created!",
            error: "Failed to create a new note."
        });
    };

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image
            src="/note-light.png"
            height="300"
            width="300"
            alt="note"
            className="dark:hidden"
            />
            <Image
            src="/note-dark.png"
            height="300"
            width="300"
            alt="note"
            className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">
                Welcome to {user?.firstName}&apos;s Octopus
            </h2>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2"/>
                Create a note
            </Button>
        </div>
    );
}
export default DocumentsPage;