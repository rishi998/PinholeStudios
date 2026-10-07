import { notFound } from "next/navigation";

import { UiGallery } from "./ui-gallery";

export default function DevUiPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <UiGallery />;
}
