import { atom, useAtom } from 'jotai'

type DialogType = {
    id: string;
    title: string;
    content: string;
    isOpen: boolean;
    onClose: () => void;
    onOpen: () => void;
}

const dialogAtom = atom<DialogType[]>([]);

function dialog(){}

function useDialoger() { }