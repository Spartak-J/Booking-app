// Component: BookingSuccessScreenView. Used in: BookingSuccessScreen.
import React, { useMemo, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ArrowLeft } from 'lucide-react-native';

import successBackground from '@/assets/images/background_success.png';
import successIcon from '@/assets/images/success.png';
import { useTranslation } from '@/i18n';
import { BottomLoader, IconButton, LineWithDots, Typography } from '@/ui';
import { palette } from '@/theme';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;

const LOAD_WIDTH = s(340);
const LOAD_HEIGHT = s(40);
const LOAD_KNOB = s(75);
const SUCCESS_COLOR = palette.white;

type BookingSuccessScreenViewProps = {
  onBack: () => void;
  onHome: () => void;
};

export const BookingSuccessScreenView: React.FC<BookingSuccessScreenViewProps> = ({
  onBack,
  onHome,
}) => {
  const { t } = useTranslation();
  const [loadingFinished, setLoadingFinished] = useState(false);
  const styles = useMemo(() => getStyles(), []);

  return (
    <View style={styles.container}>
      <Image source={successBackground} style={styles.backgroundImage} />

      <View style={styles.header}>
        <View style={styles.headerRow}>
          <IconButton
            onPress={onBack}
            size="md"
            variant="ghost"
            iconColorOverride={SUCCESS_COLOR}
            preserveIconColor
            icon={<ArrowLeft size={s(18)} color={SUCCESS_COLOR} />}
          />
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
      <LineWithDots width={s(304)} color={SUCCESS_COLOR} style={styles.headerUnderline} />

      {loadingFinished ? (
        <View style={styles.successGroup}>
          <Image source={successIcon} style={styles.successIcon} />
        </View>
      ) : null}

      {!loadingFinished && (
        <View style={styles.bottomLoaderWrapper}>
          <BottomLoader
            width={LOAD_WIDTH}
            height={LOAD_HEIGHT}
            knobSize={LOAD_KNOB}
            showKnob={false}
            borderColor={SUCCESS_COLOR}
            fillColor={SUCCESS_COLOR}
            knobColor={SUCCESS_COLOR}
            minFillWidth={s(38)}
            duration={3000}
            onFinish={() => setLoadingFinished(true)}
          />
        </View>
      )}

      <View style={styles.homeIndicator}>
        <IconButton
          onPress={onHome}
          variant="ghost"
          circular
          bordered
          dimension={s(42)}
          iconColorOverride={SUCCESS_COLOR}
          preserveIconColor
          icon={<MaterialCommunityIcons name="home" size={s(18)} color={SUCCESS_COLOR} />}
        />
      </View>
    </View>
  );
};

const getStyles = () =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: undefined,
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
      top: 0,
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
      color: SUCCESS_COLOR,
      fontSize: s(15),
      fontWeight: '700',
    },
    headerUnderline: {
      position: 'absolute',
      left: s(50),
      top: s(52),
    },
    successGroup: {
      position: 'absolute',
      width: s(116.5),
      height: s(114.5),
      left: s(148),
      top: s(370),
      alignItems: 'center',
      justifyContent: 'center',
    },
    successIcon: {
      width: s(116.5),
      height: s(114.5),
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
  });

export default BookingSuccessScreenView;
