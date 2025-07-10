import {
  CreateCard,
  CreateCardResponse,
  CreateDeck,
  GetDeckCardsQuery,
  GetDeckCardsResponse,
  GetDecksQuery,
  GetDecksResponse,
  GetDecksResponseItems,
  retrieveRandomCardQuery,
  retrieveRandomCardResponse,
  updateCard,
  updateCardResponse,
  updateDeckQuery,
  updateDeckResponse,
} from '@/services/flashcards.types'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.flashcards.andrii.es',
    credentials: 'include',
    // prepareHeaders: headers => {
    //   headers.append('x-auth-skip', 'true')
    // },
  }),
  endpoints: builder => {
    return {
      createCard: builder.mutation<CreateCardResponse, CreateCard>({
        invalidatesTags: ['Cards'],
        query: arg => {
          const formData = new FormData()

          formData.append('question', arg.question)
          formData.append('answer', arg.answer)
          if (arg.questionImg) {
            formData.append('questionImg', arg.questionImg)
          }
          if (arg.answerImg) {
            formData.append('answerImg', arg.answerImg)
          }

          // formData.append('questionVideo', arg.questionVideo)
          // formData.append('answerVideo', arg.answerVideo)

          return {
            body: formData,
            method: 'POST',
            url: `v1/decks/${arg.id}/cards`,
          }
        },
      }),
      createDeck: builder.mutation<void, CreateDeck>({
        invalidatesTags: ['Decks'],
        query: arg => {
          const formData = new FormData()

          if (arg.cover) {
            formData.append('cover', arg.cover)
          }
          formData.append('name', arg.name)
          formData.append('isPrivate', String(arg.isPrivate))

          return {
            body: formData,
            method: 'POST',
            url: 'v1/decks',
          }
        },
      }),
      deleteCard: builder.mutation<void, string>({
        invalidatesTags: ['Cards'],
        query: id => {
          return {
            method: 'DELETE',
            url: `v1/cards/${id}/`,
          }
        },
      }),
      deleteDeck: builder.mutation<void, string>({
        invalidatesTags: ['Decks'],
        query: id => ({
          method: 'DELETE',
          url: `v1/decks/${id}`,
        }),
      }),
      getDeckById: builder.query<Omit<GetDecksResponseItems, 'author'>, string | undefined>({
        providesTags: ['Cards'],
        query: deckId => {
          return {
            url: `v1/decks/${deckId}`,
          }
        },
      }),
      getDeckCards: builder.query<GetDeckCardsResponse, GetDeckCardsQuery>({
        providesTags: ['Cards'],
        query: getDeckCardsQuery => {
          return {
            params: {
              answer: getDeckCardsQuery.answer,
              currentPage: getDeckCardsQuery?.currentPage,
              itemsPerPage: getDeckCardsQuery?.itemsPerPage,
              orderBy: getDeckCardsQuery?.orderBy,
              question: getDeckCardsQuery?.question,
            },
            url: `v1/decks/${getDeckCardsQuery.id}/cards`,
          }
        },
      }),
      getDecks: builder.query<GetDecksResponse, GetDecksQuery | void>({
        providesTags: ['Decks'],
        query: getDecksQuery => {
          return {
            params: {
              authorId: getDecksQuery?.authorId,
              currentPage: getDecksQuery?.currentPage,
              itemsPerPage: getDecksQuery?.itemsPerPage,
              maxCardsCount: getDecksQuery?.maxCardsCount,
              minCardsCount: getDecksQuery?.minCardsCount,
              name: getDecksQuery?.name,
            },
            url: 'v1/decks',
          }
        },
      }),
      retrieveRandomCard: builder.query<retrieveRandomCardResponse, retrieveRandomCardQuery>({
        query: retrieveRandomCardQuery => {
          return {
            params: { previousCardId: retrieveRandomCardQuery?.previousCardId },
            url: `v1/decks/${retrieveRandomCardQuery.deckId}/learn`,
          }
        },
      }),
      updateCard: builder.mutation<updateCardResponse, updateCard>({
        invalidatesTags: ['Cards'],
        query: args => {
          const formData = new FormData()

          if (args.answer) {
            formData.append('answer', args.answer)
          }
          args.answerImg
            ? formData.append('answerImg', args.answerImg)
            : formData.append('answerImg', (args.answerImg = ''))
          if (args.answerVideo) {
            formData.append('answerVideo', args.answerVideo)
          }
          if (args.question) {
            formData.append('question', args.question)
          }
          args.questionImg
            ? formData.append('questionImg', args.questionImg)
            : formData.append('questionImg', (args.questionImg = ''))
          if (args.questionVideo) {
            formData.append('questionVideo', args.questionVideo)
          }

          return {
            body: formData,
            // body: {
            //   answer: args.answer,
            //   answerImg: args.answerImg,
            //   answerVideo: args.answerVideo,
            //   question: args.question,
            //   questionImg: args.questionImg,
            //   questionVideo: args.questionVideo,
            // },
            method: 'PATCH',
            url: `v1/cards/${args.id}`,
          }
        },
      }),
      updateDeck: builder.mutation<updateDeckResponse, updateDeckQuery>({
        invalidatesTags: ['Decks', 'Cards'],
        query: args => {
          const formData = new FormData()

          if (args.cover) {
            formData.append('cover', args.cover)
          } else if (args.cover === '') {
            formData.append('cover', (args.cover = ''))
          }

          formData.append('name', args.name)
          formData.append('isPrivate', String(args.isPrivate))

          return {
            body: formData,
            method: 'PATCH',
            url: `v1/decks/${args.id}`,
          }
        },
      }),
    }
  },
  reducerPath: 'baseApi',
  tagTypes: ['Decks', 'Auth', 'Cards'],
})
export const {
  useCreateCardMutation,
  useCreateDeckMutation,
  useDeleteCardMutation,
  useDeleteDeckMutation,
  useGetDeckByIdQuery,
  useGetDeckCardsQuery,
  useGetDecksQuery,
  useRetrieveRandomCardQuery,
  useUpdateCardMutation,
  useUpdateDeckMutation,
} = baseApi
