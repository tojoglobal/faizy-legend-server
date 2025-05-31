import db from "../Utils/db.js";
import fs from "fs";
import path from "path";
import sendEmail from "../Utils/sendEmail.js";

export const submitBookForm = async (req, res) => {
  try {
    const { name, lastName, email, message } = req.body;
    const file = req.file;

    // Validation
    if (!name || !lastName || !email || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    let image_url = null;
    if (file) {
      image_url = `/uploads/${file.filename}`;
    }

    // DB Insert
    await db.query(
      "INSERT INTO book_forms (name, last_name, email, message, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, lastName, email, message, image_url]
    );

    // Send Email
    await sendEmail({
      from: email,
      to: "swapnilahmedshishir2018@gmail.com",
      subject: "📩 New Book Form Submission",
      html: `
        <div style="background: #f6f8fb; padding: 0; margin: 0; width: 100%; font-family: 'Segoe UI', Arial, sans-serif;">
          <style>
            @media only screen and (max-width: 600px) {
              .container { width: 98% !important; padding: 0 !important; }
              .card { padding: 18px !important; }
              .header-title { font-size: 1.3rem !important; }
              .summary-label { font-size: 1rem !important; }
              .summary-value { font-size: 1rem !important; }
            }
          </style>
          <table width="100%" border="0" cellpadding="0" cellspacing="0" style="padding:0;margin:0;">
            <tr>
              <td align="center" style="padding: 0; margin: 0;">
                <table class="container" width="600" cellpadding="0" cellspacing="0" style="margin: 40px auto; background: transparent; border-radius: 18px;">
                  <tr>
                    <td style="padding: 0;">
                      <!-- Header -->
                      <div style="background: linear-gradient(90deg, #4f8cff 0%, #7f53ff 100%); border-radius: 18px 18px 0 0; padding: 42px 0 30px 0; text-align: center; box-shadow: 0 4px 24px 0 rgba(44,62,80,0.12);">
                        <span style="font-size: 48px; display: block; margin-bottom: 6px;">📖</span>
                        <span class="header-title" style="color: #fff; font-size: 1.7rem; font-weight: bold; letter-spacing: 1px;">New Booking Received</span>
                        <div style="color: #e8eaf6; margin-top: 6px; font-size: 1.1rem;">Client Booking Information</div>
                      </div>
                      <!-- Booking Card -->
                      <div class="card" style="background: #fff; border-radius: 0 0 18px 18px; margin-bottom: 0; padding: 36px 36px 30px 36px; max-width: 100%; box-shadow: 0 2px 12px rgba(44,62,80,0.09);">
                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 1.1rem; color: #333;">
                          <tr>
                            <td class="summary-label" style="padding: 8px 0; color: #828282; font-weight: 600;">Name:</td>
                            <td class="summary-value" style="padding: 8px 0; color: #212121; font-weight: 500;">${name} ${lastName}</td>
                          </tr>
                          <tr>
                            <td class="summary-label" style="padding: 8px 0; color: #828282; font-weight: 600;">Email:</td>
                            <td class="summary-value" style="padding: 8px 0; color: #212121; font-weight: 500;"><a href="mailto:${email}" style="color: #4f8cff; text-decoration: underline;">${email}</a></td>
                          </tr>
                          <tr>
                            <td class="summary-label" style="padding: 8px 0; color: #828282; font-weight: 600; vertical-align:top;">Message:</td>
                            <td class="summary-value" style="padding: 8px 0; color: #212121; white-space: pre-line;">${message}</td>
                          </tr>
                          ${
                            image_url
                              ? `<tr>
                                  <td class="summary-label" style="padding: 8px 0; color: #828282; font-weight: 600;">File:</td>
                                  <td class="summary-value" style="padding: 8px 0;">
                                    <a href="https://api.faizylegend.com${image_url}" style="color: #7f53ff; text-decoration: underline;">Download File</a>
                                  </td>
                                </tr>`
                              : ""
                          }
                        </table>
                        <div style="margin-top: 34px; text-align: center;">
                          <a href="mailto:${email}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(90deg, #4f8cff 0%, #7f53ff 100%); color: #fff; border-radius: 7px; text-decoration: none; font-weight: 700; font-size: 1.12rem; box-shadow: 0 2px 8px rgba(127,83,255,0.09);">
                            Reply to Client
                          </a>
                        </div>
                      </div>
                      <!-- Footer -->
                      <div style="text-align:center; color:#b0b6be; font-size: 0.97rem; margin-top: 24px; padding-bottom:18px;">
                        © ${new Date().getFullYear()} Faizy Legend — All rights reserved.
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    res.json({ message: "Submission successful" });
  } catch (e) {
    console.error("❌ Form submission failed:", e);
    res.status(500).json({ error: "Failed to submit form" });
  }
};

export const getBookForms = async (req, res) => {
  try {
    const [forms] = await db.query(
      "SELECT * FROM book_forms ORDER BY created_at DESC"
    );
    res.json(forms);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
};

export const deleteBookForm = async (req, res) => {
  try {
    const { id } = req.params;
    // get image path
    const [[row]] = await db.query(
      "SELECT image_url FROM book_forms WHERE id=?",
      [id]
    );
    if (row && row.image_url && row.image_url.startsWith("/uploads/")) {
      const filePath = path.join(
        process.cwd(),
        row.image_url.replace(/^\//, "")
      );
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete file:", filePath, err);
        }
      });
    }
    await db.query("DELETE FROM book_forms WHERE id=?", [id]);
    res.json({ message: "Deleted" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete submission" });
  }
};
