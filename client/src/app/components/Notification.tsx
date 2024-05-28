import { useEffect } from 'react'
import { useStateContext, initState } from '@/app/provider/StateContextProvider';
import { IState } from '@/app/type/Contract'
import { NotificationType } from '../../../constants';
var tmpState:any = null
const Notification = () => {

  const { state, updateState } = useStateContext();
  tmpState = state
  const onClickYesHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    state.notificationParam.yesCallback.apply
    closeNotification()
  }

  const onClickCancelHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    state.notificationParam.cancelCallback.apply
    closeNotification()
  }

  const closeNotification= () => {
    tmpState = { ...tmpState, showNotification: false }
    updateState(tmpState)
  }

  useEffect(() => {
    console.log('Component re-rendered!', state);
    console.log(state.notificationParam)
  }, [state]);

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">

      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                {state.notificationParam.noticeType == NotificationType.DENGER && (
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
                )}
                {state.notificationParam.noticeType == NotificationType.INFO && (
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-lime-200 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-lime-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path></svg>
                </div>
                )}
                {state.notificationParam.noticeType == NotificationType.WARNING && (
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
                )}
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">{state.notificationParam.title}</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{state.notificationParam.message}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              {state.notificationParam.showYes && (
                <button type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" onClick={onClickYesHandler}>{state.notificationParam.yesTitle}</button>
              )}
              {state.notificationParam.showCancel && (
                <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={onClickCancelHandler}>{state.notificationParam.noTitle}</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
