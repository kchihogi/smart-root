import { ButtonText } from "./button";
import { Icon } from "./icon";
import { Pressable } from "./pressable";
import { VStack } from "./vstack";
import { useTheme } from "../contexts/ThemeContext";

interface FooterButtonProps {
    title: string;
    icon: any;
    onPress: () => void;
    onLongPress?: () => void;
};

export const FooterButton: React.FC<FooterButtonProps> = ({ title, icon, onPress, onLongPress }) => {
    const {theme} = useTheme() as any;
    return (
        <Pressable onPress={onPress} onLongPress={onLongPress}>
            <VStack space="xs" alignItems="center" justifyContent="center">
                <Icon
                    as={icon}
                    size="xl"
                    primaryTheme={theme}
                />
                <ButtonText
                    primaryTheme={theme}
                >{title}</ButtonText>
            </VStack>
        </Pressable>
    );
};

export default FooterButton;
