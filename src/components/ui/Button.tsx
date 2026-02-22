// src/ui/Button.tsx
// Component: Button

import React from 'react';
import { Pressable, ViewStyle } from 'react-native';
import { Typography, type TypographyProps } from '@/ui/Typography';
import { useTheme } from '@/theme';

export type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textVariant?: TypographyProps['variant'];
};

const Button = ({ title, onPress, disabled, style, textVariant = 'subtitle' }: ButtonProps) => {
  const { tokens } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          backgroundColor: tokens.accent,
          borderRadius: 12,
          paddingVertical: 14,
          alignItems: 'center',
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
    >
      <Typography variant={textVariant} tone="onAccent">
        {title}
      </Typography>
    </Pressable>
  );
};

export default Button;
