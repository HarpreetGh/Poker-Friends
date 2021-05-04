const GC = require('./Game/GameController');
// Highest Hand Finding Function Test Cases
test('findHighestHand() given 2 players with the same rank - Card Rank 10', () => {
  expect(findHighestHand([[{suit:'heart', value:'10'}, {suit: 'diamond', value:'4'}],[{suit:'spade', value:'5'},{suit:'diamond', value:'9'}]], [0, 1])).toBe(0);
});

test('findHighestHand() given 3 players with the same rank - Card Rank 8', () => {
  expect(findHighestHand([[{suit:'club', value:'J'}, {suit: 'diamond', value:'3'}],[{suit:'spade', value:'J'},{suit:'diamond', value:'A'}],[{suit:'heart', value:'J'}, {suit: 'club', value:'Q'}]], [0, 1, 2])).toBe(1);
});

test('findHighestHand() given 4 players with the same rank - Card Rank 9', () => {
  expect(findHighestHand([[{suit:'heart', value:'A'}, {suit: 'heart', value:'2'}],[{suit:'club', value:'5'},{suit:'diamond', value:'9'}],[{suit:'diamomd', value:'10'}, {suit: 'club', value:'4'}],[{suit:'club', value:'A'}, {suit: 'diamond', value:'A'}]], [0, 1, 2, 3])).toBe(3);
});


// Hand Rankings 1-10
// 1
test('isRoyalFlush() given the player hand is NOT a royal flush', () => {
  expect(isRoyalFlush([{suit:'heart', value:'A'}, {suit:'diamond', value:'K'}, {suit:'diamond', value:'Q'}, {suit:'diamond', value:'J'}, {suit:'diamond', value:'9'}, {suit:'club', value:'4'}, {suit:'spade', value:'10'}], 0)).toBeFalsy();
});

test('isRoyalFlush() given the player hand is a royal flush', () => {
  expect(isRoyalFlush([{suit:'heart', value:'K'}, {suit:'heart', value:'Q'}, {suit:'heart', value:'J'}, {suit:'heart', value:'A'}, {suit:'heart', value:'10'}, {suit:'heart', value:'4'}, {suit:'club', value:'3'}], 0)).toBeTruthy();
});

// 2
test('isStraightFlush() given the player hand is NOT a straight flush', () => {
  expect(isStraightFlush([{suit:'spade', value:'2'}, {suit:'spade', value:'4'}, {suit:'spade', value:'3'}, {suit:'spade', value:'5'}, {suit:'spade', value:'7'}, {suit:'spade', value:'9'}, {suit:'heart', value:'10'}], 0)).toBeFalsy();
});

test('isStraightFlush() given the player hand is a straight flush', () => {
  expect(isStraightFlush([{suit:'club', value:'9'}, {suit:'club', value:'10'}, {suit:'club', value:'J'}, {suit:'club', value:'Q'}, {suit:'club', value:'K'}, {suit:'diamond', value:'4'}, {suit:'diamond', value:'5'}], 0)).toBeTruthy();
});

// 3
test('isFourOfKind() given the player hand is NOT a is a four of a kind', () => {
  expect(isFourOfKind([{suit:'spade', value:'3'}, {suit:'heart', value:'9'}, {suit:'diamond', value:'9'}, {suit:'club', value:'9'}, {suit:'club', value:'4'}, {suit:'diamond', value:'5'}, {suit:'spade', value:'A'}], 0)).toBeFalsy();
});

test('isFourOfKind() given the player hand is a four of a kind', () => {
  expect(isFourOfKind([{suit:'spade', value:'2'}, {suit:'heart', value:'2'}, {suit:'diamond', value:'2'}, {suit:'club', value:'2'}, {suit:'spade', value:'4'}, {suit:'diamond', value:'5'}, {suit:'spade', value:'A'}], 0)).toBeTruthy();
});

// 4
test('isFullHouse() given the player hand is NOT a full house', () => {
  expect(isFullHouse([{suit:'heart', value:'Q'}, {suit:'spade', value:'Q'}, {suit:'diamond', value:'J'}, {suit:'diamond', value:'A'}, {suit:'club', value:'A'}, {suit:'club', value:'2'}, {suit:'spade', value:'8'}], 0)).toBeFalsy();
});

test('isFullHouse() given the player hand is a full house', () => {
  expect(isFullHouse([{suit:'heart', value:'Q'}, {suit:'spade', value:'Q'}, {suit:'diamond', value:'Q'}, {suit:'diamond', value:'K'}, {suit:'club', value:'K'}, {suit:'club', value:'3'}, {suit:'spade', value:'10'}], 0)).toBeTruthy();
});

