export const logSystem = new class LogSystem {
    private _logs: string[] = [];

    get logs() { 
        return this._logs;
    }

    log(...args: any[]) { 
        const log = args.join(' ');

        this._logs.push(log);

        console.log(`🔥 ${log}`);
    }

    clear() { 
        this._logs = [];
    }
}

export const log = (...args: any[]) => logSystem.log(args);