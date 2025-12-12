import { createClient } from "@/prismicio";
import { PrismicRichText } from "@prismicio/react";
import "./styles.scss";

export default async function PrivacyPolicyPage() {
    const client = createClient();

    const page = await client.getSingle("privacy_policy");

    return (
        <main>
            <div className="container">
                <div className="privacy-policy">
                    <h1>{page.data.title || "Privacy Policy"}</h1>
                    <PrismicRichText field={page.data.text} />
                </div>
            </div>

        </main>
    );
}
