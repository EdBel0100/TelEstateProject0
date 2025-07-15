import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator"

export default class CreateTenantDto {
  @IsString()
  @IsNotEmpty()
  cognitoId: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  apartmentNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;
}
