export type GetDecksResponse = {
  items: GetDecksResponseItems[]
  maxCardsCount: number
  pagination: GetDecksResponsePagination
}
export type GetDecksResponseItemsAuthor = {
  id: string
  name: string
}
export type GetDecksResponseItems = {
  author: GetDecksResponseItemsAuthor
  cardsCount: number
  cover: string | undefined
  created: string
  id: string
  isFavorite: boolean
  isPrivate: boolean
  name: string
  updated: string
  userId: string
}
export type GetDecksResponsePagination = {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}
export type GetDecksQuery = {
  authorId?: string
  currentPage?: number
  favoritedBy?: string
  itemsPerPage?: number
  maxCardsCount?: number
  minCardsCount?: number
  name?: string
  orderBy?: string
}
export type CreateDeck = {
  cover?: File | null
  isPrivate?: boolean
  name: string
}
export type SignUpRequest = {
  email: string
  html?: string
  name?: string
  password: string
  sendConfirmationEmail: boolean
  subject: string
}

export type SignUpResponse = {
  avatar: string
  created: string
  email: string
  id: string
  isEmailVerified: true
  name: string
  updated: string
}

export type GetDeckCardsQuery = {
  answer?: string
  currentPage?: number
  id: string | undefined
  itemsPerPage?: number
  orderBy?: null | string
  question?: string
}
export type GetDeckCardsResponse = {
  items: GetDeckCardsItems[]
  pagination: GetDecksResponsePagination
}

export type GetDeckCardsItems = {
  answer: string
  answerImg: string
  answerVideo: string
  created: string
  deckId: string
  grade: number
  id: string
  question: string
  questionImg: string
  questionVideo: string
  shots: number
  updated: string
  userId: string
}

export type CreateCard = {
  answer: string
  answerImg?: string
  answerVideo?: string
  id: string
  question: string
  questionImg?: string
  questionVideo?: string
}

export type CreateCardResponse = {
  answer: string
  answerImg: string
  answerVideo: string
  created: string
  deckId: string
  id: string
  question: string
  questionImg: string
  questionVideo: string
  shots: number
  updated: string
  userId: string
}

export type retrieveRandomCardQuery = {
  deckId: string | undefined
  previousCardId?: string
}

export type retrieveRandomCardResponse = {
  answer: string
  answerImg: string
  answerVideo: string
  created: string
  deckId: string
  grade: number
  id: string
  question: string
  questionImg: string
  questionVideo: string
  shots: number
  updated: string
  userId: string
}

export type updateDeckResponse = {
  cardsCount: number
  cover: string
  created: string
  id: string
  isPrivate: boolean
  name: string
  updated: string
  userId: string
}

export type updateDeckQuery = {
  cover?: File | string
  id: string
  isPrivate: boolean
  name: string
}

export type updateCard = {
  answer?: string
  answerImg?: string
  answerVideo?: string
  id: string
  question?: string
  questionImg?: string
  questionVideo?: string
}

export type updateCardResponse = {
  answer: string
  answerImg: string
  answerVideo: string
  created: string
  deckId: string
  id: string
  question: string
  questionImg: string
  questionVideo: string
  shots: number
  updated: string
  userId: string
}
