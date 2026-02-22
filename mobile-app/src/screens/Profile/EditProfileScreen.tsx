// Screen: EditProfileScreen (Account management). Used in: RootNavigator via ProfileScreen -> account.
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '@/hooks/useAuth';
import EditProfileScreenView from '@/components/Profile/EditProfileScreenView';
import { AppLayout } from '@/layout/AppLayout';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HomeFooter from '@/components/Home/HomeFooter';
import { BOTTOM_NAV_ITEMS } from '@/components/Home/homeNavigationData';
import { Routes } from '@/navigation/routes';
import { mapProfileFormToUserPatch, mapUserToProfileForm } from '@/services/profile/profileMapper';

export const EditProfileScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { role, user, updateProfile } = useAuth();

  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return undefined;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (result.canceled || !result.assets?.length) return;
    return result.assets[0].uri;
  };

  return (
    <AppLayout
      variant="stack"
      footer={
        <HomeFooter
          items={BOTTOM_NAV_ITEMS.map((item) => ({
            ...item,
            onPress: () => {
              const target =
                item.id === 'home'
                  ? Routes.Home
                  : item.id === 'messages'
                    ? Routes.Notifications
                    : item.id === 'bookings'
                      ? Routes.Bookings
                      : Routes.Profile;
              navigation.navigate(Routes.Main, { screen: target });
            },
          }))}
          activeId="profile"
        />
      }
    >
      <EditProfileScreenView
        initialValues={mapUserToProfileForm(user)}
        onBack={() => navigation.goBack()}
        isOwner={role === 'owner'}
        isAdmin={role === 'admin'}
        onPickAvatar={handlePickAvatar}
        onSubmit={async (values) => {
          await updateProfile(mapProfileFormToUserPatch(values));
        }}
      />
    </AppLayout>
  );
};

export default EditProfileScreen;
