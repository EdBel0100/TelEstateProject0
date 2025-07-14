import { Tenant, Landlord, TradePerson, Prisma } from "@database/generated"


import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl:"http://localhost:3001",
      prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set("Authorization", `Bearer ${idToken}`);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [],
  endpoints: (build) => ({
    createTenant: build.mutation<Tenant, Prisma.TenantCreateInput>({
      query: (body) => ({
        url: '/tenant',
        method: 'POST',
        body,
      }),
    }),
    createLandlord: build.mutation<Landlord, Prisma.LandlordCreateInput>({
      query: (body) => ({
        url: '/landlord',
        method: 'POST',
        body,
      }),
    }),
    createTradeperson: build.mutation<TradePerson, Prisma.TradePersonCreateInput>({
      query: (body) => ({
        url: '/tradeperson',
        method: 'POST',
        body,
      }),
    }),
    getLandlordCognitoIdByPhone: build.query<{ cognitoId: string }, { phoneNumber: string }>({
      query: (body) => ({
        url: "/landlord/by-phone",
        method: "POST",
        body,
      }),
    }),
})
});

export const { 
  useCreateTenantMutation,
  useCreateLandlordMutation,
  useCreateTradepersonMutation,
  useGetLandlordCognitoIdByPhoneQuery } = api;
