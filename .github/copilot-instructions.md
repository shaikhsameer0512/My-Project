# Copilot Instructions for Bucks2Bar

## Project Overview
- **Bucks2Bar** is a single-page web app for visualizing monthly income and expenses as a bar chart.
- The app consists of two main files: `index.html` (UI, Bootstrap, Chart.js) and `script.js` (logic, data handling, chart rendering).

## Architecture & Data Flow
- **UI**: Built with Bootstrap 5, using a tabbed interface for data entry and chart display.
- **Data**: User inputs monthly income/expense in a table. Data is read from form inputs by `script.js`.
- **Chart**: Chart.js renders a bar chart in the Chart tab, updating live as data changes.
- **Download**: Users can download the chart as a PNG via a custom button.

## Key Patterns & Conventions
- **Form Inputs**: Each month’s income/expense input is named as `income-<i>`/`expense-<i>` (0-based index for Jan–Dec).
- **Data Extraction**: Use `getDataFromInputs()` in `script.js` to collect all form data.
- **Chart Update**: Chart is updated on tab switch or input change if the Chart tab is active.
- **No Build Step**: This project is pure HTML/JS/CSS—no build tools, package managers, or test runners.
- **External Dependencies**: Bootstrap and Chart.js are loaded via CDN in `index.html`.

### UI Elements
- All button must be pink color.

## Developer Workflow
- **Edit UI**: Modify `index.html` for layout, tabs, or styling.
- **Edit Logic**: Update `script.js` for data handling, chart logic, or new features.
- **Live Preview**: Open `index.html` in a browser to test changes. No local server required.
- **Debugging**: Use browser dev tools (Console, Elements, Network) for troubleshooting.

## Examples
- To add a new data field, update both the table in `index.html` and the logic in `script.js`.
- To change chart appearance, adjust Chart.js config in `renderChart()` in `script.js`.

## References
- Main files: [`index.html`](../index.html), [`script.js`](../script.js)
- External: [Bootstrap 5](https://getbootstrap.com/), [Chart.js](https://www.chartjs.org/)

---
For major changes, keep UI and logic in sync. Document any new conventions here for future agents.