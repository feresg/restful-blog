let mail = {
    host: process.env.MAILHOST || "smtp.mailtrap.io",
    port: process.env.MAILPORT || 2525,
    auth: {
      user: process.env.MAILUSER || "27f79eba8bbff9",
      pass: process.env.MAILPASS || "b8dc55d7574259"
    }
}
module.exports = mail;