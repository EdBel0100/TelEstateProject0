import { Type } from 'class-transformer';
import { IsInt, IsString, IsOptional, IsNumber, ValidateNested, IsArray } from 'class-validator';

export class TenantDto {
  @IsInt()
  id: number;

  @IsString()
  cognitoId: string;

  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phoneNumber: string;

  @IsInt()
  propertyId: number;
}

export class PropertyDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  apartmentNumber?: string | null;

  @IsInt()
  numberOfRooms: number;

  @IsInt()
  numberOfBathrooms: number;

  @IsNumber()
  size: number;

  @IsInt()
  buildingId: number;

  @IsString()
  managerCognitoId: string;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => TenantDto)
  tenants: TenantDto[];
}

export class LocationDto {
  @IsInt()
  id: number;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  postalCode: string;
}

export class ManagerDto {
  @IsInt()
  id: number;

  @IsString()
  cognitoId: string;

  @IsString()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phoneNumber: string;
}

export class GetBuildingByManagerDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  photosUrl: string;

  @IsString()
  typeOfBuilding: string;

  @IsInt()
  numberOfProperty: number;

  @IsString()
  managerCognitoId: string;

  @ValidateNested()
  @Type(() => ManagerDto)
  manager: ManagerDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => PropertyDto)
  properties: PropertyDto[];
}
