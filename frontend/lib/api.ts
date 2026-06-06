import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export const api = axios.create({
   baseURL: API_BASE,
   headers: { "Content-Type": "application/json" },
});

export interface CreateAssignmentPayload {
   dueDate?: string;
   questionTypes: {
      type: string;
      numberOfQuestions: number;
      marks: number;
   }[];
   additionalInfo: string;
   files: File[];
}

export interface GeneratedQuestion {
   questionNumber: number;
   text: string;
   difficulty: "Easy" | "Moderate" | "Hard";
   marks: number;
   options?: string[];
}

export interface GeneratedSection {
   title: string;
   instruction: string;
   questions: GeneratedQuestion[];
}

export interface GeneratedPaper {
   schoolName: string;
   subject: string;
   className: string;
   timeAllowed: string;
   maximumMarks: number;
   generalInstruction: string;
   sections: GeneratedSection[];
   answerKey: { questionNumber: number; answer: string }[];
}

export interface AssignmentResponse {
   _id: string;
   dueDate?: string;
   questionTypes: {
      type: string;
      numberOfQuestions: number;
      marks: number;
   }[];
   additionalInfo: string;
   fileNames: string[];
   status: "pending" | "processing" | "completed" | "failed";
   generatedPaper?: GeneratedPaper;
   createdAt: string;
}

export async function createAssignment(data: CreateAssignmentPayload) {
   const formData = new FormData();
   if (data.dueDate) formData.append("dueDate", data.dueDate);
   formData.append("questionTypes", JSON.stringify(data.questionTypes));
   formData.append("additionalInfo", data.additionalInfo);
   for (const file of data.files) {
      formData.append("files", file);
   }

   const res = await api.post<{ id: string; status: string; message: string }>(
      "/assignments",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
   );
   return res.data;
}

export async function getAssignment(id: string) {
   const res = await api.get<AssignmentResponse>(`/assignments/${id}`);
   return res.data;
}
