# FAANG-Style CV PDFs

This is a personal fork of [career-ops](https://github.com/career-ops-hq/career-ops), an open-source job-search toolkit created by [Santiago Fernández de Valderrama](https://github.com/santifer). The project’s tools and workflows provide the starting point for this fork.

## What this fork changes

CV PDFs use a clean, single-column, black-and-white layout inspired by the FAANGPath/Jake resume format. The layout is designed to keep experience easy to scan and compatible with applicant-tracking systems.

## Generate a PDF

Install the project dependencies, then run:

```sh
node generate-pdf.mjs input.html output.pdf --format=letter
```

Use `--format=a4` for A4 paper. Career-ops CV HTML uses the canonical layout; unrelated HTML is rendered as supplied.

## Credit and license

The underlying project is [career-ops](https://github.com/career-ops-hq/career-ops). This fork retains its [MIT license](LICENSE) and [trademark policy](TRADEMARK.md). The career-ops name and branding identify the original project; this fork is not an official release.
