import {
  Commitment,
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import wallet from "/Users/imaad/.config/solana/id.json";
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("2D6WxJeu5QqA9TNJgXSpT9TPycTXuMH2Mtn5LHQHuUUg");

// Recipient address
const to = new PublicKey("8B4GAymrndhnForBxv5AD6ybc3ngtoRGStckZmeNT2Su");

(async () => {
  try {
    // Get the token account of the fromWallet address, and if it does not exist, create it
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey,
    );
    // Get the token account of the toWallet address, and if it does not exist, create it
    const toWalletata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to,
    );
    // Transfer the new token to the "toTokenAccount" we just created
    const tx = await transfer(
      connection,
      keypair,
      ata.address,
      toWalletata.address,
      keypair,
      1000000, // amount of tokens to transfer (in the smallest unit, so if your token has 6 decimals, this would be 1000000 for 1 token)
    );
    console.log(tx);
    console.log("Transfer successful! Transaction signature:", tx);
  } catch (e) {
    console.error(`Oops, something went wrong: ${e}`);
  }
})();
