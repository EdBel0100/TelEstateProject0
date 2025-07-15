import { Prisma } from "@database/generated";

export type TicketByLandlordDto = Prisma.TicketsGetPayload<{
  include: {
    property: {
      include: {
        manager: true;
        building:{
          include:{
            location:true
          }
        }
      };
    };
  };
}>;
