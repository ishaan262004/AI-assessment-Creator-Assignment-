export interface Assignment {
   id: string;
   title: string;
   assignedOn: string;
   dueDate?: string;
}

export const assignments: Assignment[] = [
   {
      id: "1",
      title: "Quiz on Electricity",
      assignedOn: "20-06-2025",
      dueDate: undefined,
   },
   {
      id: "2",
      title: "Quiz on Electricity",
      assignedOn: "20-06-2025",
      dueDate: "21-06-2025",
   },
   {
      id: "3",
      title: "Quiz on Electricity",
      assignedOn: "20-06-2025",
      dueDate: undefined,
   },
   {
      id: "4",
      title: "Quiz on Electricity",
      assignedOn: "20-06-2025",
      dueDate: "21-06-2025",
   },
   {
      id: "5",
      title: "Quiz on Electricity",
      assignedOn: "20-06-2025",
      dueDate: "21-06-2025",
   },
   {
      id: "6",
      title: "Quiz on Electricity",
      assignedOn: "20-06-2025",
      dueDate: undefined,
   },
   {
      id: "7",
      title: "Quiz on Electricity",
      assignedOn: "20-06-2025",
      dueDate: "21-06-2025",
   },
   {
      id: "8",
      title: "Quiz on Electricity",
      assignedOn: "20-06-2025",
      dueDate: undefined,
   },
   {
      id: "9",
      title: "Quiz on Magnetism",
      assignedOn: "22-06-2025",
      dueDate: "25-06-2025",
   },
   {
      id: "10",
      title: "Quiz on Thermodynamics",
      assignedOn: "23-06-2025",
      dueDate: undefined,
   },
];

export const currentUser = {
   name: "John Doe",
   avatar: "/assets/profile/avatar.jpeg",
};

export const schoolInfo = {
   name: "Delhi Public School",
   location: "Bokaro Steel City",
   logo: "/assets/school/dps.png",
};
