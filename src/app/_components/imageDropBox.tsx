"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Trash2, Move } from "lucide-react";
import { toast } from "react-toastify";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type ImageDropBoxProps = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function ImageDropBox({ images, setImages }: ImageDropBoxProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const sizeMB = file.size / (1024 * 1024);
        if (sizeMB > 10) {
          toast.error(`❌ ${file.name} is too large (max 10MB)`);
          return;
        }
        toast.success(`✅ Added: ${file.name}`);
        setImages((prev) => [...prev, file]);
      });
    },
    [setImages]
  );

  const removeImage = (fileToRemove: File) => {
    setImages((prev) => prev.filter((f) => f !== fileToRemove));
    toast.success(`🗑️ Removed: ${fileToRemove.name}`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = images.findIndex((img) => img.name === active.id);
      const newIndex = images.findIndex((img) => img.name === over.id);
      setImages((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <div>
      {/* Upload Box */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition ${
          isDragActive
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 dark:border-gray-700"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 dark:text-gray-300">
          Drag & drop images here, or click to select
        </p>
        <p className="text-sm text-gray-400 mt-1">
          (Max size: 10MB per image)
        </p>
      </div>

      {/* Preview List */}
      {images.length > 0 && (
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={images.map((file) => file.name)}
            strategy={rectSortingStrategy}
          >
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((file) => (
                <SortableImageCard
                  key={file.name}
                  file={file}
                  onRemove={removeImage}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

function SortableImageCard({
  file,
  onRemove,
}: {
  file: File;
  onRemove: (file: File) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: file.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group border border-dashed border-purple-400 rounded-md p-2"
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 bg-white dark:bg-black/70 p-1 rounded-full shadow cursor-move"
        title="Drag to reorder"
      >
        <Move className="h-4 w-4 text-gray-500" />
      </div>

      {/* 16:9 Box */}
      <div className="w-full aspect-[3/4] bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden relative">
        <Image
          src={URL.createObjectURL(file)}
          alt={`preview-${file.name}`}
          fill
          className="object-contain"
        />
      </div>

      {/* Delete Button */}
      <button
        className="absolute top-2 right-2 z-10 bg-white dark:bg-black/70 p-1 rounded-full shadow"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onRemove(file);
        }}
        title="Remove image"
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </button>

      {/* Image Size */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1">
        {(file.size / (1024 * 1024)).toFixed(2)} MB
      </p>
    </div>
  );
}
