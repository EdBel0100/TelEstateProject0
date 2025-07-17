import { Tenant, Manager, TradePerson, Prisma, Tickets } from "@database/generated";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TicketByLandlordDto } from '@DTO/ticket-dto/get-ticket-by-landlord.dto';
import {CreateTicketForTenantDto} from "@DTO/ticket-dto/create-ticket-for-tenants.dto"
import CreateTenantDto from "@DTO/tenant-dto/create-tenant.dto"
import { fetchAuthSession } from "@/utils/fetchAuthSession";
import { BuildingGetManyDto } from "@DTO/building-dto/get-building-by-managerCognitoId.dto"
import { CreateBuildingDto } from "@DTO/building-dto/create-building.dto"
import { Building } from "@database/generated";
import { UpdateBuildingDto } from "@DTO/building-dto/update-building.dto"
import { boolean } from "zod";




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
  deleteTicket: build.mutation<void, { id: number }>({
    query: ({ id }) => ({
      url: `/tickets/manager/${id}`,
      method: "DELETE",
    }),
  }),

  getBuildingsByManager: build.query<BuildingGetManyDto[],{ managerCognitoId:string }>({
    query: ({managerCognitoId}) => ({
      url:"/building/manager",
      method: "GET",
      params:{ managerCognitoId },
    }),
  }),
createBuildingForManager: build.mutation<Building, CreateBuildingDto>({
  query: (body) => {
  console.log('API call - createBuildingForManager payload:', body);
  return {
    url: "/building/manager",
    method: "POST",
    body,
  }},
}),
updateBuilding: build.mutation<Building, UpdateBuildingDto>({
  query: (body) => {
    console.log('API call - updatingbuilding payload:', body);
    return {
    url: `/building/manager/${body.id}`,
    method: "PATCH",
    body,
  }},
}),
deleteBuilding: build.mutation<{ success: boolean; id: number }, { id: number }>({
  query: ({ id }) => ({
    url: `/building/manager/${id}`,
    method: "DELETE",
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
} = api;
