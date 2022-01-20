import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'styled-components';


import { HighlightCard } from '../../components/HighlightCard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { useAuth } from '../../hooks/auth';

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
  LogoutButton,
  LoadContainer
} from './styles';

export interface DataListProps extends TransactionCardProps{
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}

interface HighlightData {
  entries: HighlightProps;
  expensives: HighlightProps;
  total: HighlightProps;
}

export function Dashboard(){
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  const theme = useTheme();
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ){
    const collectionFilttered = collection
    .filter((transaction) => transaction.type === type);

    if(collectionFilttered.length === 0)
    return "0";

    const lastTransaction = new Date(
    Math.max.apply(Math, collectionFilttered
    .map((transaction) => new Date(transaction.date).getTime())));

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long'})}`;
  } // Fim da Função

  async function loadTransactions(){
    const dataKey = `@gofinances:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];
    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
      if(item.type === 'positive'){
        entriesTotal += Number(item.amount);
      }else {
        expensiveTotal += Number(item.amount);
      }
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

    setTransactions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
    const totalInterval = lastTransactionExpensives === '0'
    ? 'Não há transações'
    : `01 a ${lastTransactionExpensives}`;

    // console.log(lastTransactionEntriesFormatted);

    const total = entriesTotal - expensiveTotal;
    setHighlightData({
      entries: {
        amount: entriesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionEntries === '0'
        ? 'Não há transações'
        : `Última entrada dia  ${lastTransactionEntries}`,
      },
      expensives: {
        amount: expensiveTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: lastTransactionExpensives === '0'
        ? 'Não há transação'
        : `Última saída dia ${lastTransactionExpensives}`,
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval,
      }
    });
    // console.log(transactionsFormatted)
    setIsLoading(false)
  }

  useEffect(() => {
    loadTransactions();
    // const dataKey = '@gofinances:transactions';
    // AsyncStorage.removeItem(dataKey);
  },[]);

  useFocusEffect(useCallback(() => {
    loadTransactions();
  },[]));

  return (
    <Container>
    {
      isLoading ?
      <LoadContainer>
        <ActivityIndicator
        color={theme.colors.primary}
        size="large"
        />
      </LoadContainer> :
      <>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{ uri: user.photo }}
            />
            <User>
              <UserGreeting>Ola, </UserGreeting>
              <UserName>{user.name}</UserName>
            </User>
          </UserInfo>
          <GestureHandlerRootView>
            <LogoutButton onPress={signOut}>
              <Icon name="power"/>
            </LogoutButton>
          </GestureHandlerRootView>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard title="Entradas" amount={highlightData.entries.amount} lastTransaction={highlightData.entries.lastTransaction} type='up'/>
        <HighlightCard title="Saidas" amount={highlightData.expensives.amount}  lastTransaction={highlightData.expensives.lastTransaction} type='down'/>
        <HighlightCard title="Total" amount={highlightData.total.amount} lastTransaction={highlightData.total.lastTransaction} type='total'/>
      </HighlightCards>

      <Transactions>
        <Title>Listagem de Transações</Title>
        <TransactionList
          data={transactions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </>
  }
    </Container>
  );
};
