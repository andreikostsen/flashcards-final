import { useState } from 'react'
import { Link } from 'react-router-dom'

import { PlayCircleOutline, TrashOutline } from '@/assets/icons/components'
import Edit2Outline from '@/assets/icons/components/Edit2Outline'
import { SvgWrapper } from '@/assets/icons/wrapper'
import { Filter } from '@/components/layout/filter/filter'
import { Header } from '@/components/ui/header'
import { Pagination } from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/tables/table-components'
import { Typography } from '@/components/ui/typography'
import { AddNewDeckModal } from '@/pages/modals/addNewDeckModal'
import { DeleteCardModal } from '@/pages/modals/deleteCardModal'
import { EditDeckModal } from '@/pages/modals/editDeckModal'
import { useAuthMeQuery } from '@/services/auth/auth.service'
import { useDeleteDeckMutation, useGetDecksQuery } from '@/services/base-api'
import { GetDecksQuery } from '@/services/flashcards.types'

import s from './decks.module.scss'

export const Decks = () => {
  const [currentPage, setCurrentPage] = useState<number>()
  const [itemsPerPage, setItemsPerPage] = useState<number>()
  const [sliderValues, setSliderValues] = useState<number[]>([2, 10])
  const [tabSwitcherValue, setTabSwitcherValue] = useState<string>('allCards')
  const [searchInputValue, setSearchInputValue] = useState<string>()

  const onClearFilterHandler = () => {
    console.log('clear filter')
    setSearchInputValue('')
    setSliderValues([2, 10])
    setTabSwitcherValue('allCards')
  }

  const meResponse = useAuthMeQuery()

  let authorId: string | undefined = meResponse.data?.id

  if (tabSwitcherValue !== 'myCards') {
    authorId = undefined
  }

  const getDecksQuery: GetDecksQuery = {
    authorId,
    currentPage,
    itemsPerPage,
    maxCardsCount: sliderValues[1],
    minCardsCount: sliderValues[0],
    name: searchInputValue,
  }
  const { data, isLoading } = useGetDecksQuery(getDecksQuery)
  const [deleteDeck] = useDeleteDeckMutation()
  const [open, setOpen] = useState<boolean>(false)
  const [cover, setCover] = useState<string | undefined>()
  const [id, setId] = useState<string>('')
  const [name, setName] = useState<string>()

  console.log(meResponse)

  const onCurrentPageButtonClickHandler = (currentPage: number | string) => {
    setCurrentPage(Number(currentPage))
  }

  const onItemsPerPageClickHandler = (itemsPerPage: string) => {
    setItemsPerPage(Number(itemsPerPage))
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  const onSliderChangeHandler = (values: number[]) => {
    setSliderValues(values)
  }

  const onTabSwitcherChangeHandler = (value: string) => {
    console.log(value)
    setTabSwitcherValue(value)
    setCurrentPage(1)
  }

  const onInputSearchChangeHandler = (value: string) => {
    console.log(value)
    setSearchInputValue(value)
  }

  const onEditClickHandler = (cover: string | undefined, id: string, name: string) => {
    console.log(cover, id, name)
    setOpen(true)
    setCover(cover)
    setId(id)
    setName(name)
  }

  const openChangeEventHandler = (open: boolean) => {
    console.log(open)
    setOpen(open)
  }

  const onDeleteDeckHandler = (deckId: string, name: string) => {
    console.log(deckId, name)
  }

  return (
    <>
      <Header isAuthenticated={!meResponse.isUninitialized} userInfo={meResponse.data} />
      <div className={s.container}>
        <div className={s.pageHeadingWrapper}>
          <Typography as={'h1'} variant={'h1'}>
            Decks list
          </Typography>
          <AddNewDeckModal />
        </div>
        <Filter
          inputValue={searchInputValue}
          onClearFilter={onClearFilterHandler}
          onInputSearchChange={onInputSearchChangeHandler}
          onSliderChange={onSliderChangeHandler}
          onTabSwitcherChange={onTabSwitcherChangeHandler}
          sliderValues={sliderValues}
          tabSwitcherValue={tabSwitcherValue}
        />

        <Table width={'100%'}>
          <TableHead>
            <TableRow>
              <TableHeader align={'left'}>Name</TableHeader>
              <TableHeader align={'left'}>Cards</TableHeader>
              <TableHeader align={'left'}>Last Updated</TableHeader>
              <TableHeader align={'left'}>Created by</TableHeader>
              <TableHeader></TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {data ? (
              data.items.map(item => {
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div style={{ alignItems: 'center', display: 'flex' }}>
                        {item.cover ? (
                          <Link to={`./cards/${item.id}`}>
                            <img
                              alt={item.name}
                              src={item.cover}
                              style={{ cursor: 'pointer', marginRight: '10px' }}
                              width={'118px'}
                            />
                          </Link>
                        ) : (
                          ''
                        )}
                        <Link className={s.nameLink} to={`./cards/${item.id}`}>
                          {item.name}
                        </Link>
                      </div>
                    </TableCell>
                    <TableCell>{item.cardsCount}</TableCell>
                    <TableCell>
                      {new Date(Date.parse(item.updated)).toLocaleDateString('ru-RU')}
                    </TableCell>
                    <TableCell>{item.author.name}</TableCell>
                    <TableCell className={s.iconsCell}>
                      <div className={s.iconsDiv}>
                        <Link to={`./cards/${item.id}`}>
                          <SvgWrapper
                            SvgComponent={PlayCircleOutline}
                            color={'white'}
                            size={'16'}
                            wrapper={'button'}
                          />
                        </Link>
                        {meResponse.data?.id == item.author.id && (
                          <SvgWrapper
                            SvgComponent={Edit2Outline}
                            onClick={() => onEditClickHandler(item.cover, item.id, item.name)}
                            size={'16'}
                            wrapper={'button'}
                          />
                        )}
                        {meResponse.data?.id == item.author.id && (
                          <SvgWrapper
                            SvgComponent={TrashOutline}
                            // onClick={() => deleteDeck(item.id)}
                            onClick={() => onDeleteDeckHandler(item.id, item.name)}
                            size={'16'}
                            wrapper={'button'}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <EditDeckModal
          cover={cover}
          deckId={id}
          name={name}
          onOpenChange={openChangeEventHandler}
          open={open}
        />
        <DeleteCardModal
          deckId={id}
          name={name}
          onOpenChange={openChangeEventHandler}
          open={open}
        />
        <Pagination
          onPageChange={onCurrentPageButtonClickHandler}
          onPerPageChange={onItemsPerPageClickHandler}
          perPageOptions={['10', '20', '30', '50', '100']}
          totalPages={data ? data.pagination.totalPages : 1}
        />
      </div>
    </>
  )
}
