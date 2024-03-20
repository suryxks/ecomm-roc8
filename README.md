# Roc8 - Moonshot

## Tech Stack

- [Next.js](https://nextjs.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)
- Resend (For emails)
- Postgres

## Authentication

This Project uses session based authentication , whenever an user does signin or Login a
session with userId is created in the database and the session is stored in http only secure cookie which cannot be assigned by client side javascript.

The browser attaches the session cookie with all the requests going to the backend and for the protected routes if there is no session cookie with the request it is failed.

Password are hashed and stored in database using [bycrypt](https://www.npmjs.com/package/bcryptjs)

Email verification is done using [@epic-web/totp](https://github.com/epicweb-dev/totp) which gives utilities to Create and verify cryptographically secure Time-based One-time Passwords (TOTP) using the HMAC-based One-time Password [(HOTP)](https://www.ietf.org/rfc/rfc4226.txt) algorithm

## DB design
