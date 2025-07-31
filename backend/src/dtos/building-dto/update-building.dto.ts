import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
  IsDateString
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

export class LeaseUpdateDto {
    @IsDateString()
    startDate: string;
  
    @IsDateString()
    endDate: string;
  
    @IsNumber()
    deposit: number;
  
    @IsString()
    typeOfLease: string;
  
    @IsNumber()
    monthlyPrice: number;
  
    @IsNumber()
    rentDueDateEachMonth: number;
  
    @IsNumber()
    propertyId: number;
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

  @IsOptional()
  @ValidateNested()
  @Type(() => LeaseUpdateDto)
  lease?: LeaseUpdateDto;
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
