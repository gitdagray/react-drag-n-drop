import { XIcon } from 'lucide-react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button } from './ui/button'

import type { Item } from "./List"

type Props = {
    item: Item,
    removeItem: (id: number) => void,
    forceDragging?: boolean,
}

export function SortableRow({ item, removeItem, forceDragging = false }: Props) {

    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition
    } = useSortable({
        id: item.sequence,
    })

    const parentStyles = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined,
        opacity: isDragging ? "0.4" : "1",
        lineHeight: "4",
    }

    const draggableStyles = {
        cursor: isDragging || forceDragging ? "grabbing" : "grab",
    }

    return (
        <article
            className="flex flex-col w-full gap-2 [&:not(:first-child)]:pt-2" ref={setNodeRef}
            style={parentStyles}
        >
            <div className="bg-secondary w-full rounded-md flex items-center gap-2 overflow-hidden">

                <div className="bg-ring w-12 h-full flex items-center">
                    <p className="w-full text-center text-secondary">{item.sequence}</p>
                </div>

                <div
                    ref={setActivatorNodeRef}
                    className="flex-grow p-2"
                    style={draggableStyles}
                    {...attributes} {...listeners}
                >
                    <h2 className="text-lg">
                        {item.title}
                    </h2>
                    <p className="text-sm">{item.artist}</p>
                </div>

                <div className="w-12 h-full flex items-center">
                    <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        onClick={() => removeItem(item.id)}
                    >
                        <XIcon className="text-red-500" />
                    </Button>
                </div>

            </div>

        </article>
    )
}