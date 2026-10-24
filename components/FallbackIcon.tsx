import { Text, type StyleProp, type TextStyle } from 'react-native';

type FallbackIconName =
  | 'search'
  | 'swap-vertical'
  | 'home'
  | 'shopping-cart'
  | 'person'
  | 'map'
  | 'caret-right'
  | 'phone'
  | 'credit-card'
  | 'left'
  | 'heart-outline'
  | 'star'
  | 'trash';

const glyphMap: Record<FallbackIconName, string> = {
  search: '⌕',
  'swap-vertical': '⇅',
  home: '⌂',
  'shopping-cart': '🛒',
  person: '👤',
  map: '⌖',
  'caret-right': '›',
  phone: '☎',
  'credit-card': '💳',
  left: '←',
  'heart-outline': '♡',
  star: '★',
  trash: '🗑',
};

export default function FallbackIcon({
  name,
  size = 24,
  color = '#000',
  style,
}: {
  name: FallbackIconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}) {
  return (
    <Text
      style={[
        {
          color,
          fontSize: size,
          lineHeight: size + 6,
          includeFontPadding: false,
          textAlign: 'center',
        },
        style,
      ]}
    >
      {glyphMap[name] ?? '•'}
    </Text>
  );
}
