function generateSessionCode(length: number): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const codeArray = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    codeArray.push(characters.charAt(randomIndex));
  }

  return codeArray.join("");
}

export default generateSessionCode;
