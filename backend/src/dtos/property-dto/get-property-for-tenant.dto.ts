import { Prisma } from "@database/generated";


export type GetPropertyForTenant = Prisma.PropertyGetPayload<{
  include: {
    tenants: true;
    building: {
      include: {
        location: true;
      };
    };
  };
}>;