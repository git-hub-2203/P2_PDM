import { type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Path, Rect, Line } from 'react-native-svg';

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

const iconMap: Record<FallbackIconName, (props: { color: string; size: number }) => JSX.Element> = {
  search: ({ color, size }) => (
    <G stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="5.5" />
      <Line x1="16" y1="16" x2="21" y2="21" />
    </G>
  ),
  'swap-vertical': ({ color, size }) => (
    <G stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M8 4v12M5 7l3-3 3 3M16 20V8M19 17l-3 3-3-3" />
    </G>
  ),
  home: ({ color, size }) => (
    <G stroke={color} strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 10.5L12 3l9 7.5" />
      <Path d="M5 9.5V20h14V9.5" />
      <Path d="M10 20v-6h4v6" />
    </G>
  ),
  'shopping-cart': ({ color, size }) => (
    <G stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="9" cy="18.5" r="1.6" />
      <Circle cx="17" cy="18.5" r="1.6" />
      <Path d="M3.5 4h2l2.5 10.3h9.6l2.1-7.4H7.2" />
    </G>
  ),
  person: ({ color, size }) => (
    <G stroke={color} strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="12" cy="8" r="3.7" />
      <Path d="M5 19c1.4-3 4-4.5 7-4.5s5.6 1.5 7 4.5" />
    </G>
  ),
  map: ({ color, size }) => (
    <G stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 4.5l6 2.3 6-2.3v14.4l-6 2.3-6-2.3L3 21V6.6l6-2.1z" />
      <Path d="M9 4.5v14.4M15 6.8v14.4" />
    </G>
  ),
  'caret-right': ({ color, size }) => (
    <G stroke={color} strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 7l5 5-5 5" />
    </G>
  ),
  phone: ({ color, size }) => (
    <G stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6.5 4.5h3l1.3 4.5-2 1.7a13.5 13.5 0 0 0 8.7 8.7l1.7-2 4.5 1.3v3a2.5 2.5 0 0 1-2.5 2.5C11.9 23 1 12.1 1 6.9A2.5 2.5 0 0 1 3.5 4.5z" />
    </G>
  ),
  'credit-card': ({ color, size }) => (
    <G stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Rect x="2.8" y="5" width="18.4" height="14" rx="2.5" />
      <Path d="M2.8 9.5h18.4M6.5 14.5h3.2M12.7 14.5h3.6" />
    </G>
  ),
  left: ({ color, size }) => (
    <G stroke={color} strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M15 18l-6-6 6-6" />
    </G>
  ),
  'heart-outline': ({ color, size }) => (
    <G stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 20.5s-7.4-4.5-9.2-8.5A5.2 5.2 0 0 1 12 5.8a5.2 5.2 0 0 1 9.2 6.2C19.4 16 12 20.5 12 20.5z" />
    </G>
  ),
  star: ({ color, size }) => (
    <G stroke={color} strokeWidth="1.3" fill={color} strokeLinejoin="round">
      <Path d="M12 2.7l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L3.5 8.9l5.9-.9L12 2.7z" />
    </G>
  ),
  trash: ({ color, size }) => (
    <G stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <Path d="M4 7h16M8 7V4h8v3M6 7l1 12h10l1-12M10 11v5M14 11v5" />
    </G>
  ),
};

export default function FallbackIcon({
  name,
  size = 24,
  color = '#ffffff',
  style,
}: {
  name: FallbackIconName;
  size?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}) {
  const IconComponent = iconMap[name] ?? iconMap.search;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={style}
      stroke={color}
      fill="none"
      aria-label={name}
    >
      {IconComponent({ color, size })}
    </Svg>
  );
}