import React, { useMemo, useState } from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ArrowLeft } from 'lucide-react-native';

import successBackground from '@/assets/images/background_success.png';
import { useTranslation } from '@/i18n';
import { BottomLoader, Button, IconButton, LineWithDots, Typography } from '@/ui';
import { palette, useTheme } from '@/theme';

const DESIGN_WIDTH = 412;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const scale = SCREEN_WIDTH / DESIGN_WIDTH;
const s = (value: number) => value * scale;
const HEADER_COLOR = palette.white;
const LOAD_WIDTH = s(340);
const LOAD_HEIGHT = s(40);
const LOAD_KNOB = s(75);

type BookingFailureScreenViewProps = {
  onBack: () => void;
  message?: string;
  onRetry: () => void;
  onHome: () => void;
};

export const BookingFailureScreenView: React.FC<BookingFailureScreenViewProps> = ({
  onBack,
  message,
  onRetry,
  onHome,
}) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
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
            iconColorOverride={HEADER_COLOR}
            preserveIconColor
            icon={<ArrowLeft size={s(18)} color={HEADER_COLOR} />}
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
      <LineWithDots width={s(304)} color={HEADER_COLOR} style={styles.headerUnderline} />

      {loadingFinished ? (
        <>
          <View style={styles.failureGroup}>
            <MaterialCommunityIcons name="close-circle" size={s(168)} color={colors.error} />
          </View>

          <View style={styles.textBlock}>
            <Typography variant="h2" style={styles.title}>
              {t('bookingFailure.title')}
            </Typography>
            <Typography variant="body" style={styles.subtitle}>
              {message ?? t('bookingFailure.subtitle')}
            </Typography>
          </View>
        </>
      ) : null}

      <View style={styles.actions}>
        {!loadingFinished ? (
          <BottomLoader
            width={LOAD_WIDTH}
            height={LOAD_HEIGHT}
            knobSize={LOAD_KNOB}
            showKnob={false}
            borderColor={colors.error}
            fillColor={colors.error}
            knobColor={HEADER_COLOR}
            minFillWidth={s(38)}
            duration={3000}
            onFinish={() => setLoadingFinished(true)}
          />
        ) : (
          <Button title={t('bookingFailure.retry')} onPress={onRetry} style={styles.retryButton} />
        )}
      </View>

      <View style={styles.homeIndicator}>
        <IconButton
          onPress={onHome}
          variant="ghost"
          circular
          bordered
          dimension={s(42)}
          iconColorOverride={HEADER_COLOR}
          preserveIconColor
          icon={<MaterialCommunityIcons name="home" size={s(18)} color={HEADER_COLOR} />}
        />
      </View>
    </View>
  );
};

const getStyles = () =>
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
    headerTitle: {
      color: HEADER_COLOR,
      fontSize: s(15),
      fontWeight: '700',
    },
    headerUnderline: {
      position: 'absolute',
      left: s(50),
      top: s(52),
    },
    failureGroup: {
      position: 'absolute',
      width: s(170),
      height: s(168),
      left: (SCREEN_WIDTH - s(170)) / 2,
      top: s(300),
      alignItems: 'center',
      justifyContent: 'center',
    },
    textBlock: {
      position: 'absolute',
      width: s(320),
      left: (SCREEN_WIDTH - s(320)) / 2,
      top: s(492),
      gap: s(10),
    },
    title: {
      textAlign: 'center',
      color: HEADER_COLOR,
    },
    subtitle: {
      textAlign: 'center',
      color: HEADER_COLOR,
    },
    actions: {
      position: 'absolute',
      left: s(36),
      top: s(715),
      width: s(340),
      zIndex: 5,
    },
    retryButton: {
      minHeight: s(42),
    },
    homeIndicator: {
      position: 'absolute',
      left: (SCREEN_WIDTH - s(42)) / 2,
      top: s(791),
      zIndex: 5,
    },
  });

export default BookingFailureScreenView;
