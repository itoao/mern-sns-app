import { Grid, GridItem } from '@chakra-ui/react'
import React from 'react'
import { Topbar } from '../../components/Topbar'

export const Home = () => {
  return (
    <Grid
      templateAreas={`"header header"
                      "nav main"
                      "nav footer"`}
      gridTemplateRows={'50px 1fr 30px'}
      gridTemplateColumns={'150px 1fr'}
      h='200px'
      gap='1'
      color='blackAlpha.700'
      fontWeight='bold'
    >
      <GridItem pl='2' bg='orange.300' area={'header'}>
        <Topbar />
      </GridItem>
      <GridItem pl='2' bg='pink.300' area={'nav'}>
        Nav
      </GridItem>
      <GridItem pl='2' bg='green.300' area={'main'}>
        Main
      </GridItem>
      <GridItem pl='2' bg='blue.300' area={'footer'}>
        Footer
      </GridItem>
    </Grid> 
  )
}
