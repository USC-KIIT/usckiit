// Supabase Edge Function: sends HACK-A-BOT 3.0 Squad Pass confirmation email
// from a personal Gmail account using Gmail SMTP (App Password).
//
// Deploy:
//   supabase functions deploy send-hackabot-pass --no-verify-jwt
// Set secrets:
//   supabase secrets set GMAIL_USER=yourname@gmail.com GMAIL_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx

import nodemailer from "npm:nodemailer@6.9.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PassEmailPayload {
  passId: string;
  teamName: string;
  trackTitle: string;
  sdgCodes: string[];
  leaderName: string;
  leaderEmail: string;
  totalMembers: number;
  passPngBase64?: string | null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const gmailUser = Deno.env.get("GMAIL_USER");
    const gmailAppPass = Deno.env.get("GMAIL_APP_PASSWORD");
    if (!gmailUser || !gmailAppPass) {
      return new Response(
        JSON.stringify({ error: "GMAIL_USER or GMAIL_APP_PASSWORD secret is not configured." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = (await req.json()) as PassEmailPayload;
    if (!body.leaderEmail || !body.teamName || !body.passId) {
      return new Response(
        JSON.stringify({ error: "Missing required pass fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: gmailUser,
        pass: gmailAppPass,
      },
    });

    const slug = body.teamName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const attachments =
      body.passPngBase64 && body.passPngBase64.startsWith("data:image/png;base64,")
        ? [
            {
              filename: `hackabot-3-pass-${slug || "squad"}.png`,
              content: body.passPngBase64.replace(/^data:image\/png;base64,/, ""),
              encoding: "base64",
            },
          ]
        : [];

    const html = `
      <div style="background:#090A0F;color:#FAF6EE;font-family:Arial,sans-serif;padding:32px;border-radius:16px;max-width:620px;margin:auto;border:1px solid #FA4616;">
        <p style="color:#FA4616;font-size:11px;letter-spacing:2px;margin:0 0 8px;">USC KIIT • HACK-A-BOT 3.0 OFFICIAL SQUAD PASS</p>
        <h1 style="margin:0 0 6px;font-size:28px;color:#FAF6EE;">${body.teamName.toUpperCase()}</h1>
        <p style="margin:0 0 20px;color:#3D9960;font-weight:bold;font-size:13px;">STATUS: REGISTERED ✓ • PASS ID: ${body.passId}</p>
        <div style="background:#12141D;padding:18px;border-radius:12px;border:1px solid rgba(250,246,238,0.12);font-size:14px;line-height:1.7;">
          <div><strong>Team Leader:</strong> ${body.leaderName}</div>
          <div><strong>Track:</strong> ${body.trackTitle}</div>
          <div><strong>Squad Size:</strong> ${body.totalMembers} / 5 Members</div>
          <div><strong>Aligned UN SDGs:</strong> ${body.sdgCodes.join(", ")}</div>
          <div><strong>Dates:</strong> Dec 12–13, 2026 • Entry Fee: ₹0 (Free)</div>
          <div><strong>Venues:</strong> Campus 6 Auditorium & Campus 10 Central Library, KIIT</div>
        </div>
        <p style="margin:20px 0 0;font-size:12px;color:rgba(250,246,238,0.7);">
          Your official Squad Pass PNG is attached to this email — download and keep it ready for check-in!
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: `"USC KIIT • HACK-A-BOT 3.0" <${gmailUser}>`,
      to: body.leaderEmail,
      subject: `[${body.passId}] HACK-A-BOT 3.0 Squad Pass — ${body.teamName}`,
      html,
      attachments,
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Email send failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
