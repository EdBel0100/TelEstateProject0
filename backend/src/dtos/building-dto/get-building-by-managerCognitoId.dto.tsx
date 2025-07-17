export type BuildingGetManyDto = {
  id: number;
  name: string;
  photosUrl: string;
  typeOfBuilding: string;
  numberOfProperty: number;
  manager: {
    cognitoId: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  location: {
    id: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  properties: Array<{
    id: number;
    apartmentNumber?: string | null;
    tenants: Array<{
      firstName: string;
      lastName: string;
    }>;
  }>;
};
