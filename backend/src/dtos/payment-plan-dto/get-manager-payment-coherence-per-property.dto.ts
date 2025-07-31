// coherence-result.dto.ts
import { Property } from "@database/generated";


export type PaymentPlanCoherenceDto = {
  propertyId: number;
  isRentAddingUp: boolean;
  expected?: number;
  actual?: number;
  property: Property;
};