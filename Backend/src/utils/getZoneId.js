import axios from "axios";
const getZoneId = async (domainName , apiKey , email) => {
  try {
    const response = await axios.get("https://api.cloudflare.com/client/v4/zones", {
      headers: {
        "X-Auth-Key": apiKey,
        "X-Auth-Email": email,
      },
      params: { name: domainName },
    });
    const zone = response.data.result.find((zone) => zone.name === domainName);
    return zone ? zone.id : null;
  } catch (error) {
    console.error("Error fetching zone ID:", error.message);
    return null;
  }
};

export default getZoneId