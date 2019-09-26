import * as shajs from 'sha.js';

export abstract class Guid {

    private static createRandomStrings(): Array<string> {
        let ret: Array<string> = new Array<string>();
        let numOfStrings = Math.floor(Math.random() * 40) + 10;
        for (var i = 0; i < numOfStrings; i++) {
            let str: string = "";
            let dt = new Date();
            let s1 = dt.getMilliseconds();
            str = shajs('sha256').update(s1).digest('hex');
            let s2 = Math.floor(Math.random() * 10000000000) + 1;
            str = shajs('sha256').update(str + s2).digest('hex');
            let s3 = Math.floor(Math.random() * 10000000000) + 1;
            str = shajs('sha256').update(str + s3).digest('hex');
            let s4 = Math.floor(Math.random() * 10000000000) + 1;
            str = shajs('sha256').update(str + s4).digest('hex');
            ret.push(str);
        }
        return ret;
    }

    public static newGuid(strs?: Array<string> | null): string {
        if (!strs || !strs.length) {
            strs = this.createRandomStrings();
        } else {
            strs = [...strs, ...this.createRandomStrings()];
        }

        let ret: string = "";

        for (var i = 0; i < 20; i++) {
            let num = Math.floor(Math.random() * strs.length);
            ret = shajs('sha256').update(ret + strs[num]).digest('hex');
            let ms = new Date().getMilliseconds() * (Math.floor(Math.random() * 10000000000) + 1);
            ret = shajs('sha256').update(ret + ms).digest('hex');
        }

        return ret;
    }
}


