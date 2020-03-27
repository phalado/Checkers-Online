function makeId(length) {
  // const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const characters = '0123456789';
  let id = '';
  for (let i = 0; i < length; i += 1) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}

export default makeId;
