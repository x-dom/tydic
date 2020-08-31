export default class DEvent{
    constructor(){
        this.onEvents = {};
        this.onceEvents = {};
        this.code = 0;
    };

    /**
     * 定义持续触发事件
     * @param {*} key 
     * @param {*} callBack 
     */
    on(key,callBack){
        this.code++;
        this.onEvents[key] = this.onEvents[key]||[];
        this.onEvents[key].push({
            key:key,
            callBack:callBack,
            code: this.code
        });
        return this.code;
    }

    /**
     * 定义一次性触发事件
     * @param {*} key 
     * @param {*} callBack 
     */
    once(key,callBack){
        this.code++;
        this.onceEvents[key] = this.onceEvents[key]||[];
        this.onceEvents[key].push({
            key:key,
            callBack:callBack,
            code: this.code
        });
        return this.code;
    }

    /**
     * 触发事件
     * @param {*} key 
     * @param {*} evt 
     */
    emit(key, evt){
        if(this.onEvents[key]){
            // for (let i = 0; i < this.onEvents[key].length; i++) {
            for (let i = this.onEvents[key].length-1; i >= 0; i--) {
                const event = this.onEvents[key][i];
                if(event.callBack){
                    event.callBack(evt);
                }
            }
        }
        if(this.onceEvents[key]){
            for (let i = this.onEvents[key].length-1; i >= 0; i--) {
            // for (let i = 0; i < this.onceEvents[key].length; i++) {
                const event = this.onceEvents[key][i];
                if(event.callBack){
                    event.callBack(evt);
                }
            }
            this.onceEvents[key] = [];
        }
    }

    /**
     * 按类型和编号取消事件
     * @param {*} key 
     * @param {*} code 
     */
    un(key, code){
        if(this.onEvents[key]){
            let newArr = [];
            for (let i = 0; i < this.onEvents[key].length; i++) {
                const event = this.onEvents[key][i];
                if(event.code != code){
                    newArr.push(event);
                }
            }
            this.onEvents[key] = newArr;
        }
        if(this.onceEvents[key]){
            let newArr = [];
            for (let i = 0; i < this.onceEvents[key].length; i++) {
                const event = this.onceEvents[key][i];
                if(event.code != code){
                    newArr.push(event);
                }
            }
            this.onceEvents[key] = newArr;
        }
    }

    /**
     * 按类型取消事件
     * @param {*} key 
     */
    unByKey(key){
        if(this.onEvents[key]){
            let newArr = [];
            this.onEvents[key] = newArr;
        }
        if(this.onceEvents[key]){
            let newArr = [];
            this.onceEvents[key] = newArr;
        }
    }

    /**
     * 按编号取消事件
     * @param {*} code 
     */
    unByCode(code){
        for (const key in this.onEvents) {
            if (this.onEvents.hasOwnProperty(key)) {
                const arr = this.onEvents[key];
                let newArr = [];
                for (let i = 0; i < arr.length; i++) {
                    const event = arr[i];
                    if(event.code != code){
                        newArr.push(event);
                    }
                }
                this.onEvents[key] = newArr;
            }
        }
       
        for (const key in this.onceEvents) {
            if (this.onceEvents.hasOwnProperty(key)) {
                const arr = this.onceEvents[key];
                let newArr = [];
                for (let i = 0; i < arr.length; i++) {
                    const event = arr[i];
                    if(event.code != code){
                        newArr.push(event);
                    }
                }
                this.onceEvents[key] = newArr;
            }
        }
    }

    /**
     * 清空事件
     */
    clear(){
        this.onEvents = {};
        this.onceEvents = {};
    }
}