export interface IState {
    currentAccount: string | null;
    messageValue: string;
    list: string[];
    loading: boolean;
}

export type StateContextType = {
    state: IState;
    updateState: (state: IState) => void;
};