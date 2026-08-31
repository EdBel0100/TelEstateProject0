import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsArray,
  IsDateString,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
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

export class LeaseDto {
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
  

export class PropertyDto {
  @IsString()
  apartmentNumber: string;

  @IsNumber()
  numberOfRooms: number;

  @IsNumber()
  numberOfBathrooms: number;

  @IsNumber()
  size: number;

  @ValidateNested()
  @Type(() => LeaseDto)
  lease: LeaseDto; 
}

export class CreateBuildingDto {
  @IsString()
  name: string;

  @IsString()
  photosUrl: string;

  @IsString()
  typeOfBuilding: string;

  @IsNumber()
  numberOfProperty: number;

  @IsString()
  managerCognitoId: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropertyDto)
  properties?: PropertyDto[];
}
