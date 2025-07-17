import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LocationUpdateDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;
}


export class PropertyUpdateDto {
  @IsOptional()
  @IsNumber()
  id?: number; // optional for new properties

  @IsString()
  @IsNotEmpty()
  apartmentNumber: string;

  @IsNumber()
  numberOfRooms: number;

  @IsNumber()
  numberOfBathrooms: number;

  @IsNumber()
  size: number;
}

export class UpdateBuildingDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  photosUrl: string;

  @IsString()
  @IsNotEmpty()
  typeOfBuilding: string;

  @IsNumber()
  numberOfProperty: number;

  @IsString()
  @IsNotEmpty()
  managerCognitoId: string;

  @ValidateNested()
  @Type(() => LocationUpdateDto)
  location: LocationUpdateDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyUpdateDto)
  properties?: PropertyUpdateDto[];
}
