SecureGate — Reflection & Engineering Analysis
Olagunju Anuoluwapo Blessing
Cohort: Design to MVP Bootcamp
Live URL: (https://securegate-eta.vercel.app/)
GitHub Repo: (https://github.com/Semilore22/Securegate)
Part 1#
SecureGate is a standalone authentication app built with Next.js, TypeScript, Prisma and PostgreSQL. I implemented sign up, login, email verification using Resend, forgot password flow, rate limiting, and a protected dashboard. 
Part 2#
The hardest part was getting email verification to work in production. I initially used Resend but discovered that without a domain name, Resend can only send emails to the email address i registered with. This blocked my verification flow for other users. I switched to Nodemailer to get around this limitation.
Path 3#
https://docs.google.com/document/d/17Y1BCoEhtP6lfd5BdjqBpSuwjOTaiDHY2Z3kpo6NY2M/edit?usp=drivesdk
Part 4#
One thing i will refactor in SecureGate is to include a logout functionality. Currently it doesn't have that because i was not properly coordinated because of some errors i ran into while creating the project. This works for now but becomes a real problem as the app grows. A user has no way to sign out. If I were to fix it I would add a signOut call from NextAuth in the dashboard.
Part 5#
Building SecureGate changed how I think about errors. Before this I would write the happy path and pray that the code does not broke. But now i learnt how to actively troubleshoot and just be patient because antigravity was slow today. Although the app still needs more work i am glad i got the email verification right at leats. Working under a strict time limit also taught me to build in stages, get something working first, then tighten it.