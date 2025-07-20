import { Tenant, Manager, TradePerson, Prisma, Tickets, Conversation, Messages } from "@database/generated";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TicketByLandlordDto } from '@DTO/ticket-dto/get-ticket-by-landlord.dto';
import {CreateTicketForTenantDto} from "@DTO/ticket-dto/create-ticket-for-tenants.dto"
import CreateTenantDto from "@DTO/tenant-dto/create-tenant.dto"
import { fetchAuthSession } from "@/utils/fetchAuthSession";
import { BuildingGetManyDto } from "@DTO/building-dto/get-building-by-managerCognitoId.dto"
import { CreateBuildingDto } from "@DTO/building-dto/create-building.dto"
import { Building } from "@database/generated";
import { UpdateBuildingDto } from "@DTO/building-dto/update-building.dto"
import { ConversationGetManyDto } from "@DTO/conversation-dto/get-conversations-by-manager.dto"
import { ConversationGetByTenantDto } from "@DTO/conversation-dto/get-conversation-by-tenant.dto"





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
  return {
    url: "/building/manager",
    method: "POST",
    body,
  }},
}),
updateBuilding: build.mutation<Building, UpdateBuildingDto>({
  query: (body) => {
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
getConversationByManager: build.query<ConversationGetManyDto[], {managerCognitoId:string}>({
  query: ({ managerCognitoId }) => ({
    url: "/conversations/manager",
    method: "GET",
    params: {managerCognitoId},
  }),
}),

getAllTenantByManager: build.query<Tenant[], { managerCognitoId: string }>({
    query: ({ managerCognitoId }) => ({
    url:"/tenant/manager",
    method: "GET",
    params: { managerCognitoId },
  }),
}),
createConversationForManagers: build.mutation<Conversation, Prisma.ConversationCreateInput>({
  query:(body) => {
    return {
      url:"/conversations",
      method: "POST",
      body,
    }},
}),
createMessage: build.mutation<Messages, Prisma.MessagesUncheckedCreateInput>({
  query:(body) => {
    return {
      url:"/messages",
      method:"POST",
      body,
    }},
}),
getConversationByTenant: build.query<ConversationGetByTenantDto, {tenantCognitoId:string}>({
  query: ({tenantCognitoId}) => ({
    url:"/conversations/tenant",
    method:"GET",
    params:{tenantCognitoId}
  }),
}),
deleteConversation: build.mutation<void, {id:number}>({
  query: ({id}) => ({
    url: `conversations/manager/${id}`,
    method:"DELETE"
  })
})



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
} = api;
