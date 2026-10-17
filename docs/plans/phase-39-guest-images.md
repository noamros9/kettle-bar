# Phase 39: guest images (on demand)

Photorealistic, never nude images of each woman guest, made with Grok and kept in Firebase Storage, on her own page.
**On demand:** no ticket here starts at a checkpoint; Claude builds one only when Noam names it ("do i4").

## Decisions

**The images (17 Oct 2026)**
- **456 · On demand.** Tickets are built only when Noam names one; never picked up at a checkpoint. *(17 Oct)*
- **457 · Women only, photorealistic, never nude.** Fictional adults: every prompt states her dealt age (21-45) and
  "adult woman"; no school or child-coded outfit; never a real person's name or likeness. *(17 Oct)*
- **458 · Grok CLI makes them:** `image_gen` for her portrait, `image_edit` of that portrait for each outfit, so her
  face carries (tested 17 Oct: a portrait, then an elegant edit, same face). *(17 Oct)*
- **459 · 13 images a woman:** portrait; casual, elegant, gym, lingerie, lingerie 2, slutty night out, slutty 2,
  bikini, sleepwear, office, sexy costume, festival (towel and boudoir robe dropped, Noam). *(17 Oct)*
- **460 · Every prompt names her pose,** dealt from a list per outfit (bent over, straddling, on all fours or
  kneeling, lying back or arched, plus ones that fit the outfit), so neighbours differ. *(17 Oct)*
- **461 · Firebase Storage, never the repo:** readable only by Noam's signed-in account; loaded online only, nothing
  cached on the phone. *(17 Oct)*
- **462 · Review:** Noam approves each portrait on a contact sheet; Claude checks each outfit (her face, her fields,
  dressed). Images wait in `C:/code/kb-images/` (outside the repo) until approved, then upload. *(17 Oct)*
- **463 · Her own page,** `#guests/<name>`: portrait, facts, short line, description, then the gallery (tap for full
  screen, swipe); a small round portrait on her card in the list once she has one. *(17 Oct)*
- **464 · A ticket is 3 women, A-Z** (54 tickets). *(17 Oct)*

## Tickets

