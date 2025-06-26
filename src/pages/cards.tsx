import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { Edit2Outline, PlayCircleOutline, TrashOutline } from '@/assets/icons/components'
import ArrowBackOutline from '@/assets/icons/components/ArrowBackOutline'
import { SvgWrapper } from '@/assets/icons/wrapper'
import { DropDownMenu, dropDownMenuList } from '@/components/ui/drop-down-menu'
import { DropDownList } from '@/components/ui/drop-down-menu/Drop-down-list'
import { Header } from '@/components/ui/header'
import { Pagination } from '@/components/ui/pagination'
import { Rating } from '@/components/ui/rating'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/tables/table-components'
import { TextField } from '@/components/ui/textField'
import { Typography } from '@/components/ui/typography'
import { AddNewCardModal } from '@/pages/modals/addNewCardModal'
import { DeleteModal } from '@/pages/modals/deleteModal'
import { EditCardModal } from '@/pages/modals/editCardModal'
import { EditDeckModal } from '@/pages/modals/editDeckModal'
import { useAuthMeQuery } from '@/services/auth/auth.service'
import { useGetDeckByIdQuery, useGetDeckCardsQuery } from '@/services/base-api'

import s from './cards.module.scss'

export const Cards = () => {
  const { deckId } = useParams()

  console.log(deckId)

  const { currentData } = useGetDeckByIdQuery(deckId)

  console.log(currentData)

  const [currentPage, setCurrentPage] = useState<number>()
  const [itemsPerPage, setItemsPerPage] = useState<number>()
  const [searchInputValue, setSearchInputValue] = useState<string>()
  const [editDeckModalOpen, setEditDeckModalOpen] = useState<boolean>(false)
  const [cardId, setCardId] = useState<string>()
  const [cardName, setCardName] = useState<string>()
  const [answer, setAnswer] = useState<string>()
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [card, setCard] = useState<boolean>(false)
  const [editCardModalOpen, setEditCardModalOpen] = useState<boolean>(false)

  const { data, isLoading } = useGetDeckCardsQuery({
    currentPage,
    id: deckId,
    itemsPerPage,
    orderBy: null,
    question: searchInputValue,
  })

  console.log(data)

  const meResponse = useAuthMeQuery()

  const options: dropDownMenuList[] = [
    {
      icon: <PlayCircleOutline height={'16'} width={'16'} />,
      redirect: `./learn/${deckId}`,
      title: 'Learn',
    },
    {
      icon: <SvgWrapper SvgComponent={Edit2Outline} size={'16'} wrapper={'button'} />,
      onClick: () => setEditDeckModalOpen(true),
      title: 'Edit',
    },
    {
      icon: <SvgWrapper SvgComponent={TrashOutline} size={'16'} wrapper={'button'} />,
      onClick: () => deleteDeckHandler(),
      title: 'Delete',
    },
  ]

  console.log(searchInputValue)

  const onCurrentPageButtonClickHandler = (currentPage: number | string) => {
    setCurrentPage(Number(currentPage))
  }

  const onItemsPerPageClickHandler = (itemsPerPage: string) => {
    setItemsPerPage(Number(itemsPerPage))
  }

  const deleteCardHandler = (cardId: string, name: string) => {
    setCardId(cardId)
    setCardName(name)
    setDeleteModalOpen(true)
    setCard(true)
  }

  const deleteDeckHandler = () => {
    setCard(false)
    setDeleteModalOpen(true)
  }

  const editCardHandler = (cardId: string, name: string, answer: string) => {
    setCardId(cardId)
    setEditCardModalOpen(true)
    setCardName(name)
    setAnswer(answer)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  let nameForDeleteModal: string | undefined = undefined

  if (card) {
    nameForDeleteModal = cardName
  } else if (currentData) {
    nameForDeleteModal = currentData.name
  }

  return (
    <>
      <Header isAuthenticated={!meResponse.isUninitialized} userInfo={meResponse.data} />
      <div className={s.container}>
        <div className={s.backLinkTxtWrapper}>
          <SvgWrapper
            SvgComponent={ArrowBackOutline}
            color={'white'}
            size={'16'}
            wrapperClassName={s.arrowSpan}
          />
          <div>
            <Typography as={'a'} className={s.backLinkTxt} href={'../'} variant={'body2'}>
              Back to Decks List
            </Typography>
          </div>
        </div>
        <div className={s.pageHeadingWrapper}>
          <div className={s.titleWithMenuWrapper}>
            <Typography as={'h1'} variant={'h1'}>
              {currentData ? currentData.name : ''}
            </Typography>
            <div className={s.menuIconWrapper}>
              <DropDownMenu>
                <DropDownList options={options} />
              </DropDownMenu>
            </div>
          </div>
          <AddNewCardModal deckId={currentData ? currentData.id : ''} />
        </div>
        {currentData?.cover ? (
          <img alt={currentData.name} src={currentData.cover} width={'170px'} />
        ) : (
          ''
        )}

        <TextField
          handleValueChange={setSearchInputValue}
          placeholder={'Input search'}
          type={'search'}
          value={searchInputValue}
          wrapperProps={{ className: s.searchInputWrapper }}
        />
        <Table width={'100%'}>
          <TableHead>
            <TableRow>
              <TableHeader align={'left'}>Question</TableHeader>
              <TableHeader align={'left'}>Answer</TableHeader>
              <TableHeader align={'left'}>Last Updated</TableHeader>
              <TableHeader align={'left'}>Grade</TableHeader>
              <TableHeader align={'left'}></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ? data.items.map(item => (
                  <TableRow key={item.id}>
                    <TableCell key={item.id}>
                      {item.question}
                      <img alt={item.question} src={item.questionImg} width={'170px'} />
                    </TableCell>
                    <TableCell>{item.answer}</TableCell>
                    <TableCell>
                      {new Date(Date.parse(item.updated)).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>
                      <Rating value={item.grade} />
                    </TableCell>
                    <TableCell className={s.iconsCell}>
                      <div className={s.iconsDiv}>
                        <SvgWrapper
                          SvgComponent={Edit2Outline}
                          onClick={() => editCardHandler(item.id, item.question, item.answer)}
                          size={'16'}
                          wrapper={'button'}
                        />
                        <SvgWrapper
                          SvgComponent={TrashOutline}
                          onClick={() => deleteCardHandler(item.id, item.question)}
                          size={'16'}
                          wrapper={'button'}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : ''}
          </TableBody>
        </Table>
        <EditDeckModal
          cover={currentData ? currentData.cover : undefined}
          deckId={deckId ? deckId : ''}
          name={currentData ? currentData.name : ''}
          onOpenChange={setEditDeckModalOpen}
          open={editDeckModalOpen}
        />
        <DeleteModal
          card={card}
          id={card ? cardId : deckId}
          name={nameForDeleteModal}
          onOpenChange={setDeleteModalOpen}
          open={deleteModalOpen}
        />
        <Pagination
          onPageChange={onCurrentPageButtonClickHandler}
          onPerPageChange={onItemsPerPageClickHandler}
          perPageOptions={['10', '20', '30', '50', '100']}
          totalPages={data ? data.pagination.totalPages : 1}
        />
      </div>
      <ToastContainer />
      <EditCardModal
        answer={answer}
        cardId={cardId ? cardId : ''}
        onOpenChange={setEditCardModalOpen}
        open={editCardModalOpen}
        question={cardName}
      />
    </>
  )
}
