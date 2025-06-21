"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/_components/ui/tabs";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { api } from "@/trpc/react";
import { Button } from "@/app/_components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { SortableItem } from "@/app/_components/ui/Sortableitems";
import { useState } from "react";

const FormFieldTabs = () => {
  const [activeType, setActiveType] = useState("BOPP");

  const { data: formFields, refetch } = api.formField.getAll.useQuery();
  const updateOptions = api.formField.updateOptions.useMutation();
  const addOption = api.formField.addOption.useMutation();
  const deleteOption = api.formField.deleteOption.useMutation();

  const sensors = useSensors(useSensor(PointerSensor));

  const handleAddOption = async (name: string) => {
    const newOption = prompt("Enter new option:");
    if (!newOption) return;

    try {
      await addOption.mutateAsync({ name, option: newOption });
      toast.success("Option added!");
      refetch();
    } catch {
      toast.error("Failed to add option.");
    }
  };

  const handleDeleteOption = async (name: string, index: number) => {
    if (!confirm("Are you sure you want to delete this option?")) return;

    try {
      await deleteOption.mutateAsync({ name, index });
      toast.success("Option deleted!");
      refetch();
    } catch {
      toast.error("Failed to delete option.");
    }
  };

  const handleDragEnd = async (
    event: any,
    fieldName: string,
    currentOptions: string[]
  ) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = currentOptions.indexOf(active.id);
    const newIndex = currentOptions.indexOf(over.id);
    const reordered = arrayMove(currentOptions, oldIndex, newIndex);

    try {
      await updateOptions.mutateAsync({ name: fieldName, options: reordered });
      toast.success("Option order updated!");
      refetch();
    } catch {
      toast.error("Failed to update order.");
    }
  };

  // 🔍 Filter based on prefix
  const filteredFields = formFields?.filter((field) =>
    field.name.startsWith(activeType)
  );

  return (
    <div className="w-full max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
      <Tabs defaultValue="BOPP" onValueChange={(val) => setActiveType(val)}>
        <TabsList className="mb-4">
          <TabsTrigger value="BOPP">BOPP Fields</TabsTrigger>
          <TabsTrigger value="PET">PET Fields</TabsTrigger>
        </TabsList>

        <TabsContent value={activeType}>
          <Card className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-800 dark:text-gray-200 text-xl">
                {activeType} Form Option Management
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Add, delete, and reorder form field options.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6">
              {filteredFields?.map((field) => (
                <div
                  key={field.name}
                  className="border rounded-lg p-3 sm:p-4 space-y-4 bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <h3 className="font-medium text-gray-700 dark:text-gray-100 text-sm sm:text-base break-words">
                      {field.name}
                    </h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddOption(field.name)}
                      className="text-xs sm:text-sm"
                    >
                      + Add Option
                    </Button>
                  </div>

                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={(e) =>
                      handleDragEnd(e, field.name, field.options)
                    }
                  >
                    <SortableContext items={field.options}>
                      <div className="grid gap-2">
                        {field.options.map((option, index) => (
                          <SortableItem key={option} id={option}>
                            <div className="flex items-center justify-between border rounded px-3 py-2 bg-white dark:bg-gray-700 text-sm">
                              <span className="text-gray-700 dark:text-gray-100 break-words max-w-[85%]">
                                {option}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  handleDeleteOption(field.name, index)
                                }
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </SortableItem>
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FormFieldTabs;
