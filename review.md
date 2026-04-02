# Review

## Readme
Is this tool intended to be used by others, or just you, or is it purely a professional portfolio piece?

### Intended to be used by others
* Add a CONTRIBUTING.md
* Ensure the readme contains information about how to build, run and deploy the application.

### Just you / portfolio piece
Good for this purpose, will provide some feedback / suggested changes in the readme.

## Choice of tools, libraries, frameworks
Nextjs is a fine choice for this use case.
Not a lot to say in this regard, the app is fairly straightforward without a lot of packages. All the libraries are fair choices.

## Security
No concerns here, though I'd need to look into supabase best practices.
Your main threat vectors are auth and database access.

https://supabase.com/docs/guides/database/secure-data
https://supabase.com/docs/guides/database/postgres/row-level-security

I'd recommend creating a specific user within postgres for the admin actions that only has access to perform specific actions (don't use the root admin). You can utilise stored procedures if you want to lock this down further. (maybe supabase does this for you already? dunno, haven't worked with it)

Make sure you santize every user input before passing it to supabase (unless they happen to do it for you)

## Front end
React code is generally very clean. Not much to add here.

## Backend
nextjs blurs the lines of backend a little, given SSR, hydration, and server components.
There's some small amounts of refactoring possible for the libs, but nothing major.

## IaC
I don't see any db migrations / DDL for your database structure, something to consider adding.

## Scalability
Given the technologies used, this app could scale quite easily.
I'd need to look into how supabase does provisioning, but my assumption is that this could handle into the many thousands of users without issue.

## CI/CD
Vercel handles that for you realistically, its one of their selling points.

## Monitoring
Same goes for monitoring and logging, vercel and presumably supabase probably does a lot of this for you.
If you host this for others to use then you could also add something like `posthog` or `google analytics` to gather additional user behaviour information.
