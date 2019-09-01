export default {
  session: {
    secret: process.env.SESSION_SECRET || "324324234234234"
  },
  autodesk: {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_url: process.env.REDIRECT_URL || "http://localhost:3000/callback",
    auto_refresh: true
  }
};
