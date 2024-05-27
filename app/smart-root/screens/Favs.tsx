import * as React from 'react';
import {
    Button, ButtonGroup, ButtonText, Box, Center, HStack, Icon
    , VStack
    , ScrollView
    , useToast
} from '../components';
import * as LUCIDE from "lucide-react-native";

//Internal components
import { FavsSaveModal } from "../components/FavsSaveModal";
import { ToastMessage } from "../components/ToastMessage";
import { useTheme } from '../contexts/ThemeContext';
import { useUserSettings } from "../contexts/UserSettingsContext";
import { useTranslation } from 'react-i18next';

export default function FavsScreen({ navigation }: any) {
    const { t } = useTranslation();
    const { theme } = useTheme() as any;
    const toast = useToast();
    const {favRoutes, setFavRoutes} = useUserSettings() as any;
    const [showFavsSaveModal, setShowFavsSaveModal] = React.useState(false);
    const [nameOfFavRoute, setNameOfFavRoute] = React.useState("");
    const [index, setIndex] = React.useState(0);

    const toastShow = (title: string, message: string, icon:any,  position: "top" | "top right" | "top left" | "bottom" | "bottom left" | "bottom right" | undefined, action:string) => {
        toast.show({
            placement: position,
            render: ({ id }) => {
            return (
                <ToastMessage id={id} title={title} message={message} icon={icon} onPress={() => toast.close(id)} action={action} />
            );
            },
        });
    };

    const onPressDelete = (index: any) => {
        const newFavRoutes = favRoutes.filter((route: any, i: number) => i !== index);
        setFavRoutes(newFavRoutes);
    }

    const onPressEdit = (index: any) => {
        setNameOfFavRoute(favRoutes[index].name);
        setShowFavsSaveModal(true);
        setIndex(index);
    }

    const onPressGo = (route:any) => {
        navigation.navigate(t('home'), {coordinates: route.coordinates});
    }

    const onPressSubmitSaveButton = () => {

        if (nameOfFavRoute === "") {
            toastShow(t("save-error"), t("save-error-message"), LUCIDE.X, "bottom", "error");
            return;
        }

        if (index !== null && index !== undefined && index >= 0) {
            let route = favRoutes[index];
            route.name = nameOfFavRoute;
            const newFavRoutes = [...favRoutes];
            newFavRoutes[index] = route;
            setFavRoutes(newFavRoutes);
            return;
        }
    };

    return (
        <Box>
            <ScrollView>
                <VStack rounded="$md" mx="$1" mb="$4" space="md" p="$4" theme={theme} flex={1}>
                    {favRoutes.map((route: any, index: number) => (
                        <HStack key={index}>
                            <ButtonGroup isAttached={true}>
                                <Button primaryTheme={theme} onPress={() => onPressGo(route)} w="70%" justifyContent="flex-start" >
                                    <ButtonText primaryTheme={theme} bold={true} isTruncated={true}>{route.name}</ButtonText>
                                </Button>
                                <Button primaryTheme={theme} onPress={() => onPressEdit(index)} >
                                    <Icon as={LUCIDE.Edit} theme={theme}/>
                                </Button>
                                <Button primaryTheme={theme} onPress={() => onPressDelete(index)} >
                                    <Icon as={LUCIDE.Trash} theme={theme} />
                                </Button>
                            </ButtonGroup>
                        </HStack>
                    ))}
                </VStack>
                <Center mb="$4" >
                    <Button onPress={() => navigation.navigate(t('home'))} theme={theme} w="70%">
                    <ButtonText theme={theme} size="md" bold={true}>{t('go-to-home')}</ButtonText>
                    </Button>
                </Center>
            </ScrollView>
            <FavsSaveModal showFavsSaveModal={showFavsSaveModal} setShowFavsSaveModal={setShowFavsSaveModal} nameOfFavRoute={nameOfFavRoute} setNameOfFavRoute={setNameOfFavRoute} onPressSubmitSaveButton={onPressSubmitSaveButton} />
        </Box>
    );
}