| # | Ticket | Tier | Blocked by | Branch | Status |
|---|---|---|---|---|---|
| 0 | This plan | plan | – | `plan/p39-guest-images` | done (PR #522) |
| 1 | The pipeline: prompts from her fields, Grok runs, review folder, contact sheet, upload; Storage rules | feature | – | `feature/p39-image-pipeline` | on demand |
| 2 | Her page and the card's portrait, images from Storage | feature | 1 | `feature/p39-guest-page` | on demand |
| i1 | Images: Abigail, Adi, Adriana | content | 2 | `content/p39-images-1` | on demand |
| i2 | Images: Agam, Aiko, Alexis | content | 2 | `content/p39-images-2` | on demand |
| i3 | Images: Alma, Amalia, Amara | content | 2 | `content/p39-images-3` | on demand |
| i4 | Images: Amber, Amelia, Amelie | content | 2 | `content/p39-images-4` | on demand |
| i5 | Images: Anat, Antonella, Ariadne | content | 2 | `content/p39-images-5` | on demand |
| i6 | Images: Ashley, Astrid, Athena | content | 2 | `content/p39-images-6` | on demand |
| i7 | Images: Avery, Avia, Bar | content | 2 | `content/p39-images-7` | on demand |
| i8 | Images: Bianca, Brittany, Brooke | content | 2 | `content/p39-images-8` | on demand |
| i9 | Images: Bruna, Camila, Carla | content | 2 | `content/p39-images-9` | on demand |
| i10 | Images: Carmen, Catalina, Celine | content | 2 | `content/p39-images-10` | on demand |
| i11 | Images: Chantal, Charlotte, Chelsea | content | 2 | `content/p39-images-11` | on demand |
| i12 | Images: Chiara, Chloe, Coral | content | 2 | `content/p39-images-12` | on demand |
| i13 | Images: Dafna, Dana, Danielle | content | 2 | `content/p39-images-13` | on demand |
| i14 | Images: Dina, Dorin, Eden | content | 2 | `content/p39-images-14` | on demand |
| i15 | Images: Efrat, Elena, Eliana | content | 2 | `content/p39-images-15` | on demand |
| i16 | Images: Elinor, Ella, Ellie | content | 2 | `content/p39-images-16` | on demand |
| i17 | Images: Florence, Francesca, Gabriela | content | 2 | `content/p39-images-17` | on demand |
| i18 | Images: Gal, Galia, Gia | content | 2 | `content/p39-images-18` | on demand |
| i19 | Images: Grace, Hadar, Hadas | content | 2 | `content/p39-images-19` | on demand |
| i20 | Images: Hagar, Haley, Hannah | content | 2 | `content/p39-images-20` | on demand |
| i21 | Images: Harriet, Heather, Hila | content | 2 | `content/p39-images-21` | on demand |
| i22 | Images: Hodaya, Holly, Inbal | content | 2 | `content/p39-images-22` | on demand |
| i23 | Images: Inbar, Ingrid, Isabela | content | 2 | `content/p39-images-23` | on demand |
| i24 | Images: Isla, Jade, Jenna | content | 2 | `content/p39-images-24` | on demand |
| i25 | Images: Juliette, Kaori, Karin | content | 2 | `content/p39-images-25` | on demand |
| i26 | Images: Katya, Kayla, Kendall | content | 2 | `content/p39-images-26` | on demand |
| i27 | Images: Keren, Keshet, Kim | content | 2 | `content/p39-images-27` | on demand |
| i28 | Images: Kimberly, Leilani, Lia | content | 2 | `content/p39-images-28` | on demand |
| i29 | Images: Lian, Lihi, Lily | content | 2 | `content/p39-images-29` | on demand |
| i30 | Images: Lindsey, Linoy, Lior | content | 2 | `content/p39-images-30` | on demand |
| i31 | Images: Lital, Liv, Lola | content | 2 | `content/p39-images-31` | on demand |
| i32 | Images: Lotem, Luciana, Luna | content | 2 | `content/p39-images-32` | on demand |
| i33 | Images: Maayan, Madison, Manuela | content | 2 | `content/p39-images-33` | on demand |
| i34 | Images: Mariana, Maribel, Maya | content | 2 | `content/p39-images-34` | on demand |
| i35 | Images: Megan, Mei, Melissa | content | 2 | `content/p39-images-35` | on demand |
| i36 | Images: Michal, Mika, Mila | content | 2 | `content/p39-images-36` | on demand |
| i37 | Images: Monique, Moran, Morgan | content | 2 | `content/p39-images-37` | on demand |
| i38 | Images: Naama, Nala, Natali | content | 2 | `content/p39-images-38` | on demand |
| i39 | Images: Natasha, Neta, Nicole | content | 2 | `content/p39-images-39` | on demand |
| i40 | Images: Noa, Noemi, Nofar | content | 2 | `content/p39-images-40` | on demand |
| i41 | Images: Noga, Nour, Noy | content | 2 | `content/p39-images-41` | on demand |
| i42 | Images: Ofri, Paige, Paola | content | 2 | `content/p39-images-42` | on demand |
| i43 | Images: Polina, Rafaela, Riley | content | 2 | `content/p39-images-43` | on demand |
| i44 | Images: Rin, Romi, Roni | content | 2 | `content/p39-images-44` | on demand |
| i45 | Images: Rotem, Ruby, Sakura | content | 2 | `content/p39-images-45` | on demand |
| i46 | Images: Scarlett, Selin, Shai | content | 2 | `content/p39-images-46` | on demand |
| i47 | Images: Shaked, Shani, Shira | content | 2 | `content/p39-images-47` | on demand |
| i48 | Images: Shiraz, Shirin, Sierra | content | 2 | `content/p39-images-48` | on demand |
| i49 | Images: Sivan, Skylar, Sophie | content | 2 | `content/p39-images-49` | on demand |
| i50 | Images: Suki, Tal, Tamar | content | 2 | `content/p39-images-50` | on demand |
| i51 | Images: Tatiana, Tiffany, Valentina | content | 2 | `content/p39-images-51` | on demand |
| i52 | Images: Vanessa, Vera, Yaara | content | 2 | `content/p39-images-52` | on demand |
| i53 | Images: Yael, Yarden, Yasmin | content | 2 | `content/p39-images-53` | on demand |
| i54 | Images: Yuli, Ziv | content | 2 | `content/p39-images-54` | on demand |

### 1. The pipeline (456-462)
- **First:** check the Firebase project's plan. Storage buckets made after Oct 2024 need Blaze (pay as you go; the
  images, ~161 × 13 × 250 KB ≈ 520 MB, sit inside its free 5 GB). If it's Spark, stop and ask Noam to switch.
