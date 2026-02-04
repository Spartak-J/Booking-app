// Component: BookingSuccessScreenView. Used in: BookingSuccessScreen.
import React, { useMemo, useState } from 'react';
import { Dimensions, Image, StyleSheet, View, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ArrowLeft } from 'lucide-react-native';

import successBackground from '@/assets/images/background_success.png';
import successIcon from '@/assets/images/success.png';
import { useTranslation } from '@/i18n';
import { BottomLoader, LineWithDots, Typography } from '@/ui';
import { useTheme } from '@/theme';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;

const LOAD_WIDTH = s(340);
const LOAD_HEIGHT = s(40);
const LOAD_KNOB = s(75);

type BookingSuccessScreenViewProps = {
  onBack: () => void;
};

export const BookingSuccessScreenView: React.FC<BookingSuccessScreenViewProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const [loadingFinished, setLoadingFinished] = useState(false);
  const { colors, tokens } = useTheme();
  const styles = useMemo(() => getStyles(colors, tokens), [colors, tokens]);

  return (
    <View style={styles.container}>
      <Image source={successBackground} style={styles.backgroundImage} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <ArrowLeft size={s(18)} color={tokens.textPrimary} />
          </Pressable>
          <Typography
            variant="h2"
            style={styles.headerTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
            adjustsFontSizeToFit
            minimumFontScale={0.85}
          >
            {t('booking.heading')}
          </Typography>
        </View>
      </View>
      <LineWithDots width={s(304)} color={tokens.textPrimary} style={styles.headerUnderline} />

      {loadingFinished && (
        <View style={styles.successGroup}>
          <Typography variant="h1" style={styles.successText} allowFontScaling={false}>
            {t('bookingSuccess.success')}
          </Typography>
          <Image source={successIcon} style={styles.successIcon} />
        </View>
      )}

      {!loadingFinished && (
        <View style={styles.bottomLoaderWrapper}>
          <BottomLoader
            width={LOAD_WIDTH}
            height={LOAD_HEIGHT}
            knobSize={LOAD_KNOB}
            showKnob={false}
            borderColor={tokens.textPrimary}
            fillColor={tokens.accent}
            knobColor={tokens.textPrimary}
            minFillWidth={s(38)}
            duration={3000}
            onFinish={() => setLoadingFinished(true)}
          />
        </View>
      )}

      {!loadingFinished && (
        <View style={styles.homeIndicator}>
          <View style={styles.homeCircle}>
            <MaterialCommunityIcons name="home" size={s(18)} color={tokens.textPrimary} />
          </View>
        </View>
      )}
    </View>
  );
};

const getStyles = (colors: any, tokens: Record<string, string>) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bgDark,
    },
    backgroundImage: {
      position: 'absolute',
      width: s(541),
      height: s(966),
      left: s(-77),
      top: s(-49),
      resizeMode: 'cover',
    },
    header: {
      position: 'absolute',
      width: s(412),
      height: s(36),
      left: 0,
      top: s(41),
      alignItems: 'flex-start',
      justifyContent: 'center',
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: s(26),
      gap: s(10),
    },
    backButton: {
      width: s(24),
      height: s(24),
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      color: tokens.textPrimary,
      fontSize: s(15),
      fontWeight: '700',
    },
    headerUnderline: {
      position: 'absolute',
      left: s(50),
      top: s(87),
    },
    successGroup: {
      position: 'absolute',
      width: s(299),
      height: s(136),
      left: s(50),
      top: s(377),
    },
    successText: {
      position: 'absolute',
      left: s(0),
      top: s(5),
      color: tokens.textPrimary,
      fontSize: s(96),
      lineHeight: s(117),
      fontWeight: '700',
    },
    successIcon: {
      position: 'absolute',
      width: s(116.5),
      height: s(114.5),
      left: s(183),
      top: s(0),
      resizeMode: 'contain',
    },
    bottomLoaderWrapper: {
      position: 'absolute',
      left: s(36),
      top: s(715),
      width: s(340),
      height: s(40),
      zIndex: 5,
    },
    homeIndicator: {
      position: 'absolute',
      left: (SCREEN_WIDTH - s(42)) / 2,
      top: s(791),
      zIndex: 5,
    },
    homeCircle: {
      width: s(42),
      height: s(42),
      borderRadius: s(24),
      borderWidth: s(2),
      borderColor: tokens.textPrimary,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default BookingSuccessScreenView;
