import { Prisma } from "@database/generated";
export type GetTenantManagerAndProperty = Prisma.TenantGetPayload<{
    include: {
      property: {
        include: {
          manager: true;
        };
      };
    };
  }>;