import { NotificationType } from "../../../constants";

class NotificationParam {
    title:string = '';
    message:string = '';
    yesTitle:string = '';
    showYes:boolean = true
    noTitle:string = ''; 
    showCancel:boolean = true;
    noticeType:string = NotificationType.DENGER;
    yesCallback:Function = () => {}
    cancelCallback:Function = () => {}
    constructor(title:string, message:string, yesTitle:string, showYes:boolean, noTitle:string, showCancel:boolean, noticeType:string, yesCallback:Function, cancelCallback:Function){
        this.title = title  
        this.message = message
        this.yesTitle = yesTitle
        this.showYes = showYes
        this.noTitle = noTitle
        this.showCancel = showCancel
        this.noticeType = noticeType
        this.yesCallback = yesCallback
        this.cancelCallback = cancelCallback
    }
}

export default NotificationParam