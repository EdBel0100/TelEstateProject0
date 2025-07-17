import { IsString, IsEnum, IsDateString, IsNumber } from "class-validator";

export class CreateTicketForTenantDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(["urgent", "concerning", "warning"])
  status: "urgent" | "concerning" | "warning";

  @IsDateString()
  submittedAt: string;

  @IsNumber()
  propertyId:number

  @IsString()
  tenantCognitoId: string;
}
