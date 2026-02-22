// Component: FooterNavOverlay. Used in: Profile/Messages/Bookings screens.
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import HomeFooter from '@/components/Home/HomeFooter';
import { BOTTOM_NAV_ITEMS } from '@/components/Home/homeNavigationData';
import type { RootStackParamList } from '@/navigation/RootNavigator';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type FooterNavOverlayProps = {
  activeId?: 'home' | 'messages' | 'bookings' | 'profile';
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
    elevation: 5,
  },
});

export const FooterNavOverlay: React.FC<FooterNavOverlayProps> = ({ activeId = 'home' }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const items = useMemo(
    () =>
      BOTTOM_NAV_ITEMS.map((item) => ({
        ...item,
        onPress: () =>
          navigation.navigate('Main', {
            screen:
              item.id === 'home'
                ? 'Home'
                : item.id === 'messages'
                  ? 'Notifications'
                  : item.id === 'bookings'
                    ? 'Bookings'
                    : 'Profile',
          }),
      })),
    [navigation],
  );

  return (
    <View style={styles.overlay}>
      <HomeFooter items={items} activeId={activeId} />
    </View>
  );
};

export default FooterNavOverlay;
