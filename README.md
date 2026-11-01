# CID Website — Detective MDT

The ER-DetectiveMDT tablet as a standalone website. Officers create their MDT account on the website (collar number + PIN) instead of in-game, then log in from any browser.

Everything from the in-game MDT is here: Dashboard + announcements, Cases, Lab Results, the Database (case files → suspects → charges/photos/addresses), Automatic Reports, Reports, Warrant Requests and Registered Officers.

## Setup

1. Install [Node.js](https://nodejs.org) 22.9 or newer.
2. Copy `.env.example` to `.env` and set `DATABASE_URL`.
   - Use the **same database as your FiveM server** (the `mysql_connection_string` in `server.cfg`) so items tested at the in-game Evidence Lab show up in **Lab Results**, and existing MDT data/accounts carry over.
   - Any MySQL/MariaDB works. Every `detectivemdt_*` table is created/migrated automatically on start.
3. `npm install`
4. `npm start` → open http://localhost:3000

## Accounts

- **Create Account** is on the login screen. New accounts are **pending** until a supervisor approves them in **Registered Officers**.
- The **very first account** ever created is approved automatically at the highest rank. Register yours first.
- Ranks (grades) are set per account in Registered Officers and control permissions — see `config.js`:
  - `announcements.minGrade` — post/delete announcements (default: Sergeant and up)
  - `officerManagement.grades` — approve/reject accounts, change ranks, edit names, remove access (default: Captain, Chief)
- Accounts already made in-game keep working with their old PIN (upgraded to a stronger hash on first login). They start at grade 0 — promote someone from the command line if needed:

  ```
  npm run set-grade -- <collar> <grade>
  ```

- Removing an officer's access signs them out immediately. Changing your PIN signs out your other devices.
- 5 wrong PINs for a collar locks that collar out for 10 minutes (per IP).

## What stays in FiveM

The Evidence Lab Testing station and all crime-scene forensics (blood, casings, prints, `/evidencephoto`) need the player's in-game inventory and position, so they remain in the ER-DetectiveMDT resource. Results it writes appear on the website's Lab Results tab, where they can be tagged with a case and pulled into reports.

The in-game "Take Photo" mugshot button doesn't exist on the website — add photos by image link.

## Going live

- Serve it over HTTPS (e.g. nginx or a Cloudflare tunnel in front of port 3000), then set `COOKIE_SECURE=true`.
- Behind a reverse proxy, set `TRUST_PROXY=1` so login lockouts see real visitor IPs.
- Hosted databases often only accept connections from approved IPs — allow the machine running this site.
- To stop in-game account creation entirely, disable the MDT tablet part of ER-DetectiveMDT (the `/cidmdt` command) and keep only its forensics/lab.

## Layout

```
config.js            ranks, permissions, PIN rules (config.lua equivalent)
server/index.js      web server + /api/request dispatcher (main.lua)
server/auth.js       accounts, sessions, approval (auth.lua)
server/db.js         schema + migrations (db.lua)
server/*.js          cases, records, reports, warrants, announcements, lab
public/              the MDT front-end
scripts/set-grade.js command-line rank/approval tool
```
