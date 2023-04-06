export const logSystem = new class LogSystem {
    private _logs: (string | {})[] = [];

    get logs() { 
        return this._logs;
    }

    log(args: string | {}) { 
        this._logs.push(args);

        if (typeof args === 'string') {
            console.log(`🔥 ${log}`);
        } else {
            console.log(`🔥`, args);
        }
    }

    clear() { 
        this._logs = [];
    }
}

export const log = (args: string | {}) => logSystem.log(args);