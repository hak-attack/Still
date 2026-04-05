# Still

A calm, mobile-first journal that stays on your device. Entries are encrypted in the browser before they are saved. There are no accounts and no backend—only you and your passphrase.

## Local development

Requirements: **Node.js 20+**. The project uses **Vite 5** so local builds work on common LTS versions (including 20.18).

```bash
npm install
npm run dev
```

Open the URL Vite prints (for this project’s GitHub Pages `base`, use `http://localhost:5173/Still/`).

```bash
npm run build    # output in dist/
npm run preview  # serve production build locally
```

## Deploy to GitHub Pages

1. In [vite.config.ts](vite.config.ts), set `base` to your repository path (default: `'/Still/'` for `https://<user>.github.io/Still/`). If you use a user site repo (`<user>.github.io`), set `base: '/'`.
2. In the repo **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main`; the workflow in [.github/workflows/pages.yml](.github/workflows/pages.yml) builds and deploys `dist/`.

Routing uses the URL **hash** (`#/journal`, `#/settings`) so static hosting does not need SPA fallbacks.

## Security model (plain English)

- **What is encrypted:** The whole journal (all entries) is serialized and encrypted with **AES-GCM** using a key derived from your passphrase via **PBKDF2** (SHA-256, 250,000 iterations). Only ciphertext, salt, IV, and format metadata are stored in **IndexedDB** (with **localStorage** fallback).
- **What is not secret:** Salt and IV are stored next to the ciphertext (normal for this design). Someone with your device backup could try offline passphrase guessing.
- **What is never stored:** Your passphrase and the decrypted journal are not written to disk. After a refresh or **Lock journal**, you must unlock again.
- **Honest limits:** This is meaningful privacy for a static, client-only app—not enterprise key management. Malware or a compromised browser could read memory while the journal is unlocked. **If you forget your passphrase, the data cannot be recovered.**

## Import / export

- **Export** downloads an encrypted `.still` file (JSON envelope). It is not human-readable plaintext.
- **Import** asks for the passphrase that encrypts **that file** (it may differ from how you remember it if the backup came from another device with another journal—use the passphrase you used when you created that backup).
- **Merge** combines entries by date; if both sides have the same date, the entry with the **newer `updatedAt`** wins.
- **Replace** overwrites local storage with the backup envelope (salt and ciphertext from the file). Your current session is re-keyed to match that backup.

## PWA

A minimal [manifest](public/manifest.webmanifest) is included for “Add to Home Screen” where the browser supports it. There is no service worker offline cache in this MVP.

## License

Private / your choice—add a license file if you publish the repo.
