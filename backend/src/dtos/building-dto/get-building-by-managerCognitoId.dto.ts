import { Prisma } from "@database/generated";

export type GetBuildingByManagerDto = Prisma.BuildingGetPayload<{
  include: {
    manager: true;
    location: true;
    properties: {
      include: {
        tenants: true; // if you want lease included
      };
    };
  };
}>;