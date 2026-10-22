# Innovation Lab Events

A live events calendar for the Seattle University Innovation Lab, hosted free on GitHub Pages. Staff log in to add events and fliers, and everyone with the link sees the changes after a refresh.

**Live site:** https://su-innovation-lab.github.io/Innovation-Lab-Events/

## Features

- **Up Next (home page):** the next event is shown large with its flier, followed by upcoming events and past events.
- **Calendar:** October and November 2026, with clickable events.
- **Interest Forms:** a page of fliers for interest forms (not events).
- **Admin login:** top right. Logged-in staff can add, edit and delete events, upload PNG or JPG fliers from a phone or computer, and add or remove interest form fliers.
- **Lab wallpaper image:** a screenshot of the main page is regenerated every hour as `Lab-Desktop.jpg`, for the lab computers' desktop background.

## How it works

| Piece | What it does |
| --- | --- |
| `index.html` | The whole website (one file, no build step). |
| GitHub Pages | Hosts `index.html` and gives the public link. |
| Supabase | Free database and file storage for events, interest form fliers and the admin login. |
| GitHub Actions | Takes the hourly screenshot and saves it as `Lab-Desktop.jpg`. |

Visitors can read events and fliers. Only the logged-in admin account can change them. This is enforced by Supabase row level security, not by the page itself.

## Repo contents

```
index.html                       The site
screenshot.js                    Takes the wallpaper screenshot
.github/workflows/screenshot.yml Runs screenshot.js every hour
Lab-Desktop.jpg                  Generated image (do not edit by hand)
setup.sql                        One-time database setup (events + fliers)
setup_interest_forms.sql         One-time database setup (interest forms)
```

## Setup from scratch

1. **Supabase:** create a free project. In SQL Editor, run `setup.sql`, then `setup_interest_forms.sql`.
2. **Admin account:** in Authentication > Users, add one user (auto confirm) with the email and password the staff will use. In Authentication > Sign In / Providers, turn **off** "Allow new users to sign up".
3. **Configure the site:** at the top of the script in `index.html`, set `SUPABASE_URL`, `SUPABASE_KEY` (the publishable/anon key) and `ADMIN_EMAIL` (the email from step 2). Never use the `service_role` or secret key here.
4. **GitHub Pages:** in the repo, go to Settings > Pages, choose "Deploy from a branch", branch `main`, folder `/(root)`.
5. **Screenshot job:** go to Settings > Actions > General > Workflow permissions and choose "Read and write". Then open the Actions tab, pick "Update lab screen image" and click **Run workflow** once to create the first image.

## Using the site

- Click **Admin login** (username `Innovation`, plus the password set in Supabase).
- **Add event** tab: fill in Lead, title, date, start time and location. End time, custom time text (for example "TBD") and the flier are optional. Events without a flier display as plain events.
- Click any event, then **Edit** or **Delete**, to change it.
- **Interest forms** tab: while logged in, add a flier with an optional label, or remove one.
- Changes appear for everyone as soon as they're saved. Other visitors see them on refresh (the page also refreshes itself every minute).

## Lab computer wallpaper

The image is available at:

`https://su-innovation-lab.github.io/Innovation-Lab-Events/Lab-Desktop.jpg`

- It's a 1920x1080 screenshot of `?display=1`, a layout with no header or buttons: the current notice, the Up Next event, and the next four events.
- It refreshes hourly, though GitHub may start scheduled runs 5 to 20 minutes late. After an edit, run it manually from Actions > Update lab screen image > Run workflow.
- IT can set it as the desktop background with a scheduled task that downloads the image. The task needs to run on the logged-in user's account.
- Screens that can show a web page can use `https://su-innovation-lab.github.io/Innovation-Lab-Events/?display=1` directly, which is always live.

## Maintenance

- **Change the admin password:** Supabase dashboard > Authentication > Users. No code change needed.
- **Change the PCB Club banner:** edit the `NOTICE` line at the top of the script in `index.html`.
- **Change the months shown:** the calendar and date picker are set to October and November 2026 in `index.html`.
- **Hourly screenshots:** to run once a day instead, change the cron line in `.github/workflows/screenshot.yml` to `"0 14 * * *"`.
- **Free tier limits:** Supabase pauses free projects after about a week with no activity (use Restore project if the site shows an error). GitHub pauses scheduled jobs on repos with 60 days of no activity (re-enable in the Actions tab).

## Security notes

- The Supabase URL, publishable key and admin email are visible in the page source because the site runs in the browser. That's expected: the key only allows what the database rules allow, which is reading events and fliers.
- All staff share one login. Keep the password private and change it when someone leaves.
- Keep public sign-ups turned off in Supabase, or anyone could create an account and edit events.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| Red banner saying events could not load | Check the three values at the top of `index.html` and that `setup.sql` was run. |
| Red banner on the Interest forms tab | Run `setup_interest_forms.sql` in Supabase. |
| Old version showing | Hard refresh, or open the link in a private window. |
| Login says wrong username or password | The username must be `Innovation`, and the password must match the Supabase user. |
| Screenshot job fails | Check Workflow permissions are "Read and write", then open the failed run to see the error. |
| `Lab-Desktop.jpg` not updating | Run the workflow manually. Allow a couple of minutes for Pages to publish the new image. |
