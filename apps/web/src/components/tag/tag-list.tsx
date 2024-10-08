import type React from 'react';
import type { TagInputStyleClassesProps, Tag as TagType } from './tag-input';
import { Tag, type TagProps } from './tag';
import { cn } from '@/lib/utils';

export type TagListProps = {
    tags: TagType[];
    customTagRenderer?: (tag: TagType, isActiveTag: boolean) => React.ReactNode;
    direction?: TagProps['direction'];
    onSortEnd: (oldIndex: number, newIndex: number) => void;
    className?: string;
    inlineTags?: boolean;
    activeTagIndex?: number | null;
    setActiveTagIndex?: (index: number | null) => void;
    classStyleProps: {
        tagListClasses: TagInputStyleClassesProps['tagList'];
        tagClasses: TagInputStyleClassesProps['tag'];
    };
    disabled?: boolean;
} & Omit<TagProps, 'tagObj'>;

export const TagList: React.FC<TagListProps> = ({
    tags,
    customTagRenderer,
    direction,
    draggable,
    onSortEnd,
    className,
    inlineTags,
    activeTagIndex,
    setActiveTagIndex,
    classStyleProps,
    disabled,
    ...tagListProps
}) => {

    return (
        <>
            {!inlineTags ? (
                <div
                    className={cn(
                        'rounded-md w-full',
                        {
                            'flex flex-wrap gap-2': direction === 'row',
                            'flex flex-col gap-2': direction === 'column',
                        },
                        classStyleProps?.tagListClasses?.container,
                    )}
                >
                    {
                        tags.map((tagObj, index) =>
                            customTagRenderer ? (
                                customTagRenderer(tagObj, index === activeTagIndex)
                            ) : (
                                <Tag
                                    key={tagObj.id}
                                    tagObj={tagObj}
                                    isActiveTag={index === activeTagIndex}
                                    direction={direction}
                                    draggable={draggable}
                                    tagClasses={classStyleProps?.tagClasses}
                                    {...tagListProps}
                                    disabled={disabled}
                                />
                            ),
                        )
                    }
                </div>
            ) : (
                <>
                    {tags.map((tagObj, index) =>
                        customTagRenderer ? (
                            customTagRenderer(tagObj, index === activeTagIndex)
                        ) : (
                            <Tag
                                key={tagObj.id}
                                tagObj={tagObj}
                                isActiveTag={index === activeTagIndex}
                                direction={direction}
                                draggable={draggable}
                                tagClasses={classStyleProps?.tagClasses}
                                {...tagListProps}
                                disabled={disabled}
                            />
                        ),
                    )}
                </>
            )}
        </>
    );
};