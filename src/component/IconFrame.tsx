import { Text, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { IconProps } from '@expo/vector-icons/build/createIconSet';
import { useRouter} from "expo-router"

type IconFrameProps = {
  IconComponent: React.ComponentType<IconProps<any>>; // the icon set (Ionicons, FontAwesome, etc.)
  name: string;
  color?: string;
  size?: number;
  title: string,
  pressButton: () => void
};

export default function IconFrame({
  IconComponent,
  name,
  color = '#333',
  size = 30,
  title,
  pressButton
}: IconFrameProps) {
  //const router = useRouter();

  return (
    <TouchableOpacity
      style={{
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        marginHorizontal:10,
      }}
      onPress={pressButton}
    >
      <IconComponent name={name} size={size} color={color} style={{ marginBottom:5}} />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
