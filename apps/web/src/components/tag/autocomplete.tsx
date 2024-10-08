import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { TagInputStyleClassesProps, Tag as TagType } from './tag-input';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

type AutocompleteProps = {
    tags: TagType[];
    setTags: React.Dispatch<React.SetStateAction<TagType[]>>;
    setInputValue: React.Dispatch<React.SetStateAction<string>>;
    autocompleteOptions: TagType[];
    maxTags?: number;
    onTagAdd?: (tag: string) => void;
    allowDuplicates: boolean;
    children: React.ReactNode;
    inlineTags?: boolean;
    classStyleProps: TagInputStyleClassesProps['autoComplete'];
    usePortal?: boolean;
};

export const Autocomplete: React.FC<AutocompleteProps> = ({
    tags,
    setTags,
    setInputValue,
    autocompleteOptions,
    maxTags,
    onTagAdd,
    allowDuplicates,
    inlineTags,
    children,
    classStyleProps,
    usePortal,
}) => {
    const triggerContainerRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const popoverContentRef = useRef<HTMLDivElement | null>(null);

    const [popoverWidth, setPopoverWidth] = useState<number>(0);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [inputFocused, setInputFocused] = useState(false);
    const [popooverContentTop, setPopoverContentTop] = useState<number>(0);

    // Dynamically calculate the top position for the popover content
    useEffect(() => {
        if (!triggerContainerRef.current || !triggerRef.current) return;
        setPopoverContentTop(
            triggerContainerRef.current?.getBoundingClientRect().bottom - triggerRef.current?.getBoundingClientRect().bottom,
        );
    }, [tags]);

    // Close the popover when clicking outside of it
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
            if (
                isPopoverOpen &&
                triggerContainerRef.current &&
                popoverContentRef.current &&
                !triggerContainerRef.current.contains(event.target as Node) &&
                !popoverContentRef.current.contains(event.target as Node)
            ) {
                setIsPopoverOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isPopoverOpen]);

    const handleOpenChange = useCallback(
        (open: boolean) => {
            if (open && triggerContainerRef.current) {
                const { width } = triggerContainerRef.current.getBoundingClientRect();
                setPopoverWidth(width);
            }

            if (open) {
                inputRef.current?.focus();
                setIsPopoverOpen(open);
            }
        },
        [inputFocused],
    );

    const handleInputFocus = (event: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>) => {
        // Only set inputFocused to true if the popover is already open.
        // This will prevent the popover from opening due to an input focus if it was initially closed.
        if (isPopoverOpen) {
            setInputFocused(true);
        }

        const userOnFocus = (children as React.ReactElement<any>).props.onFocus;
        if (userOnFocus) userOnFocus(event);
    };

    const handleInputBlur = (event: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>) => {
        setInputFocused(false);

        // Allow the popover to close if no other interactions keep it open
        if (!isPopoverOpen) {
            setIsPopoverOpen(false);
        }

        const userOnBlur = (children as React.ReactElement<any>).props.onBlur;
        if (userOnBlur) userOnBlur(event);
    };

    const toggleTag = (option: TagType) => {
        // Check if the tag already exists in the array
        const index = tags.findIndex((tag) => tag.text === option.text);

        if (index >= 0) {
            // Tag exists, remove it
            const newTags = tags.filter((_, i) => i !== index);
            setTags(newTags);
        } else {
            // Tag doesn't exist, add it if allowed
            if (!allowDuplicates && tags.some((tag) => tag.text === option.text)) {
                // If duplicates aren't allowed and a tag with the same text exists, do nothing
                return;
            }

            // Add the tag if it doesn't exceed max tags, if applicable
            if (!maxTags || tags.length < maxTags) {
                setTags([...tags, option]);
                setInputValue('');
                if (onTagAdd) {
                    onTagAdd(option.text);
                }
            }
        }
    };

    return (
        <div
            className={cn(
                'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
                classStyleProps?.command,
            )}
        >
            <Popover open={isPopoverOpen} onOpenChange={handleOpenChange} modal={usePortal}>
                <div
                    className="relative h-full flex items-center rounded-md border bg-transparent pr-3"
                    ref={triggerContainerRef}
                >
                    {React.cloneElement(children as React.ReactElement<any>, {
                        onFocus: handleInputFocus,
                        onBlur: handleInputBlur,
                        ref: inputRef,
                    })}
                    <PopoverTrigger asChild ref={triggerRef}>
                        <Button
                            variant="ghost"
                            size="icon"
                            role="combobox"
                            type='button'
                            className={cn(`hover:bg-transparent ${!inlineTags ? 'ml-auto' : ''}`, classStyleProps?.popoverTrigger)}
                            onClick={() => {
                                setIsPopoverOpen(!isPopoverOpen);
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={`lucide lucide-chevron-down h-4 w-4 shrink-0 opacity-50 ${isPopoverOpen ? 'rotate-180' : 'rotate-0'}`}
                            >
                                <path d="m6 9 6 6 6-6" />
                                <title>
                                </title>
                            </svg>
                        </Button>
                    </PopoverTrigger>
                </div>
                <PopoverContent
                    ref={popoverContentRef}
                    side="bottom"
                    align="end"
                    forceMount
                    className={cn("p-0 relative", classStyleProps?.popoverContent)}
                >
                    <div
                        className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', classStyleProps?.commandList)}
                        style={{
                            minHeight: '68px',
                        }}
                        key={autocompleteOptions.length}
                    >
                        {autocompleteOptions.length > 0 ? (
                            <div
                                key={autocompleteOptions.length}
                                role="group"
                                className={cn('overflow-y-auto overflow-hidden p-1 text-foreground', classStyleProps?.commandGroup)}
                                style={{
                                    minHeight: '68px',
                                }}
                            >
                                <span className="text-muted-foreground font-medium text-sm py-1.5 px-2 pb-2">Suggestions</span>
                                <div role="separator" className="py-0.5" aria-valuemax={0} aria-valuemin={0} aria-valuenow={0} />
                                {autocompleteOptions.map((option) => {
                                    return (
                                        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
<div
                                            key={option.id}
                                            // biome-ignore lint/a11y/useAriaPropsForRole: <explanation>
                                            role="option"
                                            className={cn(
                                                'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent',
                                                classStyleProps?.commandItem,
                                            )}
                                            data-value={option.text}
                                            onClick={() => toggleTag(option)}
                                        >
                                            <div className="w-full flex items-center gap-2">
                                                {option.text}
                                                {tags.some((tag) => tag.text === option.text) && (
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        className="lucide lucide-check"
                                                    >
                                                        <path d="M20 6 9 17l-5-5"/>
                                                        <title>
                                                            
                                                        </title>
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="py-6 text-center text-sm">No results found.</div>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};