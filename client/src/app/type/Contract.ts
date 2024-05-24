export interface IState {
    currentAccount: string | null;
    messageValue: string;
    nftBalance: number;
    loading: boolean;
}

export type StateContextType = {
    state: IState;
    updateState: (state: IState) => void;
};