// 5
test('isFlush() given the player hand is NOT a flush', () => {
  expect(isFlush([{suit:'heart', value:'A'}, {suit:'heart', value:'8'}, {suit:'heart', value:'4'}, {suit:'heart', value:'5'}, {suit:'club', value:'K'}, {suit:'diamond', value:'2'}, {suit:'spade', value:'J'}], 0)).toBeFalsy();
});

test('isFlush() given the player hand is a flush', () => {
  expect(isFlush([{suit:'heart', value:'A'}, {suit:'heart', value:'J'}, {suit:'heart', value:'9'}, {suit:'heart', value:'4'}, {suit:'heart', value:'2'}, {suit:'diamond', value:'3'}, {suit:'spade', value:'K'}], 0)).toBeTruthy();
});

// 6
test('isStraight() given the player hand is NOT a straight', () => {
  expect(isStraight([{suit:'club', value:'A'}, {suit:'club', value:'J'}, {suit:'club', value:'Q'}, {suit:'club', value:'K'}, {suit:'club', value:'10'}, {suit:'diamond', value:'2'}, {suit:'heart', value:'5'}], 0)).toBeFalsy();
});

test('isStraight() given the player hand is a straight', () => {
  expect(isStraight([{suit:'club', value:'9'}, {suit:'diamond', value:'8'}, {suit:'heart', value:'7'}, {suit:'spade', value:'6'}, {suit:'diamond', value:'5'}, {suit:'club', value:'2'}, {suit:'club', value:'J'}], 0)).toBeTruthy();
});

// 7
test('isThreeOfKind() given the player hand is NOT a three of a kind', () => {
  expect(isThreeOfKind([{suit:'spade', value:'8'}, {suit:'heart', value:'8'}, {suit:'diamond', value:'8'}, {suit:'club', value:'8'}, {suit:'', value:'4'}, {suit:'diamond', value:'5'}, {suit:'spade', value:'A'}], 0)).toBeFalsy();
});

test('isThreeOfKind() given the player hand is a three of a kind', () => {
  expect(isThreeOfKind([{suit:'diamond', value:'5'}, {suit:'club', value:'Q'}, {suit:'club', value:'2'}, {suit:'heart', value:'2'}, {suit:'heart', value:'2'}, {suit:'spade', value:'4'}, {suit:'diamond', value:'J'}], 0)).toBeTruthy();
});

// 8
test('isTwoPair() given the player hand is NOT a two pair', () => {
  expect(isTwoPair([{suit:'heart', value:'J'}, {suit:'spade', value:'J'}, {suit:'spade', value:'A'}, {suit:'heart', value:'5'}, {suit:'diamond', value:'8'}, {suit:'heart', value:'10'}, {suit:'diamond', value:'4'}], 0)).toBeFalsy();
});

test('isTwoPair() given the player hand is a two pair', () => {
  expect(isTwoPair([{suit:'heart', value:'4'}, {suit:'club', value:'4'}, {suit:'club', value:'A'}, {suit:'diamond', value:'A'}, {suit:'spade', value:'J'}, {suit:'heart', value:'5'}, {suit:'diamond', value:'Q'}], 0)).toBeTruthy();
});

// 9
test('isOnePair() given the player hand is NOT a pair', () => {
  expect(isOnePair([{suit:'heart', value:'5'}, {suit:'spade', value:'5'}, {suit:'club', value:'8'}, {suit:'diamond', value:'J'}, {suit:'heart', value:'4'}, {suit:'club', value:'3'}, {suit:'diamond', value:'5'}], 0)).toBeFalsy();
});

test('isOnePair() given the player hand is a pair', () => {
  expect(isOnePair([{suit:'diamond', value:'J'}, {suit:'heart', value:'2'}, {suit:'club', value:'7'}, {suit:'heart', value:'A'}, {suit:'heart', value:'J'}, {suit:'diamond', value:'5'}, {suit:'club', value:'4'}], 0)).toBeTruthy();
});

// 10
test('isHighCard() given the player hand is NOT a high card', () => {
  expect(isHighCard([{suit:'club', value:'8'}, {suit:'spade', value:'4'}, {suit:'heart', value:'3'}, {suit:'club', value:'2'}, {suit:'spade', value:'8'}, {suit:'diamond', value:'A'}, {suit:'heart', value:'J'}], 0)).toBeFalsy();
});

test('isHighCard() given the player hand is a high card', () => {
  expect(isHighCard([{suit:'heart', value:'3'}, {suit:'club', value:'5'}, {suit:'diamond', value:'J'}, {suit:'heart', value:'8'}, {suit:'spade', value:'4'}, {suit:'heart', value:'A'}, {suit:'spade', value:'10'}], 0)).toBeTruthy();
});