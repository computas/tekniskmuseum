import { Injectable } from '@angular/core';

export enum LogLevel {
    Debug = 1,
    Info = 2,
    Warn = 3,
    Error = 4,
    Fatal = 5,
}

@Injectable({
  providedIn: 'root',
})
export class LoggingService {

    private location = "logging"


    log(msg: any, level: LogLevel ) {
        const levelName = LogLevel[level];
        const logDetails = "[" + levelName + "] " + new Date() + ": " + JSON.stringify(msg)
        console.log(logDetails);

        let values: String[] = [];

        try { 
            const storeLogs = localStorage.getItem(this.location);
            if (storeLogs){
                values = JSON.parse(storeLogs) as string[]; 
            }
            values.unshift(logDetails)

            if (values.length > 10) {
                values.length = 10;
            }

            localStorage.setItem(this.location, JSON.stringify(values));
            
        } catch (ex) {
            console.log(ex);
        }
    }

    debug(msg: string) {
        this.log(msg, LogLevel.Debug);
    }
    
    info(msg: string) {
        this.log(msg, LogLevel.Info);
    }
    
    warn(msg: string) {
        this.log(msg, LogLevel.Warn);
    }
    
    error(msg: string) {
        this.log(msg, LogLevel.Error);
    }
    
    fatal(msg: string) {
        this.log(msg, LogLevel.Fatal);
    }

    get_logs(): string[]{
        const storeLogs = localStorage.getItem(this.location);
            if (storeLogs){
                return JSON.parse(storeLogs) as string[]; 
            }
            return []
    }

    
}