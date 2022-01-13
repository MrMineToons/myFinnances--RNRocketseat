import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

export function Dashboard(){
  const [data, setData] = useState<DataListProps[]>([]);

  async function loadTransactions(){
    const dataKey = '@gofinances:transactions';
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      return{
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
      }
    });

    setData(transactionsFormatted);
  }

  useEffect(() => {
    loadTransactions();
  },[]);

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
