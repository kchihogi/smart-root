import * as React from 'react';
import {Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback} from "react-native";
import { 
  AlertDialog, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, AlertDialogCloseButton
  , Button, ButtonGroup, ButtonText, Box, Center, HStack, Heading, Icon, Text, Input, InputField
  , Switch
  , VStack
  , Select, SelectIcon, SelectItem, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicatorWrapper, SelectDragIndicator
  ,Slider, SliderTrack, SliderFilledTrack, SliderThumb
} from '../components';
import * as LUCIDE from "lucide-react-native";

//Internal components
import { useConstants } from "../utils/constants";
import { useUserSettings } from "../contexts/UserSettingsContext";
import { useTheme } from '../contexts/ThemeContext';
import i18n from '../i18n/i18n';
import { useTranslation } from 'react-i18next';

export default function SettingsScreen({ navigation }: any) {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme() as any;
  const {userSettings, setUserSettings} = useUserSettings() as any;
  const {reloadUnits} = useConstants();
  const [isInputValid, setIsInputValid] = React.useState(true);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setUserSettings({...userSettings, language: lng});
  }

  const [showAlertDialog, setShowAlertDialog] = React.useState(false);
  const [language, setLanguage] = React.useState(userSettings.language) as any;

  const onValueChange = (value: string) => {
    if (value === userSettings.language) return;
    setLanguage(value);
    setShowAlertDialog(true);
  }

  const onMarkerPlus = () => {
    if (userSettings.num_of_markers >= userSettings.max_markers) return;
    setUserSettings({...userSettings, num_of_markers: userSettings.num_of_markers + 1});
  }

  const onMarkerMinus = () => {
    if (userSettings.num_of_markers <= 1) return;
    setUserSettings({...userSettings, num_of_markers: userSettings.num_of_markers - 1});
  }

  const onChangeInputValue = (text: string) => {
    if (isNaN(Number(text))) {
      setIsInputValid(false);
    } else {
      if (Number(text) < 1 || Number(text) > 200) {
        setIsInputValid(false);
        return;
      }
      setIsInputValid(true);
      setUserSettings({...userSettings, walk_speed: Math.floor(Number(text))});
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={"height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Box>
          <VStack rounded="$md" mx="$4" mb="$4" space="md" p="$4" theme={theme}>

            <HStack h="$16" alignItems="center" space="md">
              <Icon as={LUCIDE.SunMoon} size="xl" theme={theme} />
              <VStack w="30%">
                <Text theme={theme} bold={true}>{t('theme')}</Text>
                <Text theme={theme}>{theme === 'light' ? t('light') : t('dark')} {t('mode')}</Text>
              </VStack>
              <Switch onValueChange={ () => { setTheme(theme === 'light' ? 'dark' : 'light');} } value={theme === 'dark'} defaultValue={theme === 'light'} size="md" />
              <Text theme={theme} size="sm" isTruncated={true} w="$32">{t('enable-dark-mode')}</Text>
            </HStack>

            <HStack h="$16" alignItems="center" space="md">
              <Icon as={LUCIDE.Gauge} size="xl" theme={theme} />
              <VStack w="30%">
                <Text theme={theme} bold={true}>{t('walk-speed')}</Text>
                <HStack space="sm" alignItems="center">
                  <Input size="sm" w="$16 text-align: center" theme={theme} variant="outline" isDisabled={false} isInvalid={isInputValid ? false : true} isReadOnly={false}>
                    <InputField
                      defaultValue={userSettings.walk_speed.toString()}
                      inputMode="numeric"
                      keyboardType="numeric"
                      onChangeText={(text) => { onChangeInputValue(text) }}
                      theme={theme}
                    />
                  </Input>
                  <Text size="xs" mt="$4" theme={theme}>m/s</Text>
                </HStack>
              </VStack>
              <Center w="$48">
                  <Slider
                    step={1}
                    sliderTrackHeight={4}
                    value={userSettings.walk_speed}
                    maxValue={200}
                    minValue={1}
                    onChange={v => {
                      setUserSettings({...userSettings, walk_speed: Math.floor(v)});
                    }}>
                    <SliderTrack>
                      <SliderFilledTrack />
                    </SliderTrack>
                    <SliderThumb/>
                  </Slider>
              </Center>
            </HStack>

            <HStack h="$16" alignItems="center" space="md">
              <Icon as={LUCIDE.MapPin} size="xl" theme={theme} />
              <Text theme={theme} bold={true}>{t('map-pin')}</Text>
              <Center w="$48">
                <HStack space="sm">
                  <Button onPress={onMarkerMinus} primaryTheme={theme} size="sm" isDisabled={userSettings.max_markers <= 1}>
                    <Text theme={theme} size="xl" bold={true}>-</Text>
                  </Button>
                  <Text theme={theme} size="xl" w="$16" textAlign="center">{userSettings.num_of_markers}</Text>
                  <Button onPress={onMarkerPlus} primaryTheme={theme} size="sm" isDisabled={userSettings.max_markers <= 1}>
                    <Text theme={theme} size="xl" bold={true}>+</Text>
                  </Button>
                  </HStack>
              </Center>
            </HStack>
            <Text theme={theme} size="xs">{t('explains-map-pin')}</Text>

            <HStack h="$16" alignItems="center" space="md">
              <Icon as={LUCIDE.Languages} size="xl" theme={theme} />
              <VStack w="30%">
                <Text theme={theme} bold={true}>{t('language')}</Text>
                <Text theme={theme}>{t(userSettings.language)}</Text>
              </VStack>
              <Select onValueChange={onValueChange} isDisabled={true}>
                <Select.Trigger variant="outline" w="$40" theme={theme}>
                  <Select.Input placeholder={t(userSettings.language)} defaultValue={userSettings.language} theme={theme} value={t(language)} />
                  <SelectIcon mr="$6">
                    <Icon as={LUCIDE.ChevronDown}  size="lg" theme={theme} />
                  </SelectIcon>
                </Select.Trigger>
                <SelectPortal>
                    <SelectBackdrop/>
                    <SelectContent bg="$tertiary">
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="English" value="en" />
                      <SelectItem label="Español" value="es" />
                      <SelectItem label="简体中文" value="zh-CN" />
                      <SelectItem label="繁體中文" value="zh-TW" />
                      <SelectItem label="Français" value="fr" />
                      <SelectItem label="Deutsch" value="de" />
                      <SelectItem label="日本語" value="ja-JP" />
                      <SelectItem label="Português" value="pt-BR" />
                      <SelectItem label="Русский" value="ru" />
                      <SelectItem label="العربية" value="ar" />
                      <SelectItem label="한국어" value="ko" />
                    </SelectContent>
                  </SelectPortal>
              </Select>
            </HStack>
            <AlertDialog
              isOpen={showAlertDialog}
              onClose={() => {
                setShowAlertDialog(false);
                setLanguage(userSettings.language);
              }}
            >
              <AlertDialogBackdrop />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <Heading size='lg'>{t('change-language-alert-title')}</Heading>
                  <AlertDialogCloseButton>
                    <Icon as={LUCIDE.X} size="md" theme={theme} />
                  </AlertDialogCloseButton>
                </AlertDialogHeader>
                <AlertDialogBody>
                  <Text size='sm'>
                    {t('change-language-alert-message')}
                  </Text>
                </AlertDialogBody>
                <AlertDialogFooter>
                <ButtonGroup space="lg">
                  <Button
                    variant="outline"
                    action="secondary"
                    onPress={() => {
                      setShowAlertDialog(false);
                      setLanguage(userSettings.language);
                    }}
                  >
                    <ButtonText>{t('cancel')}</ButtonText>
                  </Button>
                  <Button
                    bg='$error600'
                    action="negative"
                    onPress={() => {
                      setShowAlertDialog(false);
                      changeLanguage(language);
                      reloadUnits();
                    }}
                  >
                    <ButtonText>{t('yes')}</ButtonText>
                  </Button>
                  </ButtonGroup>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </VStack>
          <Center>
            <Button onPress={() => navigation.navigate(t('home'))} theme={theme} w="70%">
              <ButtonText theme={theme} size="md" bold={true}>{t('go-to-home')}</ButtonText>
            </Button>
          </Center>
        </Box>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