- `scripts/guest-images.js <names…>` (committed; it holds no image): builds her portrait prompt and 12 outfit prompts
  from `GUESTS` (age, height, body, tits, ass, skin, hair, eyes, ink where an outfit shows it, her job for office and
  costume ideas), deals each outfit's pose from its list (seeded, so a rerun gives the same prompts), runs headless
  `grok` per image (`--allow image_gen` / `image_edit` / `read_file`, terminal disallowed; tested 17 Oct), copies the
  result from `~/.grok/sessions/<cwd>/<session>/images/` to `C:/code/kb-images/<name>/<slot>.jpg`, and writes a
  contact sheet there. `--upload <names…>` sends approved ones to Storage `guests/<name>/<slot>.jpg` (credentials
  outside the repo, in `C:/code/kb-images/.secrets/`).
- `storage.rules`: read only for Noam's uid, write for none from the app. **Noam publishes it in the console.**
- **Test first:** the prompts for a sample woman name her age and "adult woman", her hair, skin and eyes as dealt, a
  pose from the outfit's list, and no word from a banned list (nude, naked, topless, school, teen…); the same input
  gives the same prompts; no path under the repo is ever written. **Done when:** one woman's 13 images made, viewed,
  uploaded, and readable signed in, refused signed out.

### 2. Her page (463)
- `app/pages/guest.js` (or the guests page's detail view): `#guests/<name>` shows her portrait, facts row, short line,
  description, then a gallery of what Storage has for her (listed with the signed-in user's token), tap for full screen
  with swipe; nothing cached (461). Her card in the list gets a small round portrait when she has one. A woman with no
  images looks as today.
- **Test first:** with a stubbed Storage listing, her page shows the portrait and the gallery in slot order, the full
  screen swipes, a woman without images shows no gallery; signed out shows none. **Done when:** CI green; 390 px light
  and dark, with stub images (never real ones in tests or screenshots that leave the laptop).

### i1-i54. Images, 3 women each (A-Z)
- `node scripts/guest-images.js <the three>`; Noam approves the three portraits on the contact sheet (a rejected one
  is remade, and its outfits wait); then the 36 outfits; Claude checks each (her face, her fields, dressed, the pose);
  rejects remade once, then shown to Noam; `--upload` the approved. No repo change but the ticket's status line.
- **Done when:** the three women's pages show 13 images each.

## Challenge round
- **Weakest assumption:** that Grok's `image_edit` keeps her face across 12 outfits and poses. Verified once (17 Oct:
  portrait, then elegant with a pose, same face); a full woman in ticket 1 tests it across all 12, and a drift there
  changes the plan (e.g. edits from the last good image, not the portrait).
- **What I hadn't read:** whether the Firebase project is on Blaze, which new Storage buckets need; ticket 1 checks
  before anything else. Also where `grok` puts images: in its session folder, not where asked (found 17 Oct), so the
  script copies them out.
- **Lazier version not taken:** images in the app's own repo (Noam: never in the public repo), or a Drive folder
  (more sign-in work and slower than Storage, which the app's sign-in already covers).
