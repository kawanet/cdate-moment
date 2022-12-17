/**
 * cdate-moment
 * @see https://github.com/kawanet/cdate-moment
 */

const momentFn = (base) => {
    const cdate = base.cdateFn();

    const moment = (dt) => {
        if (Array.isArray(dt)) {
            const integer = x => (+x | 0);
            dt = new Date(integer(dt[0]), integer(dt[1]), integer(dt[2]) || 1, integer(dt[3]), integer(dt[4]), integer(dt[5]), integer(dt[6]));
        } else if ("string" === typeof dt && dt.length === 8) {
            dt = dt.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3");
        }
        return cdate(dt);
    };

    moment.utc = (dt) => {
        return moment(dt).utc();
    };

    moment.unix = (second) => {
        return moment(+second * 1000);
    };

    return moment;
}

/** @type {cdate.Plugin} */
export const cdateMoment = (Parent) => {
    const c = class extends Parent {
        momentFn() {
            return momentFn(this);
        }

        add(diff, unit) {
            if ("number" === typeof diff) {
                return super.add(diff, unit);
            }
            if ("object" === typeof diff) {
                let self = this;
                Object.keys(diff).forEach(key => (self = self.add(diff[key], key)));
                return self;
            }
        }

        subtract(diff, unit) {
            if ("number" === typeof diff) {
                return super.add(-diff, unit);
            }
            if ("object" === typeof diff) {
                let self = this;
                Object.keys(diff).forEach(key => (self = super.add(-diff[key], key)));
                return self;
            }
        }

        diff(target, unit, round) {
            let diff = (+this) - (+target);
            unit = String(unit).replace(/s$/, "");
            if (unit === "second") diff /= 1000;
            if (unit === "minute") diff /= 1000 * 60;
            if (unit === "hour") diff /= 1000 * 60 * 60;
            if (unit === "day" || unit === "d") diff /= 1000 * 60 * 60 * 24;
            if (unit === "week") diff /= 1000 * 60 * 60 * 24 * 7;

            if (unit === "month") {
                diff = monthDiff(this, target);
            }

            if (unit === "quarter") {
                diff = monthDiff(this, target) / 3;
            }

            if (unit === "year") {
                diff = monthDiff(this, target) / 12;
            }

            if (!round) {
                if (diff < 0) {
                    diff = Math.ceil(diff);
                } else {
                    diff = Math.floor(diff);
                }
            }
            return diff;
        }

        isSame(target, unit) {
            if (unit) {
                return !this.diff(target, unit);
            }
            return +this === +target;
        }

        isValid() {
            return !isNaN(+this);
        }

        format(fmt) {
            if (fmt == null) {
                return super.format("YYYY-MM-DDTHH:mm:ssZ").replace(/\+00:00$/, "Z");
            }
            return super.format(fmt);
        }

        unix() {
            return Math.floor(+this / 1000);
        }

        toISOString() {
            return this.utc().text("%Y-%m-%dT%H:%M:%S.%LZ");
        }

        daysInMonth() {
            return this.endOf("month").date();
        }

        clone() {
            return this.create(+this);
        }
    }

    const proto = c.prototype;

    ["years", "months", "date", "days", "hours", "minutes", "seconds", "milliseconds"].forEach(unit => {
        const withoutS = unit.replace(/s$/, "");
        proto[unit] = proto[withoutS] = function(value) {
            const current = this.get(unit);
            if (value == null) return current;
            return this.add(value - current, unit);
        };
    });

    return c;
};

/**
 * Copyright (c) JS Foundation and other contributors
 * @see https://github.com/moment/moment/blob/develop/src/lib/moment/diff.js#L54
 */

function monthDiff(a, b) {
    if (a.date() < b.date()) {
        // end-of-month calculations work correct when the start month has more
        // days than the end month.
        return -monthDiff(b, a);
    }
    // difference in months
    const wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());

    // b is in (anchor - 1 month, anchor + 1 month)
    let anchor = a.add(wholeMonthDiff, 'months');
    let anchor2;
    let adjust;

    if (b - anchor < 0) {
        anchor2 = a.add(wholeMonthDiff - 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor - anchor2);
    } else {
        anchor2 = a.add(wholeMonthDiff + 1, 'months');
        // linear across the month
        adjust = (b - anchor) / (anchor2 - anchor);
    }

    //check for negative zero, return zero if negative zero
    return -(wholeMonthDiff + adjust) || 0;
}
