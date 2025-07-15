import { Tenant, Manager, TradePerson, Prisma, Tickets } from "@database/generated";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TicketByLandlordDto } from '@DTO/ticket-dto/get-ticket-by-landlord.dto';
import { CreateTicketForTenantDto } from "@DTO/ticket-dto/ticket-create-for-tenants.dto"
import CreateTenantDto from "@DTO/tenant-dto/create-tenant.dto"
import { fetchAuthSession } from "@/utils/fetchAuthSession";




export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3001",
    prepareHeaders: async (headers) => {
      const idToken = await fetchAuthSession();

    if (idToken) {
      headers.set('Authorization', `Bearer ${idToken}`);
    }
    console.log(idToken)
    return headers;
  },
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    createTenant: build.mutation<Tenant, CreateTenantDto>({
      query: (body) => ({
        url: "/tenant",
        method: "POST",
        body,
      }),
    }),
    createManager: build.mutation<Manager, Prisma.ManagerCreateInput>({
      query: (body) => ({
        url: "/manager",
        method: "POST",
        body,
      }),
    }),
    createTradeperson: build.mutation<
      TradePerson,
      Prisma.TradePersonCreateInput
    >({
      query: (body) => ({
        url: "/tradeperson",
        method: "POST",
        body,
      }),
    }),
    getManagerCognitoIdByPhone: build.query<
      { cognitoId: string },
      { phoneNumber: string }
    >({
      query: (body) => ({
        url: "/manager/by-phone",
        method: "POST",
        body,
      }),
    }),

    getTicketsByManager: build.query<
      TicketByLandlordDto[],
      {managerCognitoId: string }
    >({
      query: ({ managerCognitoId }) => ({
        url: "/tickets/manager",
        method: "GET",
        params: { managerCognitoId },
      }),
    }),

    createTicket: build.mutation<TradePerson, Prisma.TradePersonCreateInput>({
      query: (body) => ({
        url: "/tickets",
        method: "POST",
        body,
      }),
    }),
    createTicketForTenant: build.mutation<Tickets,CreateTicketForTenantDto>({
    query: (body) => ({
      url: '/tickets/tenant',
      method: 'POST',
      body,
    }),
  }),

  }),
});

export const {
  useCreateTenantMutation,
  useCreateManagerMutation,
  useCreateTradepersonMutation,
  useGetTicketsByManagerQuery,
  useCreateTicketForTenantMutation
} = api;
