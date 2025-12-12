import { createClient } from "@/prismicio";
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";

export default async function Home() {
  const client = createClient();

  let page;

  try {
    page = await client.getSingle("homepage");
  } catch (e) {
    return (
      <main style={{ padding: "4rem", fontFamily: "sans-serif" }}>
        <h1>Homepage is not set up yet</h1>
        <p>
          Открой Slice Machine, создай singleton custom type
          <code> homepage </code>
          и запушь его в Prismic. Потом создай и опубликуй документ "Homepage".
        </p>
      </main>
    );
  }

  return (
    <main>
      <SliceZone slices={page.data.slices ?? []} components={components} />
    </main>
  );
}
