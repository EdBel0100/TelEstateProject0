import {
    IsNotEmpty,
    IsNumber,
    IsOptional,
    ValidateNested,
    IsArray,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  import { IsString } from 'class-validator';
  
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
  
  export class PropertyDto {
    @IsString()
    apartmentNumber: string;
  
    @IsNumber()
    numberOfRooms: number;
  
    @IsNumber()
    numberOfBathrooms: number;
  
    @IsNumber()
    size: number;

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
    location: LocationDto
  
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PropertyDto)
    properties?: PropertyDto[];

  }
  