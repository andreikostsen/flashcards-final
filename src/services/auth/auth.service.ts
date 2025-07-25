import { AuthMeResponseType, LoginArgs, UpdateUser } from "@/services/auth/auth.types";
import { baseApi } from '@/services/base-api'
import { SignUpRequest, SignUpResponse } from "@/services/flashcards.types";

export const authService = baseApi.injectEndpoints({
  endpoints: builder => ({
    authMe: builder.query<AuthMeResponseType, void>({
      providesTags: ['Auth'],
      query: body => ({
        body,
        url: 'v1/auth/me',
      }),
    }),
    updateUser: builder.mutation<AuthMeResponseType, UpdateUser>({
      invalidatesTags: ['Auth'],
      query: arg => {
        const formData = new FormData()

        if (arg.avatar) {
          formData.append('avatar', arg.avatar)
        }
        if (arg.name) {
          formData.append('name', arg.name)
        }

       return {
          body: formData,
         method: 'PATCH',
         url: `v1/auth/me`,
       }
      }
    }),
    login: builder.mutation<void, LoginArgs>({
      invalidatesTags: ['Auth'],
      query: body => ({
        body,
        method: 'POST',
        url: 'v1/auth/login',
      }),
    }),
    logout: builder.mutation<void, void>({
      invalidatesTags: ['Auth'],
      query: () => ({
        method: 'POST',
        url: 'v1/auth/logout',
      }),
    }),
    signup: builder.mutation<SignUpResponse, SignUpRequest>({
      query: body => ({
        body,
        method: 'POST',
        url: 'v1/auth/sign-up',
      }),
    }),
  }),
})

export const {
  useAuthMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useSignupMutation,
  useUpdateUserMutation,
} = authService
