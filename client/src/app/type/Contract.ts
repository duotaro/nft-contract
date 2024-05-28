import NotificationParam from '@/app/type/NotificationParam'

export interface IState {
    currentAccount: string | null;
    messageValue: string;
    nftBalance: number;
    loading: boolean;
    showNotification: boolean;
    notificationParam:NotificationParam;
}

export type StateContextType = {
    state: IState;
    updateState: (state: IState) => void;
};