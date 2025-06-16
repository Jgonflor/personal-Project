# Music Journal

## Known Limitations

### GitHub-Triggered Restarts & CI/CD Delays

- **What happens:** Each time you push to GitHub, Netlify and Render rebuilds and restarts the backend. During that window, requests can fail or hang until the server is back online.
- **Symptoms:** 404s or timeouts immediately after a deploy.

Also divided into different folders so the online services have an easier time on running the necessary things they may need.
