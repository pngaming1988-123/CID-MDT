// Website equivalent of ER-DetectiveMDT's config.lua. Secrets (database
// credentials) come from environment variables / a .env file -- see
// .env.example -- so this file is safe to commit.
const env = process.env;

module.exports = {
  port: parseInt(env.PORT || '3000', 10),

  // Point this at the SAME database the FiveM server's oxmysql uses (the
  // mysql_connection_string in server.cfg) and the in-game Evidence Lab's
  // test results show up in the website's Lab Results tab automatically.
  // Every detectivemdt_* table is created/migrated at startup if missing.
  databaseUrl: env.DATABASE_URL || '',

  // Set TRUST_PROXY=1 when running behind nginx/Cloudflare/etc. so login
  // rate limiting sees the visitor's real IP instead of the proxy's.
  trustProxy: env.TRUST_PROXY || false,

  session: {
    cookieName: 'cid_session',
    // Set COOKIE_SECURE=true once the site is served over HTTPS.
    secure: env.COOKIE_SECURE === 'true',
    lifetimeHours: 12,
  },

  pin: {
    minLength: 4,
    maxLength: 8,
  },

  // Website replacement for the in-game job grade. Every account has one of
  // these grades; supervisors set it from the Registered Officers tab.
  // Rename/add entries to match your department's ranks.
  grades: [
    { grade: 0, label: 'Officer' },
    { grade: 1, label: 'Detective' },
    { grade: 2, label: 'Sergeant' },
    { grade: 3, label: 'Lieutenant' },
    { grade: 4, label: 'Captain' },
    { grade: 5, label: 'Chief' },
  ],

  // Who can post/delete dashboard announcements: this grade and up.
  announcements: {
    minGrade: 2,
  },

  // Who can approve new accounts, change grades, edit officer names and
  // remove access in the Registered Officers tab: any of these exact grades
  // (an exact-match list, not a "this grade and up" threshold).
  officerManagement: {
    grades: [4, 5],
  },

  // Anyone can fill in the Create Account form on the login screen. With
  // requireApproval on, the new account can't log in until a supervisor
  // approves it. The very first account ever created is always approved and
  // given the highest grade above, so there's someone to approve the rest.
  registration: {
    enabled: true,
    requireApproval: true,
  },

  // Failed logins per collar number (per IP) before that combination is
  // locked out for lockoutMinutes.
  login: {
    maxAttempts: 5,
    lockoutMinutes: 10,
  },

  caseStatuses: ['open', 'wip', 'closed'],
  casePriorities: ['low', 'medium', 'high'],
};
