function expectedScore(rA, rB) {
  return 1 / (1 + Math.pow(10, (rB - rA) / 400));
}

function updateRating(rOld, rOpp, result, k = 32) {
  const we = expectedScore(rOld, rOpp);
  const rn = Math.round(rOld + k * (result - we));
  return rn;
}

module.exports = { expectedScore, updateRating };