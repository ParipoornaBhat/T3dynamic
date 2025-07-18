"use client";

import { useCallback, useMemo } from "react";
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
import type { BOPPItemForm } from "@/types/bopp";

type ImageDropBoxProps = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  existingImageUrls?: string[];
  setExistingImageUrls?: React.Dispatch<React.SetStateAction<string[]>>;
  disabled?: boolean;
  boppItem: BOPPItemForm;
  setBoppItem: React.Dispatch<React.SetStateAction<BOPPItemForm>>;
};

export default function ImageDropBox({
  images,
  setImages,
  existingImageUrls = [],
  setExistingImageUrls = () => {},
  disabled = false,
  boppItem,
  setBoppItem,
}: ImageDropBoxProps) {
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

  const removeUrlImage = (urlToRemove: string) => {
    const updated = existingImageUrls.filter((url) => url !== urlToRemove);
    setExistingImageUrls(updated);
    setBoppItem((prev) => ({
      ...prev,
      itemImagesUrls: updated,
    }));
    toast.success(`🗑️ Removed existing image`);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const allItems = useMemo(
    () => [
      ...existingImageUrls.map((url) => `img::url::${url}`),
      ...images.map((file) => `img::file::${file.name}`),
    ],
    [existingImageUrls, images]
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const activeId = String(event.active.id);
    const overId = String(event.over?.id);

    if (!overId || activeId === overId) return;

    const oldIndex = allItems.findIndex((id) => id === activeId);
    const newIndex = allItems.findIndex((id) => id === overId);

    if (oldIndex === -1 || newIndex === -1) return;

    const updatedItems = arrayMove(allItems, oldIndex, newIndex);

    const newExistingUrls: string[] = [];
    const newFiles: File[] = [];

    for (const id of updatedItems) {
      if (id.startsWith("img::url::")) {
        newExistingUrls.push(id.replace("img::url::", ""));
      } else if (id.startsWith("img::file::")) {
        const fileName = id.replace("img::file::", "");
        const file = images.find((f) => f.name === fileName);
        if (file) newFiles.push(file);
      }
    }

    setExistingImageUrls(newExistingUrls);
    setImages(newFiles);
    setBoppItem((prev) => ({
      ...prev,
      itemImagesUrls: newExistingUrls,
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    disabled,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition ${
          isDragActive
            ? "border-purple-500 bg-purple-50"
            : "border-gray-300 dark:border-gray-700"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 dark:text-gray-300">
          Drag & drop images here, or click to select
        </p>
        <p className="text-sm text-gray-400 mt-1">
          (Max size: 10MB per image)
        </p>
      </div>

      {(existingImageUrls.length > 0 || images.length > 0) && (
        <DndContext
          collisionDetection={closestCenter}
          sensors={sensors}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={allItems} strategy={rectSortingStrategy}>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {existingImageUrls.map((url) => (
                <SortableImageCard
                  key={`img::url::${url}`}
                  id={`img::url::${url}`}
                  src={url}
                  onRemove={() => removeUrlImage(url)}
                  disabled={disabled}
                  isFile={false}
                />
              ))}
              {images.map((file) => (
                <SortableImageCard
                  key={`img::file::${file.name}`}
                  id={`img::file::${file.name}`}
                  src={URL.createObjectURL(file)}
                  onRemove={() => removeImage(file)}
                  disabled={disabled}
                  isFile={true}
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
  id,
  src,
  onRemove,
  disabled,
  isFile,
}: {
  id: string;
  src: string;
  onRemove: () => void;
  disabled?: boolean;
  isFile: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

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
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 z-10 bg-white dark:bg-black/70 p-1 rounded-full shadow cursor-move"
          title="Drag to reorder"
        >
          <Move className="h-4 w-4 text-gray-500" />
        </div>
      )}

      <div className="w-full aspect-[3/4] bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden relative">
        <Image src={src} alt={`preview-${id}`} fill className="object-contain" />
      </div>

      {!disabled && (
        <p className="text-xs mt-1 text-center text-gray-500 dark:text-gray-400 truncate max-w-full px-1">
          {isFile ? id.replace("img::file::", "") : id.split("/").pop()?.replace(/\.[^/.]+$/, "")}
        </p>
      )}

      {!disabled && (
        <button
          className="absolute top-2 right-2 z-10 bg-white dark:bg-black/70 p-1 rounded-full shadow"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onRemove();
          }}
          title="Remove image"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </button>
      )}
    </div>
  );
}
