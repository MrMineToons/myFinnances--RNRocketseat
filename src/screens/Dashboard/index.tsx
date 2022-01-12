import React from 'react';

import { HighlightCard } from '../../components/HighlightCard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserInfo,
  UserWrapper,
  Photo,
  User,
  UserName,
  UserGreeting,
  HighlightCards,
  Icon,
  Title,
  Transactions,
  TransactionList,
  LogoutButton
} from './styles';

export interface DataListProps extends TransactionCardProps{
  id: string;
}

const data:DataListProps [] = [
{
  id:'1',
  type:"positive",
  title:"Desenvolvimento do site",
  amount:"R$ 12.000,00",
  category:{
    name: 'Vendas',
    icon: 'dollar-sign'
  },
  date:"27/11/2021"
},
{
  id:'2',
  type:"negative",
  title:"Hamburgueria Pizzy",
  amount:"R$ 59,00",
  category:{
    name: 'Alimentação',
    icon: 'coffee'
  },
  date:"24/10/2021"
},
{
  id:'3',
  type:"negative",
  title:"Aluguel do Apartamento",
  amount:"R$ 1.200,00",
  category:{
    name: 'Casa',
    icon: 'shopping-bag'
  },
  date:"24/10/2021"
}];

export function Dashboard(){
  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{ uri: 'https://avatars.githubusercontent.com/u/68707610?v=4' }}
            />
            <User>
              <UserGreeting>Ola, </UserGreeting>
              <UserName>Fabricio</UserName>
            </User>
          </UserInfo>
          <GestureHandlerRootView>
            <LogoutButton onPress={() => console.log('oi')}>
              <Icon name="power"/>
            </LogoutButton>
          </GestureHandlerRootView>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard title="Entradas" amount="R$ 17.400,00" lastTransaction="Última saída dia 03 de abril" type='up'/>
        <HighlightCard title="Saidas" amount="R$ 16.200,00" lastTransaction="Outra Informação" type='down'/>
        <HighlightCard title="Total" amount="R$ 22.150,00" lastTransaction="Apenas Informacao" type='total'/>
      </HighlightCards>

      <Transactions>
        <Title>Listagem de Transações</Title>
        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>

    </Container>
  );
};
