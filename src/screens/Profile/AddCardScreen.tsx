// Screen: AddCardScreen. Used in: RootNavigator via PaymentInfoScreen -> AddCard.
import React from 'react';
import { useNavigation } from '@react-navigation/native';

import AddCardScreenView from '@/components/Profile/AddCardScreenView';
import { PaymentRepository } from '@/data/payment';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@/ui';

export const AddCardScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSave = async (values: {
    holderName: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
    saveCard: boolean;
  }) => {
    await PaymentRepository.addCard({
      holderName: values.holderName,
      number: values.cardNumber,
      expiry: values.expiry,
    });
    navigation.goBack();
  };

  return (
    <ScreenContainer edges={['top', 'left', 'right']}>
      <AddCardScreenView onBack={() => navigation.goBack()} onSave={handleSave} />
    </ScreenContainer>
  );
};

export default AddCardScreen;
