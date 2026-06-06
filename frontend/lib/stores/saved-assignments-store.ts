import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { GeneratedPaper } from "@/lib/api";

export interface SavedAssignment {
   id: string;
   title: string;
   assignedOn: string;
   dueDate?: string;
   generatedPaper?: GeneratedPaper;
}

const defaultAssignments: SavedAssignment[] = [
   {
      id: "mock-1",
      title: "Quiz on Electricity",
      assignedOn: "20-06-2025",
      dueDate: "27-06-2025",
   },
   {
      id: "mock-2",
      title: "Quiz on Magnetism",
      assignedOn: "20-06-2025",
      dueDate: undefined,
   },
   {
      id: "mock-3",
      title: "Quiz on Thermodynamics",
      assignedOn: "22-06-2025",
      dueDate: "30-06-2025",
   },
   {
      id: "mock-4",
      title: "Quiz on Optics",
      assignedOn: "23-06-2025",
      dueDate: undefined,
   },
   {
      id: "mock-5",
      title: "Quiz on Kinematics",
      assignedOn: "24-06-2025",
      dueDate: "01-07-2025",
   },
   {
      id: "mock-6",
      title: "Quiz on Organic Chemistry",
      assignedOn: "25-06-2025",
      dueDate: undefined,
   },
];

interface SavedAssignmentsState {
   assignments: SavedAssignment[];
   addAssignment: (assignment: SavedAssignment) => void;
   removeAssignment: (id: string) => void;
   getAssignment: (id: string) => SavedAssignment | undefined;
}

export const useSavedAssignmentsStore = create<SavedAssignmentsState>()(
   persist(
      (set, get) => ({
         assignments: defaultAssignments,

         addAssignment: (assignment) =>
            set((state) => {
               const exists = state.assignments.some(
                  (a) => a.id === assignment.id,
               );
               if (exists) return state;
               return {
                  assignments: [assignment, ...state.assignments],
               };
            }),

         removeAssignment: (id) =>
            set((state) => ({
               assignments: state.assignments.filter((a) => a.id !== id),
            })),

         getAssignment: (id) => get().assignments.find((a) => a.id === id),
      }),
      {
         name: "veda-saved-assignments",
      },
   ),
);
