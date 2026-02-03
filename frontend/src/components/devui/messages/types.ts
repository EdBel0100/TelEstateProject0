export type message = {
    id: string;
    author: string
    authorType:string
    writtenAt: string;
    // status: "dilevered" | "read" | "non delivered";
    description: string;
  };

export type converation = {
    id:string
    // tenant: tenant -> types to be built
    // landlord: landlord -> types to be built
    messages: message[]
}
  