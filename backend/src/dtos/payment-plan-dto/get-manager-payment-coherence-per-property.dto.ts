import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// --- Building DTO ---
export class BuildingDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  locationId: number;

  @IsString()
  managerCognitoId: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// --- Property DTO ---
export class PropertyDto {
  @IsInt()
  id: number;

  @IsString()
  managerCognitoId: string;

  @IsInt()
  buildingId: number;

  @IsOptional()
  @IsString()
  unitNumber?: string;
}

// --- Property with Building DTO ---
export class PropertyWithBuildingDto extends PropertyDto {
  @ValidateNested()
  @Type(() => BuildingDto)
  building: BuildingDto;
}

// --- PaymentPlanCoherence DTO ---
export class PaymentPlanCoherenceDto {
  @IsInt()
  propertyId: number;

  @IsBoolean()
  isRentAddingUp: boolean;

  @IsOptional()
  @IsNumber()
  expected?: number;

  @IsOptional()
  @IsNumber()
  actual?: number;

  @ValidateNested()
  @Type(() => PropertyWithBuildingDto)
  property: PropertyWithBuildingDto;
}
