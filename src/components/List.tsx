"use client"

import dynamic from 'next/dynamic'
import { useState } from 'react'

import {
    closestCenter, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, TouchSensor, useSensor,
    useSensors
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { SortableRow } from './SortableRow'

const DndContextWithNoSSR = dynamic(
    () => import('@dnd-kit/core').then((mod) => mod.DndContext),
    { ssr: false }
)

export type Item = {
    id: number,
    artist: string,
    title: string,
    sequence: number
}

type Props = {
    data: Item[]
}

export function List({ data }: Props) {
    const [items, setItems] = useState(data)
    const [activeItem, setActiveItem] = useState<Item | undefined>(undefined)

    // for input methods detection
    const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor))

    const removeItem = (id: number) => {
        const updated = items.filter(item => item.id !== id).map((item, i) => ({ ...item, sequence: i + 1 }))

        setItems(updated)
    }

    // triggered when dragging starts
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        setActiveItem(items?.find(item => item.sequence === active.id))
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (!over) return

        const activeItem = items.find(ex => ex.sequence === active.id)
        const overItem = items.find(ex => ex.sequence === over.id)

        if (!activeItem || !overItem) {
            return
        }

        const activeIndex = items.findIndex(ex => ex.sequence === active.id)
        const overIndex = items.findIndex(ex => ex.sequence === over.id)

        if (activeIndex !== overIndex) {
            setItems(prev => {
                const updated = arrayMove(prev, activeIndex, overIndex).map((ex, i) => ({ ...ex, sequence: i + 1 }))

                return updated
            })
        }
        setActiveItem(undefined)
    }

    const handleDragCancel = () => {
        setActiveItem(undefined)
    }

    return (
        <div className="flex flex-col gap-2 w-1/2 mx-auto">
            {items?.length ? (
                <DndContextWithNoSSR
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <SortableContext
                        items={items.map(item => item.sequence)}
                        strategy={verticalListSortingStrategy}
                    >
                        {items.map(item => (
                            <SortableRow
                                key={item.id}
                                item={item}
                                removeItem={removeItem}
                            />
                        ))}
                    </SortableContext>

                    <DragOverlay adjustScale style={{ transformOrigin: "0 0 " }}>
                        {activeItem ? (
                            <SortableRow
                                item={activeItem}
                                removeItem={removeItem}
                                forceDragging={true}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContextWithNoSSR>
            ) : null}
        </div>
    )
}