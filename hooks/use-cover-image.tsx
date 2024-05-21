import { create } from "zustand";

type CoverImageStore = {
    url?: string;
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onReplace: (url: string) => void;
};

export const useCoverImage = create<CoverImageStore>((set) =>({
    url: undefined,   // explicity write the url as undifeind
    isOpen: false,
    onOpen: () => set({ isOpen:true, url: undefined }),
    onClose: () => set({ isOpen: false, url: undefined }),
    onDelete: (url: string) => set({ isOpen: false, url }),
    onReplace:(url: string)=> set({ isOpen: true, url })
}));

