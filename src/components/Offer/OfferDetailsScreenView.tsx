// Component: OfferDetailsScreenView. Used in: OfferDetailsScreen.
import React, { useMemo, useState } from 'react';
import { Animated, Easing, ScrollView, StyleSheet, View } from 'react-native';

import { OfferDetailsHeader } from '@/components/Offer/OfferDetailsHeader';
import { OfferRoomsList } from '@/components/Offer/OfferRoomsList';
import { OfferReviews } from '@/components/Offer/OfferReviews';
import HomeMenuSheet from '@/components/Home/HomeMenuSheet';
import { MENU_ITEMS } from '@/components/Home/homeNavigationData';
import type { Offer } from '@/types';
import { useTheme } from '@/theme';
import { getColorTokens } from '@/theme';
import { Loader } from '@/ui';
import { s } from '@/utils/scale';
const OVERLAY_ANIMATION_DURATION = 250;

type OfferDetailsScreenViewProps = {
  offer?: Offer | null;
  isLoading: boolean;
  onBack: () => void;
  onOpenGallery: (offerId: string) => void;
  onBook: (offerId: string) => void;
};

export const OfferDetailsScreenView: React.FC<OfferDetailsScreenViewProps> = ({
  offer,
  isLoading,
  onBack,
  onOpenGallery,
  onBook,
}) => {
  const { colors, mode } = useTheme();
  const tokens = useMemo(() => getColorTokens(colors, mode), [colors, mode]);
  const styles = useMemo(() => getStyles(tokens), [tokens]);
  const contentStyle = useMemo(() => [styles.content], [styles.content]);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnimation = useMemo(() => new Animated.Value(0), []);

  if (isLoading || !offer) {
    return (
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={contentStyle}>
          <Loader variant="skeleton" height={200} />
          <Loader variant="skeleton" height={24} style={styles.loadingTitle} />
          <Loader variant="skeleton" height={18} style={styles.loadingSubtitle} />
        </ScrollView>
      </View>
    );
  }

  const animateOverlay = (anim: Animated.Value, open: boolean, onComplete?: () => void) => {
    Animated.timing(anim, {
      toValue: open ? 1 : 0,
      duration: OVERLAY_ANIMATION_DURATION,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start(() => onComplete?.());
  };

  const openMenu = () => {
    setMenuOpen(true);
    menuAnimation.setValue(0);
    animateOverlay(menuAnimation, true);
  };

  const closeMenu = () => {
    animateOverlay(menuAnimation, false, () => setMenuOpen(false));
  };

  const rooms = offer.rooms ?? [];

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={contentStyle}>
        <OfferDetailsHeader
          offer={offer}
          onBack={onBack}
          onSearch={() => undefined}
          onGallery={() => onOpenGallery(offer.id)}
          onMenu={openMenu}
        />
        <OfferReviews reviews={offer.reviews} />
        <OfferRoomsList rooms={rooms} onBook={() => onBook(offer.id)} />
      </ScrollView>

      <HomeMenuSheet
        visible={menuOpen}
        onClose={closeMenu}
        animatedStyle={{
          opacity: menuAnimation,
          transform: [
            {
              translateY: menuAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-s(64), 0],
              }),
            },
          ],
        }}
        items={MENU_ITEMS}
      />
    </View>
  );
};

const getStyles = (tokens: ReturnType<typeof getColorTokens>) =>
  // LEGACY VIEW — UI pending redesign
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: tokens.bgScreen,
    },
    content: {
      paddingHorizontal: s(20),
    },
    loadingTitle: {
      marginTop: s(16),
      width: '70%',
    },
    loadingSubtitle: {
      width: '50%',
    },
  });

export default OfferDetailsScreenView;
