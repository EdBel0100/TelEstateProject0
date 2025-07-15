import { IsString, IsEnum, IsDateString } from "class-validator";

export class CreateTicketForTenantDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(["urgent", "concerning", "warning"])
  status: "urgent" | "concerning" | "warning";

  @IsDateString()
  submittedAt: string;

  @IsString()
  tenantCognitoId: string;
}
