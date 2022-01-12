import React from 'react';
import { FlatList } from 'react-native';


import { categories } from '../../utils/categories';
import { Button } from '../../../src/components/Forms/Button';
import {
  Container,
  Icon,
  Header,
  HeaderTitle,
  Category,
  Name,
  Separator
} from './styles';


interface Category {
  key: string;
  name: string;
}

interface Props {
  category: Category;
  setCategory: (category: Category) => void;
  closeSelectCategory: () => void;
}


export function CategorySelect({
  category,
  setCategory,
  closeSelectCategory
}: Props){

  function handleCategorySelect(category: Category){
    setCategory(category);
  }

  return(
    <Container>
      <Header>
        <HeaderTitle>Categoria</HeaderTitle>
      </Header>


      <FlatList
        data={categories}
        style={{ flex: 1, width: '100%' }}
        keyExtractor={( item ) => item.key }
        renderItem={({ item }) => (
          <Category
            onPress={() => handleCategorySelect(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon} />
            <Name>{item.name}</Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator />}
      />


      <Button title="Selecionar" style={{ marginBottom: 30 }} onPress={closeSelectCategory}/>
    </Container>
  )
}
