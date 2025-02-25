const scoreMap: Record<string, number> = {
  // TODO describe this
  "1234": 24,
  "1243": 23,
  "1324": 22,
  "2134": 21,
  "2143": 20,
  "1342": 19,
  "1423": 18,
  "2314": 17,
  "1432": 16,
  "3124": 15,
  "3214": 14,
  "3142": 13,
  "2413": 12,
  "2341": 11,
  "2431": 10,
  "4123": 9,
  "3241": 8,
  "3412": 7,
  "4132": 6,
  "4213": 5,
  "4231": 4,
  "3421": 3,
  "4312": 2,
  "4321": 1,
};

export function getUserScore(userRanking: string) {
  return scoreMap[userRanking];
}
