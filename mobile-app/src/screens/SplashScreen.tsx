// Screen: SplashScreen.
// Экран сплэша готов. Больше не править без крайней необходимости. --- LEGACY SCREEN, планируется к замене на ui/screens/SplashScreen.tsx
import React, { memo } from 'react';
import { StyleSheet, ImageBackground, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Обязательно проверь наличие этой библиотеки
import { s, vs, SCREEN_WIDTH, SCREEN_HEIGHT } from '@/utils/scale';

import backgroundSplash from '@/assets/images/WelcomeScreen.png';
import logo from '@/assets/images/logo.png';
import magnifyingGlass from '@/assets/images/magnyfyingGlass.png';
import { BottomLoader } from '@/ui';
import { useTheme } from '@/theme';

type Props = {
  onFinish: () => void;
};

const LOGO_WIDTH = s(250);
const LOGO_HEIGHT = vs(111);
const LOGO_TOP = vs(344); // вертикальное положение логотипа (чуть выше центра)

// Прогресс-бар (BottomLoader) — размеры и позиция
const SEARCH_WIDTH = s(340); // ширина рамки
const SEARCH_HEIGHT = vs(40); // высота рамки
const SEARCH_LEFT = (SCREEN_WIDTH - s(0)) / 2; // центрируем по горизонтали
const SEARCH_TOP = SCREEN_HEIGHT - vs(190); // поднимаем, чтобы не выпадал за пределы экрана

const KNOB_SIZE = s(85); // диаметр бегунка с лупой

const SplashScreenComponent: React.FC<Props> = ({ onFinish }) => {
  // TODO: move theming to UI layer
  const { colors, tokens } = useTheme();
  const styles = React.useMemo(() => getStyles(tokens), [tokens]);

  return (
    <ImageBackground source={backgroundSplash} style={styles.container} resizeMode="cover">
      <LinearGradient
        // 180deg — это вертикальный градиент (сверху вниз)
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
        // locations
        locations={[0, 0.58, 1]}
        style={[styles.gradientOverlay, { opacity: 0.8 }]}
      />

      <Image source={logo} style={styles.logo} />

      <BottomLoader
        width={SEARCH_WIDTH}
        height={SEARCH_HEIGHT}
        knobSize={KNOB_SIZE}
        showKnob
        minFillWidth={0} // стартовать анимацию от самого начала
        style={styles.searchContainer}
        frameStyle={styles.searchFrame}
        knobStyle={styles.knobStyle}
        borderColor={tokens.textPrimary}
        fillColor={tokens.accent}
        knobColor="transparent"
        duration={5000}
        onFinish={onFinish}
        knobContent={<Image source={magnifyingGlass} style={styles.magnifyingGlass} />}
      />
    </ImageBackground>
  );
};

export const SplashScreen = memo(SplashScreenComponent);
SplashScreen.displayName = 'SplashScreen';

const getStyles = (tokens: Record<string, string>) =>
  // LEGACY STYLES: contains hardcoded typography values
  StyleSheet.create({
    // Корневой контейнер сплэша: фон+градиент, на весь экран
    container: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      backgroundColor: tokens.bgPanel,
    },
    // Верхний градиент-оверлей (цветовые токены из theme)
    gradientOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    // Логотип в центре экрана (с заданной шириной/высотой)
    logo: {
      position: 'absolute',
      width: LOGO_WIDTH,
      height: LOGO_HEIGHT,
      left: (SCREEN_WIDTH - LOGO_WIDTH) / 2,
      top: LOGO_TOP,
      resizeMode: 'contain',
    },
    // Контейнер прогресс-бара (BottomLoader) — расположен внизу
    searchContainer: {
      position: 'absolute',
      left: SEARCH_LEFT,
      top: SEARCH_TOP,
    },
    // Рамка прогресс-бара
    searchFrame: {
      borderRadius: s(30),
    },
    // Стиль бегунка (кнопки) прогресс-бара
    knobStyle: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
    },
    // Иконка лупы внутри бегунка
    magnifyingGlass: {
      width: KNOB_SIZE,
      height: KNOB_SIZE,
      resizeMode: 'contain',
      marginLeft: -s(330),
      marginTop: -s(-30),
    },
  });
