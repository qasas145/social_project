class Calc{
    constructor (year, month, day, hour, minute, second) {
        this.year = year;
        this.month = month;
        this.day=day;
        this.hour=hour;
        this.minute=minute;
        this.second=second
    }
    CalcT(year, month, day, hour, minute, second) {
        if (year-this.year==0) {
            if (month-this.month==0) {
                if ((day-this.day)==0) {
                    if ((hour-this.hour)==0) return <div className="dateTimeDiv">{Math.abs(minute-this.minute)} m</div>
                    else if (Math.abs(hour-this.hour)==1 && Math.abs(minute-this.minute)<=60) return <div className="dateTimeDiv">{Math.abs(minute-this.minute)}</div>
                    else if (Math.abs(minute-this.minute)==59 || Math.abs(minute-this.minute)==60) return <div className="dateTimeDiv">{Math.abs(hour-this.hour)}</div>
                    return <div className="dateTimeDiv">{Math.abs(hour-this.hour)} h</div>
                }
                else {
                    if (Math.abs(day-this.day)==1) {
                        if (Math.abs(hour-this.hour)<=24) return <div className="dateTimeDiv">{Math.abs((24-hour)+this.hour)} h</div>
                    }
                    return <div className="dateTimeDiv">{Math.abs(day-this.day)} d</div>
                }
            }
            else {
                return <div className="dateTimeDiv">{month}/{day}</div>
            }
        }
        else {
            return <div className="dateTimeDiv">{year}/{month}/{day}</div>
        }
    }
    CalcForMsgs(year, month, day) {
        if (year-this.year===0) {
            if (month-this.month===0) {
                if (Math.abs(day-this.day)==1) {
                    return <span className="date-number">Yesterday</span>
                }
                else if (day-this.day===0) {
                    return <span className="date-number">Today</span>
                }
                else {
                    return (
                        <span className="date-number">
                            <span>{month}/</span>
                            <span>{day}</span>
                        </span>
                    )
                }
            }
            else {
                return (
                    <span className="date-number">
                        <span>{year}/</span>
                        <span>{month}/</span>
                        <span>{day}</span>
                    </span>
                )
            }
        }
        else {
            return (
                <span>
                    <span>year/</span>
                    <span>month/</span>
                    <span>day</span>
                </span>
            )
        }
    }
    CalcForStateActive(year, month, day, hour, minute, second, index) {
        if (year-this.year===0) {
            if (month-this.month===0) {
                if (Math.abs(day-this.day)==1) {
                    return <p key={index}>Yesterday at {hour}.{minute}</p>
                }
                else if (day-this.day===0) {
                    return <p key={index}>{hour}.{minute}</p>
                }
                else {
                    return (
                        <p key={index}>{day}/{month}</p>
                    )
                }
            }
            else {
                return (
                    <p key={index}>{day}/{month}/{year}</p>
                )
            }
        }
    }
}
export default Calc;