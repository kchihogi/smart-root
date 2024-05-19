import {
    ButtonText, Box,
    Pressable,
    Icon,
    VStack,
} from '@gluestack-ui/themed';

interface FooterButtonProps {
    title: string;
    icon: any;
    onPress: () => void;
};

export const FooterButton: React.FC<FooterButtonProps> = ({ title, icon, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <VStack space="xs" alignItems="center" justifyContent="center">
                <Icon
                    as={icon}
                    size="xl"
                    sx={{
                        _dark: {
                            color: '$light900',
                        },
                        _light: {
                            color: '$light200',
                        },
                    }}
                />
                <ButtonText
                    sx={{
                        _dark: {
                            color: '$light900',
                        },
                        _light: {
                            color: '$light200',
                        },
                    }}
                >{title}</ButtonText>
            </VStack>
        </Pressable>
    );
};

export default FooterButton;
