import { useCallback, useEffect, useState } from "react";
import { type DropzoneOptions, useDropzone, type DropEvent } from "react-dropzone";
import { Button } from "./button";
import { PlusIcon } from "lucide-react";

interface FileWithId {
    file: File;
    id: string;
}

interface DropZoneOptions extends DropzoneOptions {
    defaultValue?: FileWithId[];
    onChange?: (files: FileWithId[]) => void;
    onFileClick?: (file: FileWithId) => void;
}

export function DropZone({ defaultValue, onChange, onFileClick, ...props }: DropZoneOptions) {
    const [files, setFiles] = useState<FileWithId[]>(defaultValue ?? []);

    const hasFiles = files.length > 0;

    const _onDrop = useCallback((acceptedFiles: File[], event: DropEvent) => {
        const newFiles = acceptedFiles.map((file) => ({
            file,
            id: URL.createObjectURL(file), // Generating a unique ID using the object URL
        }));
        setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }, []);

    useEffect(() => {
        if (onChange) {
            onChange(files);
        }
    }, [files, onChange]);

    // Cleanup object URLs on unmount
    useEffect(() => {
        return () => {
            for (const { id } of files) {
                URL.revokeObjectURL(id);
            }
        };
    }, [files]);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        open,
    } = useDropzone({
        onDropAccepted: _onDrop,
        ...props
    });

    return (
        <div
            data-drag-active={isDragActive}
            data-drag-accept={isDragAccept}
            data-drag-reject={isDragReject}
            className="bg-muted border relative rounded-lg border-dashed aspect-video border-secondary-foreground/20 flex flex-col justify-center items-center"
        >
            <Button onClick={open}
                size={"xicon"}
                variant={"outline"}
                className="absolute top-1 left-1 z-10 rounded-full">
                <PlusIcon className="size-4" />
            </Button>
            <div {...getRootProps({
                onClick: event => event.stopPropagation()
            })} className="p-4 relative size-full overflow-auto">
                <input {...getInputProps()} />
                {
                    !hasFiles && <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                        <div className="text-lg text-secondary-foreground">Drop files here</div>
                    </div>
                }
                <div className="grid grid-cols-3 max-h-full gap-2">
                    {files.map(({ file, id }) => {
                        const isImage = file.type.startsWith('image/');
                        const objectURL = id;

                        return (
                            <div key={id} className="flex aspect-square flex-col items-center justify-center mb-2 relative">
                                {isImage ? (
                                    <img
                                        src={objectURL}
                                        alt={file.name}
                                        className="object-contain rounded-lg"
                                        onClick={() => onFileClick?.({ file, id })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                onFileClick?.({ file, id });
                                            }
                                        }}
                                    />
                                ) : (
                                    <div
                                        className="text-sm text-secondary-foreground"
                                        onClick={() => onFileClick?.({ file, id })}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                onFileClick?.({ file, id });
                                            }
                                        }}
                                    >
                                        {file.name}
                                    </div>
                                )}
                                <div className="text-xs text-secondary-foreground">{file.size} bytes</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
