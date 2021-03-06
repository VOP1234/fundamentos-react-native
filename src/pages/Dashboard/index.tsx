import React, { useState, useEffect } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { View, Image, ViewPropertiesAndroid } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import formatValue from '../../utils/formatValue';
import { useCart } from '../../hooks/cart';
import api from '../../services/api';

import FloatingCart from '../../components/FloatingCart';

import {
  Container,
  ProductContainer,
  ProductImage,
  ProductList,
  Product,
  ProductTitle,
  PriceContainer,
  ProductPrice,
  ProductButton,
} from './styles';

interface theProduct {
  id: string;
  title: string;
  image_url: string;
  price: number;
}

const Dashboard: React.FC = () => {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<theProduct[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO
      await api.get<theProduct[]>('products').then(response => {

        setProducts(response.data)
      }).catch(error => console.log(error));
    }
    //  usar quando quiser limpar o AsycStorage
    //  AsyncStorage.removeItem('@gomarketplace')

    loadProducts();
  }, []);

  function handleAddToCart(item: theProduct): void {
    // TODO
    const { id, title, image_url, price } = item

    const theProduct = {
      id,
      title,
      image_url,
      price,
     }

    addToCart(theProduct)
  }

  return (
    <Container>
      <ProductContainer>
        <ProductList
          data={products}
          keyExtractor={item => item.id}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{
            height: 80,
          }}
          renderItem={({ item: product }) => (
            <Product>
              <ProductImage source={{ uri: product.image_url }} />
              <ProductTitle>{product.title}</ProductTitle>
              <PriceContainer>
                <ProductPrice>{formatValue(product.price)}</ProductPrice>
                <ProductButton testID={`add-to-cart-${product.id}`} onPress={() => handleAddToCart(product)}>
                  <FeatherIcon size={20} name="plus" color="#C4C4C4" />
                </ProductButton>
              </PriceContainer>
            </Product>
          )}
        />
      </ProductContainer>
      <FloatingCart />
    </Container>
  );
};

export default Dashboard;
