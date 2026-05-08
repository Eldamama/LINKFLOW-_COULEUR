export async function verifyTransaction(hash, expectedWallet, requiredAmount) {
  const API_URL = `https://api.bscscan.com/api?module=transaction&action=gettxinfo&txhash=${hash}&apikey=TON_API_KEY`;

  const response = await fetch(API_URL);
  const tx = await response.json();

  if (!tx.success) return false;
  if (Number(tx.amount) < requiredAmount) return false;
  if (tx.to.toLowerCase() !== expectedWallet.toLowerCase()) return false;

  return true;
}
