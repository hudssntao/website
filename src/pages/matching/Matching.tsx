import { cn } from "@/lib/utils";
import { DndContext, DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Medicine {
  medicine: string;
  prototype: string;
  class: string;
}

interface DroppedMedicine extends Medicine {
  id: string;
}

interface ClassStructure {
  class: string;
  prototypes: {
    [prototype: string]: DroppedMedicine[];
  };
  noPrototype: DroppedMedicine[]; // For medicines without prototypes or same as medicine
}

function MedicineCard({
  medicine,
  isDragging = false,
  isIncorrect = false,
}: { medicine: Medicine; isDragging?: boolean; isIncorrect?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isBeingDragged,
  } = useDraggable({
    id: medicine.medicine,
    data: medicine,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "bg-card border-2 border-border rounded-lg p-3 cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg text-card-foreground select-none touch-none",
        isDragging && "opacity-50 rotate-3 scale-105",
        isBeingDragged && "opacity-0", // Hide the original when being dragged
        isIncorrect && "animate-bounce border-red-500 bg-red-50",
        !isDragging && !isBeingDragged && "transition-all duration-200"
      )}
    >
      <div className="font-semibold text-sm pointer-events-none">{medicine.medicine}</div>
    </div>
  );
}

function DropZone({
  classStructure,
  prototype,
  medicines,
}: {
  classStructure: ClassStructure;
  prototype?: string;
  medicines: DroppedMedicine[];
}) {
  const dropId = prototype
    ? `${classStructure.class}-${prototype}`
    : `${classStructure.class}-noprototype`;
  const { isOver, setNodeRef } = useDroppable({
    id: dropId,
    data: { class: classStructure.class, prototype },
  });

  console.log(medicines);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[60px] border-2 border-dashed border-border rounded-lg p-2 transition-colors",
        isOver && "border-primary bg-primary/10"
      )}
    >
      {prototype && <div className="text-sm font-bold text-muted-foreground mb-2">{prototype}</div>}
      <div className="flex flex-col gap-2">
        {medicines.map((med) => (
          <div
            key={med.id}
            className="bg-primary/20 border border-primary/30 rounded p-2 text-sm text-muted-foreground"
          >
            {med.medicine}
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassTree({
  classStructure,
  availableMedicines,
}: {
  classStructure: ClassStructure;
  availableMedicines: Medicine[];
}) {
  const prototypes = Object.keys(classStructure.prototypes);
  const hasNoPrototypeMeds = classStructure.noPrototype.length > 0;

  // Check if there are any available medicines that belong to this class and have no prototype
  // (empty prototype or prototype same as medicine name)
  const hasAvailableNoPrototypeMeds = availableMedicines.some(
    (med) =>
      med.class === classStructure.class && (!med.prototype || med.prototype === med.medicine)
  );

  const showNoPrototypeZone =
    prototypes.length === 0 || hasNoPrototypeMeds || hasAvailableNoPrototypeMeds;

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <h3 className="text-lg font-bold text-card-foreground mb-3">{classStructure.class}</h3>

      <div className="ml-4 space-y-3">
        {/* Prototype zones */}
        {prototypes.map((prototype) => (
          <DropZone
            key={prototype}
            classStructure={classStructure}
            prototype={prototype}
            medicines={classStructure.prototypes[prototype]}
          />
        ))}

        {/* No prototype zone */}
        {showNoPrototypeZone && (
          <DropZone classStructure={classStructure} medicines={classStructure.noPrototype} />
        )}
      </div>
    </div>
  );
}

function checkMedicineAlreadyExists(
  classStructures: { [className: string]: ClassStructure },
  medicine: Medicine,
  dropData: { class: string; prototype?: string }
): boolean {
  const targetClass = classStructures[dropData.class];

  if (dropData.prototype) {
    const existingMedicines = targetClass.prototypes[dropData.prototype] || [];
    return existingMedicines.some((med) => med.medicine === medicine.medicine);
  }

  return targetClass.noPrototype.some((med) => med.medicine === medicine.medicine);
}

export default function Matching() {
  const navigate = useNavigate();
  const [availableMedicines, setAvailableMedicines] = useState<Medicine[]>([]);
  const [classStructures, setClassStructures] = useState<{ [className: string]: ClassStructure }>(
    {}
  );
  const [activeId, setActiveId] = useState<string | null>(null);
  const [incorrectDrop, setIncorrectDrop] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  // Function to shuffle an array
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Load CSV data
    fetch("/psych-meds.csv")
      .then((response) => response.text())
      .then((csvText) => {
        const lines = csvText.trim().split("\n");

        const parsedMedicines: Medicine[] = lines
          .slice(1)
          .map((line) => {
            const values = line.split(",");
            return {
              medicine: values[0]?.trim() || "",
              prototype: values[1]?.trim() || "",
              class: values[2]?.trim() || "",
            };
          })
          .filter((med) => med.medicine && med.class); // Filter out empty entries

        console.log("Parsed medicines:", parsedMedicines.slice(0, 5)); // Debug log
        console.log("Total medicines loaded:", parsedMedicines.length); // Debug log

        // Shuffle the medicines before setting them
        const shuffledMedicines = shuffleArray(parsedMedicines);
        setAvailableMedicines(shuffledMedicines);

        // Initialize class structures
        const structures: { [className: string]: ClassStructure } = {};

        for (const med of parsedMedicines) {
          if (!structures[med.class]) {
            structures[med.class] = {
              class: med.class,
              prototypes: {},
              noPrototype: [],
            };
          }

          // If prototype exists and is different from medicine name, create prototype category
          if (med.prototype && med.prototype !== med.medicine) {
            if (!structures[med.class].prototypes[med.prototype]) {
              structures[med.class].prototypes[med.prototype] = [];
            }
          }
        }

        setClassStructures(structures);
      })
      .catch((error) => console.error("Error loading CSV:", error));
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const medicine = active.data.current as Medicine;
    const dropData = over.data.current as { class: string; prototype?: string };

    if (!medicine || !dropData) return;

    // Validation logic
    const isCorrectClass = medicine.class === dropData.class;
    const isCorrectPrototype =
      (!dropData.prototype && (!medicine.prototype || medicine.prototype === medicine.medicine)) ||
      (dropData.prototype && medicine.prototype === dropData.prototype);

    const isCorrectDrop = isCorrectClass && isCorrectPrototype;

    if (!isCorrectDrop) {
      // Show bounce animation for incorrect drop
      setIncorrectDrop(medicine.medicine);
      setTimeout(() => {
        setIncorrectDrop(null);
      }, 1000);
      return; // Don't move the medicine if it's incorrect
    }

    // Check if medicine already exists in target location to prevent duplicates
    if (checkMedicineAlreadyExists(classStructures, medicine, dropData)) {
      return; // Don't add if it already exists
    }

    // Remove from available medicines
    setAvailableMedicines((prev) => prev.filter((med) => med.medicine !== medicine.medicine));

    // Add to appropriate drop zone
    setClassStructures((prev) => {
      // Double-check for duplicates within the setter
      if (checkMedicineAlreadyExists(prev, medicine, dropData)) {
        return prev; // Return unchanged state if duplicate found
      }

      const newStructures = { ...prev };
      const targetClass = newStructures[dropData.class];

      const droppedMedicine: DroppedMedicine = {
        ...medicine,
        id: `${medicine.medicine}-${medicine.prototype}-${medicine.class}`,
      };

      if (dropData.prototype) {
        const existingMedicines = targetClass.prototypes[dropData.prototype] || [];
        targetClass.prototypes[dropData.prototype] = [...existingMedicines, droppedMedicine];
      } else {
        targetClass.noPrototype = [...targetClass.noPrototype, droppedMedicine];
      }

      return newStructures;
    });
  };

  const activeMedicine = activeId
    ? availableMedicines.find((med) => med.medicine === activeId)
    : null;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Navigation Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        <div className="flex-1 p-6 pb-0">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
              Psychiatric Medications Matching
            </h1>

            {/* Class trees */}
            <div className="mb-8">
              {Object.values(classStructures).map((classStructure) => (
                <ClassTree
                  key={classStructure.class}
                  classStructure={classStructure}
                  availableMedicines={availableMedicines}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sticky footer with medicine cards */}
        <div className="sticky bottom-0 bg-background border-t-2 pt-6 px-6 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-foreground">
              Medicine Cards ({availableMedicines.length})
            </h2>
            {availableMedicines.length === 0 && (
              <div className="text-muted-foreground text-center py-4">Loading medicines...</div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-48 overflow-y-auto">
              {availableMedicines.map((medicine) => (
                <MedicineCard
                  key={`${medicine.medicine}-${medicine.prototype}-${medicine.class}`}
                  medicine={medicine}
                  isIncorrect={incorrectDrop === medicine.medicine}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <DragOverlay
        style={{
          cursor: "grabbing",
        }}
        dropAnimation={null}
      >
        {activeMedicine && <MedicineCard medicine={activeMedicine} isDragging />}
      </DragOverlay>
    </DndContext>
  );
}
