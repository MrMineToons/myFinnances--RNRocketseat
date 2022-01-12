import React, { useState, useEffect } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppRoutesParamList } from '../../routes/appRoutes';

import { InputForm } from '../../components/Forms/InputForm';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes
} from './styles';


interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome é Obrigatório'),
  amount: Yup.number().typeError('Informe um valor númerico').positive('O valor nao pode ser negativo').required('O valor é Obrigatório')
});

type RegisterNavigationProps = BottomTabNavigationProp<
  AppRoutesParamList,
  "Cadastrar"
>;


export function Register(){
  const dataKey = '@gofinances:transactions';
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  });


  const navigation = useNavigation<RegisterNavigationProps>();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleCloseSelectCategoryModal(){
    setCategoryModalOpen(false);
  }

  function handleOpenSelectCategoryModal(){
    setCategoryModalOpen(true);
  }

  function handleTransactionsTypeSelect(type: 'up' | 'down'){
    setTransactionType(type);
  }

  async function handleRegister(form: FormData){
    if(!transactionType)
      return Alert.alert('Selecione o tipo da transação!');

    if(category.key === 'category')
      return Alert.alert('Selecione o tipo da transação')

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newTransaction
      ];

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      });

      navigation.navigate('Listagem');

    } catch (error) {
      console.log("Houve o seguinte erro em handleRegister: ", error);
      Alert.alert("Nao foi possivel salvar as informações");
    }
  }

// useEffect(() => {
//   // ARMAZENA OS DADOS NO DISPOSITIVO DO USUARIO
//   async function loadData(){
//     const data = await AsyncStorage.getItem(dataKey);
//     console.log(JSON.parse(data!));
//   }
//
//   loadData();
//
//   // REALIZA LIMPEZA NOS DADOS DO DISPOSITIVO
//   // async function removeAll() {
//   //   await AsyncStorage.removeItem(dataKey);
//   // }
//   //
//   // removeAll();
// }, []);


  return(
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm placeholder="Nome" name="name" control={control} autoCapitalize="sentences" autoCorrect={false} error={errors.name && errors.name.message}/>
            <InputForm placeholder="Preço" name="amount" control={control} keyboardType="numeric" error={errors.amount && errors.amount.message}/>
            <GestureHandlerRootView>
              <TransactionTypes>
                <TransactionTypeButton title="Income" type="up" onPress={() => handleTransactionsTypeSelect('up')} isActive={transactionType === 'up'}/>
                <TransactionTypeButton title="Outcome" type="down" onPress={() => handleTransactionsTypeSelect('down')} isActive={transactionType === 'down'}/>
              </TransactionTypes>
            </GestureHandlerRootView>
            <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal} />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)}/>
        </Form>
        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
