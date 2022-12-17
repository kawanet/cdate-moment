import {strict as assert} from "assert";

import moment from "moment";
import {cdate} from "cdate";
import {cdateMoment} from "../index.js";

const cmoment = cdate(0).plugin(cdateMoment).momentFn();

describe(`100`, () => {
    it(`SYNOPSIS`, () => {
        runTest((dt) => moment(dt));
        runTest((dt) => cmoment(dt));

        function runTest(moment) {
            assert.equal(moment([2022, 0, 1]).format("YYYY-MM-DD"), "2022-01-01");

            assert.equal(moment("2022-01-01").endOf("year").format("YYYY-MM-DD"), "2022-12-31");
        }
    });
});