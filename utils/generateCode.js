const generateCode = (codeLength) => {
  let code = "";
  const number = String(Math.random() * 10)
    .split(".")[1]
    .split("");
  const length = number.length;
  if (!codeLength) {
    return (length = 4);
  }
  for (let i = 0; i < codeLength; i++) {
    code = code + number[length - (i + 1)];
  }

  return code;
};

module.exports = generateCode;
