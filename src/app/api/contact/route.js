import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function badRequest(message) {
    return NextResponse.json({ ok: false, message }, { status: 400 });
}

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            name,
            email,
            company,
            budget,
            date,
            details,
            consent,
        } = body || {};

        if (!name || typeof name !== "string") return badRequest("Name is required");
        if (!email || typeof email !== "string") return badRequest("Email is required");
        if (!company || typeof company !== "string") return badRequest("Company is required");
        if (!budget || typeof budget !== "string") return badRequest("Budget is required");
        if (!date || typeof date !== "string") return badRequest("Date is required");
        if (consent !== true) return badRequest("Consent is required");

        const from = process.env.EMAIL_FROM;
        const to = process.env.EMAIL_TO;

        if (!process.env.RESEND_API_KEY) return NextResponse.json({ ok: false, message: "Missing RESEND_API_KEY" }, { status: 500 });
        if (!from || !to) return NextResponse.json({ ok: false, message: "Missing EMAIL_FROM/EMAIL_TO" }, { status: 500 });

        const subject = `New contact form — ${name} (${company})`;

        const textEmail = [
            `Name: ${name}`,
            `Email: ${email}`,
            `Company: ${company}`,
            `Budget: ${budget}`,
            `Dates: ${date}`,
            `Details: ${details || "-"}`,
        ].join("\n");

        const htmlEmail = `
      <h2>New contact request</h2>
      <ul>
        <li><strong>Name:</strong> ${escapeHtml(name)}</li>
        <li><strong>Email:</strong> ${escapeHtml(email)}</li>
        <li><strong>Company:</strong> ${escapeHtml(company)}</li>
        <li><strong>Budget:</strong> ${escapeHtml(budget)}</li>
        <li><strong>Dates:</strong> ${escapeHtml(date)}</li>
        <li><strong>Details:</strong> ${escapeHtml(details || "-")}</li>
      </ul>
    `;

        const { data, error } = await resend.emails.send({
            from,
            to,
            subject,
            text: textEmail,
            html: htmlEmail,
            replyTo: email,
        });

        if (error) {
            return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
        }

        return NextResponse.json({ ok: true, id: data?.id });
    } catch (e) {
        return NextResponse.json({ ok: false, message: "Server error" }, { status: 500 });
    }
}

function escapeHtml(str) {
    return String(str)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
