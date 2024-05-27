import * as React from "react";

import {
    Button,
    Heading, HStack,
    Icon, Input, InputField,
    Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader,
    VStack,
    Text,
} from "../components";

import * as LUCIDE from "lucide-react-native";
import { useTranslation } from 'react-i18next';

import { useTheme } from "../contexts/ThemeContext";

interface FavsSaveModalProps {
    showFavsSaveModal: boolean;
    setShowFavsSaveModal: (value: boolean) => void;
    nameOfFavRoute: string;
    setNameOfFavRoute: (value: string) => void;
    onPressSubmitSaveButton: () => void;
};

export const FavsSaveModal: React.FC<FavsSaveModalProps> = ({ showFavsSaveModal, setShowFavsSaveModal, nameOfFavRoute, setNameOfFavRoute, onPressSubmitSaveButton }) => {
    const { theme } = useTheme() as any;
    const { t } = useTranslation();

    const onChangeText = (text: string) => {
        setNameOfFavRoute(text);
    };

    return (
        <Modal isOpen={showFavsSaveModal} onClose={() => setShowFavsSaveModal(false)} >
            <ModalBackdrop />
            <ModalContent theme={theme}>
                <ModalHeader>
                    <Heading size="lg" theme={theme}>{t("input-route-name")}</Heading>
                    <ModalCloseButton>
                        <Icon as={LUCIDE.X} theme={theme} />
                    </ModalCloseButton>
                </ModalHeader>
                <ModalBody>
                    <Input theme={theme}>
                        <InputField theme={theme} defaultValue={nameOfFavRoute} onChangeText={(text: string) => onChangeText(text)} />
                    </Input>
                </ModalBody>
                <ModalFooter borderTopWidth="$0">
                    <VStack space="lg" w="$full">
                        <Button
                            onPress={() => {
                                setShowFavsSaveModal(false);
                                onPressSubmitSaveButton();
                            }}
                            primaryTheme={theme}
                        >
                            <Text theme={theme}>{t("ok")}</Text>
                        </Button>
                    <HStack>
                        <Button
                            variant="link"
                            size="sm"
                            onPress={() => {
                                setShowFavsSaveModal(false)
                            }}
                        >
                            <Icon as={LUCIDE.ArrowLeft} theme={theme} />
                            <Text theme={theme} >{t("cancel")}</Text>
                        </Button>
                    </HStack>
                </VStack>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default FavsSaveModal;