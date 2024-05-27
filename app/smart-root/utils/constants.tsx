import React, { createContext, useContext, ReactNode } from "react";
import { useTranslation } from 'react-i18next';

interface Unit {
    label: string;
    value: string;
}

export enum UNIT_INDEX {
    minutes,
    hours,
    m,
    Km,
}

export const TOKYO_REGION = {
    latitude: 35.689521,
    longitude: 139.691704,
};

export const REGION_DELTA = {
    latitudeDelta: 0.0460,
    longitudeDelta: 0.0260,
};

export const EVENT_COUNT_THRESHOLD_FOR_REGION_CHANGE = 20;
export const EVENT_COUNT_THRESHOLD_FOR_HAND_WRITING = 5;
export const MAP_FIT_ANIMATION_DURATION = 500;
export const MAP_PAN_DRAG_END_DELAY = 500;

interface ConstantsContextType {
    units: Unit[];
    setUnits: (units: Unit[]) => void;
    reloadUnits: () => void;
}

const ConstantsContext = createContext<ConstantsContextType | undefined>(undefined);

export const ConstantsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { t } = useTranslation();
    const [units, setUnits] = React.useState<Unit[]>([
        { label: t('minutes-label'), value: 'minutes' },
        { label: t('hours-label'), value: 'hours' },
        { label: t('meter-label'), value: 'm' },
        { label: t('kilometer-label'), value: 'Km' }
    ]);

    const reloadUnits = () => {
        setUnits([
            { label: t('minutes-label'), value: 'minutes' },
            { label: t('hours-label'), value: 'hours' },
            { label: t('meter-label'), value: 'm' },
            { label: t('kilometer-label'), value: 'Km' }
        ]);
    };

    return (
        <ConstantsContext.Provider value={{ units, setUnits, reloadUnits }}>
            {children}
        </ConstantsContext.Provider>
    );
};

export const useConstants = () => {
    const context = useContext(ConstantsContext);
    if (!context) {
        throw new Error("useConstants must be used within a ConstantsProvider");
    }
    return context;
};
