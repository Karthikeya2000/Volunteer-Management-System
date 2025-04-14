import {DateTime, Settings} from 'luxon';
Settings.defaultZone = 'EST';

export default class DateHandler {
    getDate(date: string) {
        return DateTime.fromISO(date);
    }
    changeToISOFormat(date: string) {
        return DateTime.fromFormat(date, 'MM/dd/yyyy').toISO() || '';
    }
    changeToDbFormat(date: string) {
        return DateTime.fromISO(date).toFormat('MM/dd/yyyy') || '';
    }
}