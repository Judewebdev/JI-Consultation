"use client";

import { Button } from "./ui";

/**
 * Certificates are printed or saved as PDF straight from the browser — the
 * print stylesheet in globals.css switches the page to A4 landscape and hides
 * everything except the certificate itself.
 */
export function PrintButton({ label = "Print or save as PDF" }: { label?: string }) {
  return (
    <Button type="button" onClick={() => window.print()}>
      {label}
    </Button>
  );
}
