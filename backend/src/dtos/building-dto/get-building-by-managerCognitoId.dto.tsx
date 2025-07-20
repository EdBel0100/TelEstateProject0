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
    numberOfRooms: number;
    numberOfBathrooms: number;
    size: number;
    tenants: Array<{
      cognitoId: string;
      email: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
    }>;
  }>;
};
