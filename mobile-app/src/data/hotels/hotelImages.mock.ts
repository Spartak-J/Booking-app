import type { ImageSourcePropType } from 'react-native';

import type { Hotel } from '@/data/types';
import image1 from '@/assets/images/1.png';
import image2 from '@/assets/images/2.png';
import image3 from '@/assets/images/3.png';
import image4 from '@/assets/images/4.png';
import image5 from '@/assets/images/5.png';

const HOTEL_IMAGE_BY_ID: Record<string, ImageSourcePropType> = {
  'hotel-1': image1,
  'hotel-2': image2,
  'hotel-3': image3,
  'hotel-4': image4,
  'hotel-5': image5,
};

export const getHotelImageSource = (hotel: Hotel): ImageSourcePropType => {
  if (hotel.image) {
    return { uri: hotel.image };
  }
  if (hotel.images && hotel.images.length > 0) {
    return { uri: hotel.images[0] };
  }
  return HOTEL_IMAGE_BY_ID[hotel.id] ?? image1;
};
