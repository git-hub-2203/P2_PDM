import { Alert, Platform } from 'react-native';

export type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

export function showAlert(title: string, message?: string, buttons?: AlertButton[]) {
  if (Platform.OS === 'web') {
    const content = [title, message].filter(Boolean).join('\n');

    if (buttons && buttons.length > 0) {
      const primaryButton = buttons.find((button) => button.style !== 'cancel') ?? buttons[0];
      const secondaryButton = buttons.find((button) => button.style === 'cancel') ?? buttons[buttons.length - 1];
      const choice = window.confirm(`${content}\n\nOpções: ${buttons.map((button) => button.text).join(' | ')}`);

      if (choice) {
        primaryButton?.onPress?.();
      } else {
        secondaryButton?.onPress?.();
      }
      return;
    }

    window.alert(content);
    return;
  }

  Alert.alert(title, message, buttons);
}
