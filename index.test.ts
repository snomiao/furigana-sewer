import { test, expect } from "bun:test";

function findLCS(s1: string, s2: string) {
    const n = s1.length;
    const m = s2.length;
    const dp = Array(n + 1).fill(null).map(() => Array(m + 1).fill(0));

    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            if (s1[i - 1] === s2[j - 1]) {
                dp[i][j] = 1 + dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    return dp;
};

type DiffItem = {
    type: 'common' | 'added' | 'deleted';
    value: string;
};

function getDiff(s1: string, s2: string) {
    const dp = findLCS(s1, s2);
    let i = s1.length;
    let j = s2.length;

    const diff: DiffItem[] = [];

    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
            diff.unshift({ type: 'common', value: s1[i - 1] });
            i--;
            j--;
        } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
            diff.unshift({ type: 'added', value: s2[j - 1] });
            j--;
        } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
            diff.unshift({ type: 'deleted', value: s1[i - 1] });
            i--;
        }
    }
    return diff;
};

function furiganaSewer(reading: string, experssion: string) {
    return getDiff(experssion, reading)
        .reduce((acc, { type, value }) => (acc.at(-1) && acc.at(-1)!.type === type ? acc.at(-1)!.value += value : acc.push({ type, value }), acc), [] as DiffItem[])

        .reduce((acc, { type, value }) => (acc.at(-1) && acc.at(-1)!.type === 'deleted' && type === 'added' ? acc.at(-1)!.value = `<ruby>${acc.at(-1)!.value}<rt>${value}</rt></ruby>` : acc.push({ type, value }), acc), [] as DiffItem[])

        .map(({ type, value }) => ({
            added: '' + value,
            common: value,
            deleted: '' + value
        })[type])
        .join(' ')
}

test("basic furigana sewing - README example", () => {
    const reading = "かれ は えいぎょう で じっせき を あげた ん だ";
    const expression = "彼は営業で実績を上げたんだ。";
    const expected = "<ruby>彼<rt>かれ </rt></ruby> は <ruby>営業<rt> えいぎょう </rt></ruby> で <ruby>実績<rt> じっせき </rt></ruby> を <ruby>上<rt> あ</rt></ruby> げた   ん   だ 。";

    const result = furiganaSewer(reading, expression);
    expect(result).toBe(expected);
});

test("no kanji - returns original text", () => {
    const reading = "これ は テスト です";
    const expression = "これはテストです";
    const expected = "これ   は   テスト   です";

    const result = furiganaSewer(reading, expression);
    expect(result).toBe(expected);
});

test("single kanji with reading", () => {
    const reading = "ほん";
    const expression = "本";
    const expected = "<ruby>本<rt>ほん</rt></ruby>";

    const result = furiganaSewer(reading, expression);
    expect(result).toBe(expected);
});

test("mixed kanji and hiragana", () => {
    const reading = "よむ";
    const expression = "読む";
    const expected = "<ruby>読<rt>よ</rt></ruby> む";

    const result = furiganaSewer(reading, expression);
    expect(result).toBe(expected);
});

test("multiple kanji compounds", () => {
    const reading = "にほんご";
    const expression = "日本語";
    const expected = "<ruby>日本語<rt>にほんご</rt></ruby>";

    const result = furiganaSewer(reading, expression);
    expect(result).toBe(expected);
});

test("empty strings", () => {
    const result = furiganaSewer("", "");
    expect(result).toBe("");
});

test("only reading provided", () => {
    const reading = "てすと";
    const expression = "";
    const expected = "てすと";

    const result = furiganaSewer(reading, expression);
    expect(result).toBe(expected);
});

test("only expression provided", () => {
    const reading = "";
    const expression = "テスト";
    const expected = "テスト";

    const result = furiganaSewer(reading, expression);
    expect(result).toBe(expected);
});