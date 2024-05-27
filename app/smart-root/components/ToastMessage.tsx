import { Toast, ToastTitle, ToastDescription} from './toast';
import { Icon } from './icon';
import { Pressable } from './pressable';
import { VStack } from './vstack';

interface ToastMessageProps {
    id: string;
    title: string;
    message: string;
    icon: any;
    onPress: () => void;
    action?: string;
}

const info = {
  bg: "$tertiary",
  color: "$onTertiary",
  iconColor: "$onTertiary",
};

const error = {
  bg: "$error",
  color: "$onError",
  iconColor: "$onError",
};

export const ToastMessage: React.FC<ToastMessageProps> = ({ id, title, message, icon, onPress, action }) => {
    const toastId = "toast-" + id;
    const toastType = action === "error" ? error : info;

    return (
        <Toast bg={toastType.bg} nativeID={toastId} p="$3">
          <VStack space="xs">
            <ToastTitle color={toastType.color}>
              {title}
            </ToastTitle>
            <ToastDescription color={toastType.color}>
              {message}
            </ToastDescription>
          </VStack>
          <Pressable mt="$1" onPress={onPress}>
            <Icon as={icon} color={toastType.iconColor} size="xl" />
          </Pressable>
        </Toast>
    );
}

export default ToastMessage;
