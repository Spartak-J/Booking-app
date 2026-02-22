import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

import { typography } from '@/theme';
import { useTheme } from '@/theme';

type Variant = keyof typeof typography;

type Tone =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'onAccent'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error';

export type TypographyProps = {
  variant?: Variant;
  tone?: Tone;
  style?: StyleProp<TextStyle>;
} & TextProps;

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  tone = 'primary',
  style,
  allowFontScaling = true,
  maxFontSizeMultiplier = 1.4,
  ...rest
}) => {
  const { tokens } = useTheme();
  const variantStyle = typography[variant] as TextStyle;
  const colorStyle: TextStyle = {
    color:
      tone === 'primary'
        ? tokens.textPrimary
        : tone === 'secondary'
          ? tokens.textSecondary
          : tone === 'muted'
            ? tokens.textSecondary
            : tone === 'onAccent'
              ? tokens.textOnAccent
              : tone === 'accent'
                ? tokens.accent
                : tone === 'success'
                  ? tokens.success
                  : tone === 'warning'
                    ? tokens.warning
                    : tokens.error,
  };

  return (
    <Text
      style={[variantStyle, colorStyle, style]}
      allowFontScaling={allowFontScaling}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
    />
  );
};

export default Typography;
