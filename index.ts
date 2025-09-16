// <p id=ruby></p>
function findLCS(s1: string, s2: string) {
  const n = s1.length;
  const m = s2.length;
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(m + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = 1 + dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp; // Return the DP table for reconstruction
}
type DiffItem = {
  type: "common" | "added" | "deleted";
  value: string;
};

function getDiff(s1: string, s2: string) {
  const dp = findLCS(s1, s2);
  let i = s1.length;
  let j = s2.length;

  const diff: DiffItem[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && s1[i - 1] === s2[j - 1]) {
      diff.unshift({ type: "common", value: s1[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({ type: "added", value: s2[j - 1] });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diff.unshift({ type: "deleted", value: s1[i - 1] });
      i--;
    }
  }
  return diff;
}

function furiganaSewer(reading: string, experssion: string) {
  return getDiff(experssion, reading)
    .reduce(
      (acc, { type, value }) => (
        acc.at(-1) && acc.at(-1)!.type === type
          ? (acc.at(-1)!.value += value)
          : acc.push({ type, value }),
        acc
      ),
      [] as DiffItem[],
    )

    .reduce(
      (acc, { type, value }) => (
        acc.at(-1) && acc.at(-1)!.type === "deleted" && type === "added"
          ? (acc.at(-1)!.value =
              `<ruby>${acc.at(-1)!.value}<rt>${value}</rt></ruby>`)
          : acc.push({ type, value }),
        acc
      ),
      [] as DiffItem[],
    )

    .map(
      ({ type, value }) =>
        ({
          added: "" + value,
          common: value,
          deleted: "" + value,
        })[type],
    )
    .join(" ");
}
