export type Ticket = {
    id: string;
    user: string;
    building: string;
    submittedAt: string;
    status: "urgent" | "concerning" | "warning";
    title: string;
    description: string;
   //phoneNumber: string; to contact the tenant 
   //typeOfIssue:string; this will be for in the future a dispatch system to the different people that can fix the issue
    dealtWith?: boolean;
  };
  