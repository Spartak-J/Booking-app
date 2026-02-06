// Component: CachedImage. Used in: OwnerObjectsScreen.tsx, OfferOwnerInfo.tsx, OfferRoomsList.tsx….
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageProps, StyleSheet, View } from 'react-native';

import { getCachedImageUri } from '@/utils/imageCache';
import { useTheme } from '@/theme';

type Props = Omit<ImageProps, 'source'> & {
  uri: string;
};

export const CachedImage: React.FC<Props> = ({ uri, style, ...rest }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [localUri, setLocalUri] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    getCachedImageUri(uri).then((result) => {
      if (isMounted) setLocalUri(result);
    });
    return () => {
      isMounted = false;
    };
  }, [uri]);

  if (!localUri) {
    return (
      <View style={[styles.loader, style]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return <Image source={{ uri: localUri }} style={style} {...rest} />;
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    loader: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
    },
  });
