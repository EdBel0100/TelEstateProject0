import {
  Tenant,
  Manager,
  TradePerson,
  Prisma,
  Tickets,
  Conversation,
  Messages,
  Property,
  Building,
  PaymentPlan
} from "@database/generated";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession } from "@/utils/fetchAuthSession";

// DTOs
import { GetTicketByLandlordDto } from "@DTO/ticket-dto/get-ticket-by-landlord.dto";
import { CreateTicketForTenantDto } from "@DTO/ticket-dto/create-ticket-for-tenants.dto";
import CreateTenantDto from "@DTO/tenant-dto/create-tenant.dto";
import { GetBuildingByManagerDto } from "@DTO/building-dto/get-building-by-managerCognitoId.dto";
import { CreateBuildingDto } from "@DTO/building-dto/create-building.dto";
import { UpdateBuildingDto } from "@DTO/building-dto/update-building.dto";
import { GetConversationByTenantDto } from "@DTO/conversation-dto/get-conversation-by-tenant.dto";
import { GetConversationByManagerDto } from "@DTO/conversation-dto/get-conversations-by-manager.dto";
import { GetTenantManagerAndProperty } from '@DTO/tenant-dto/get-tenant-manager-and-property.dto';
import { PaymentPlanCoherenceDto } from "@DTO/payment-plan-dto/get-manager-payment-coherence-per-property.dto"
import { GetPropertyForTenant } from "@DTO/property-dto/get-property-for-tenant.dto";
import { lookupConversationBytenantInputDto, lookupConversationBytenantOutputDto } from "@DTO/conversation-dto/lookup-converstion-by-tenant.dto";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
    prepareHeaders: async (headers) => {
      const idToken = await fetchAuthSession();
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    // --------- BUILDING ---------
    getBuildingsByManager: build.query<GetBuildingByManagerDto[], { managerCognitoId: string }>({
      query: ({ managerCognitoId }) => ({
        url: "/building/manager",
        method: "GET",
        params: { managerCognitoId },
      }),
    }),
    createBuildingForManager: build.mutation<Building, CreateBuildingDto>({
      query: (body) => ({
        url: "/building/manager",
        method: "POST",
        body,
      }),
    }),
    updateBuilding: build.mutation<Building, UpdateBuildingDto>({
      query: (body) => ({
        url: `/building/manager/${body.id}`,
        method: "PATCH",
        body,
      }),
    }),
    deleteBuilding: build.mutation<{ success: boolean; id: number }, { id: number }>({
      query: ({ id }) => ({
        url: `/building/manager/${id}`,
        method: "DELETE",
      }),
    }),

    // --------- CONVERSATION ---------
    getConversationByManager: build.query<GetConversationByManagerDto[], { managerCognitoId: string }>({
      query: ({ managerCognitoId }) => ({
        url: "/conversations/manager",
        method: "GET",
        params: { managerCognitoId },
      }),
    }),

    getConversationByTenantName: build.query<lookupConversationBytenantOutputDto[], lookupConversationBytenantInputDto>({
      query: ({ tenantFirstName, tenantLastName }) => ({
        url: "/conversations/manager/lookup",
        method: "GET",
        params: { input: JSON.stringify({ tenantFirstName, tenantLastName }) }
      }),
    }),

    getConversationByTenant: build.query<GetConversationByTenantDto[], { tenantCognitoId: string }>({
      query: ({ tenantCognitoId }) => ({
        url: "/conversations/tenant",
        method: "GET",
        params: { tenantCognitoId },
      }),
    }),
    createConversationForManagers: build.mutation<Conversation, Prisma.ConversationCreateInput>({
      query: (body) => ({
        url: "/conversations",
        method: "POST",
        body,
      }),
    }),
    createConversationForTenantSignup: build.mutation<Conversation, Prisma.ConversationUncheckedCreateInput>({
      query: (body) => ({
        url: "/conversations/tenant/signup",
        method: "POST",
        body,
      }),
    }),
    deleteConversation: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `conversations/manager/${id}`,
        method: "DELETE",
      }),
    }),

    // --------- LOCATION ---------
    // (Add location-related endpoints here if needed)

    // --------- MANAGER ---------
    createManager: build.mutation<Manager, Prisma.ManagerCreateInput>({
      query: (body) => ({
        url: "/manager",
        method: "POST",
        body,
      }),
    }),
    getManagerCognitoIdByPhone: build.query<{ cognitoId: string }, { phoneNumber: string }>({
      query: (body) => ({
        url: "/manager/by-phone",
        method: "POST",
        body,
      }),
    }),

    // --------- PROPERTY ---------
    getPropertyForTenant: build.query<GetPropertyForTenant, void>({
      query: () => ({
        url: `/property/tenant`,
        method: "GET",
      }),
    }),

    // --------- TENANT ---------
    createTenant: build.mutation<Tenant, CreateTenantDto>({
      query: (body) => ({
        url: "/tenant",
        method: "POST",
        body,
      }),
    }),
    getAllTenantByManager: build.query<Tenant[], { managerCognitoId: string }>({
      query: ({ managerCognitoId }) => ({
        url: "/tenant/manager",
        method: "GET",
        params: { managerCognitoId },
      }),
    }),
    getTenantManager: build.query<GetTenantManagerAndProperty, { tenantCognitoId: string }>({
      query: ({ tenantCognitoId }) => ({
        url: `tenant/tenant/manager`,
        method: "GET",
        params: { tenantCognitoId },
      }),
    }),

    // --------- TICKETS ---------
    getTicketsByManager: build.query<GetTicketByLandlordDto[], { managerCognitoId: string }>({
      query: ({ managerCognitoId }) => ({
        url: "/tickets/manager",
        method: "GET",
        params: { managerCognitoId },
      }),
    }),
    createTicketForTenant: build.mutation<Tickets, CreateTicketForTenantDto>({
      query: (body) => ({
        url: "/tickets/tenant",
        method: "POST",
        body,
      }),
    }),
    deleteTicket: build.mutation<void, { id: number }>({
      query: ({ id }) => ({
        url: `/tickets/manager/${id}`,
        method: "DELETE",
      }),
    }),
    createTicket: build.mutation<TradePerson, Prisma.TradePersonCreateInput>({
      query: (body) => ({
        url: "/tickets",
        method: "POST",
        body,
      }),
    }),

    // --------- TRADEPERSON ---------
    createTradeperson: build.mutation<TradePerson, Prisma.TradePersonCreateInput>({
      query: (body) => ({
        url: "/tradeperson",
        method: "POST",
        body,
      }),
    }),

    // --------- MESSAGES ---------
    createMessage: build.mutation<Messages, Prisma.MessagesUncheckedCreateInput>({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        body,
      }),
    }),

    // --------- PAYMENTPLANS ---------
    createTenantPaymentPlan: build.mutation<void, { setPrice: number }>({
      query: ({ setPrice }) => ({
        url: "/paymentplans/tenant",
        method: "POST",
        body: { setPrice },
      }),
    }),

    getTenantPaymentPlan: build.query<PaymentPlan, void>({
      query: () => ({
        url: "/paymentplans/tenant",
        method: "GET",
      }),
    }),

    // [PATCH] /paymentplan/tenant
    updateTenantPaymentPlan: build.mutation<void, { setPrice: number }>({
      query: ({ setPrice }) => ({
        url: "/paymentplans/tenant",
        method: "PATCH",
        body: { setPrice },
      }),
    }),

    // [GET] /paymentplan/manager/coherence
    getManagerPaymentPlanCoherence: build.query<PaymentPlanCoherenceDto[], void>({
      query: () => ({
        url: "/paymentplans/manager/coherence",
        method: "GET",
      }),
    }),



  }),
});

export const {
  useCreateTenantMutation,
  useCreateManagerMutation,
  useCreateTradepersonMutation,
  useGetTicketsByManagerQuery,
  useCreateTicketForTenantMutation,
  useDeleteTicketMutation,
  useGetManagerCognitoIdByPhoneQuery,
  useGetBuildingsByManagerQuery,
  useCreateBuildingForManagerMutation,
  useUpdateBuildingMutation,
  useDeleteBuildingMutation,
  useGetConversationByManagerQuery,
  useGetAllTenantByManagerQuery,
  useCreateConversationForManagersMutation,
  useCreateMessageMutation,
  useGetConversationByTenantQuery,
  useDeleteConversationMutation,
  useGetPropertyForTenantQuery,
  useCreateConversationForTenantSignupMutation,
  useLazyGetTenantManagerQuery,
  useCreateTenantPaymentPlanMutation,
  useUpdateTenantPaymentPlanMutation,
  useGetManagerPaymentPlanCoherenceQuery,
  useGetTenantPaymentPlanQuery,
  useGetConversationByTenantNameQuery
} = api;
