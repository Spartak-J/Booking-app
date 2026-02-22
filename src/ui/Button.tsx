import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  StyleSheet,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import { fontSizes, radius, spacing, typography } from '@/theme';
import { useTheme } from '@/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title?: string;
  onPress: (e: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
}

const sizePadding: Record<ButtonSize, { vertical: number; horizontal: number; fontSize: number }> =
  {
    small: { vertical: spacing.xs, horizontal: spacing.md, fontSize: fontSizes.caption },
    medium: { vertical: spacing.sm, horizontal: spacing.lg, fontSize: fontSizes.body },
    large: { vertical: spacing.md, horizontal: spacing.xl, fontSize: fontSizes.subtitle },
  };

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  children,
}) => {
  const { tokens } = useTheme();
  const padding = sizePadding[size];

  const buttonStyle: ViewStyle = {
    paddingVertical: padding.vertical,
    paddingHorizontal: padding.horizontal,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      variant === 'primary'
        ? tokens.accent
        : variant === 'secondary'
          ? tokens.bgPanel
          : 'transparent',
    borderWidth: variant === 'ghost' ? 1 : 0,
    borderColor: variant === 'ghost' ? tokens.border : 'transparent',
  };

  const labelStyle: TextStyle = {
    ...(typography.body as TextStyle),
    fontSize: padding.fontSize,
    color: variant === 'primary' ? tokens.textOnAccent : tokens.textPrimary,
  };

  const content = children ?? (
    <Text
      style={[labelStyle, textStyle]}
      numberOfLines={1}
      ellipsizeMode="tail"
      adjustsFontSizeToFit
      minimumFontScale={0.8}
      allowFontScaling
      maxFontSizeMultiplier={1.4}
    >
      {title}
    </Text>
  );

  return (
    <TouchableOpacity
      style={[buttonStyle, (isLoading || disabled) && styles.disabled, style]}
      onPress={onPress}
      disabled={isLoading || disabled}
    >
      {isLoading ? <ActivityIndicator color={tokens.textOnAccent} /> : content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
