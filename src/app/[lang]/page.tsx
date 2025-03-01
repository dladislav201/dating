"use client";

import { Gallery } from "@/components/";
// import { useTranslation } from "@/hooks";

export default function HomePage() {
  // const t = useTranslation();

  return (
    <main className="main">
      <section>
        <Gallery>{<li></li>}</Gallery>
      </section>
    </main>
  );
}
