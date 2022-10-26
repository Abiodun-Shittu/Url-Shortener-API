import shortid from "shortid";
import validUrl from "valid-url";

import urlSchema from "../models/urlSchema.js";

const baseUrl = "http://localhost:9000";

const shortenUrl = async (req, res) => {
	try {
		const { longUrl } = req.body;
		if (!validUrl.isUri(baseUrl)) {
			return res.status(401).json("Invalid Base URL");
		}
		const urlKey = shortid.generate();

		if (!validUrl.isUri(longUrl)) {
			return res.status(401).json("Invalid Long URL");
		}
		let findUrl = await urlSchema.findOne({ longUrl });
		if (!findUrl) {
			const shortUrl = baseUrl + "/" + urlKey;
			findUrl = new urlSchema({
				longUrl,
				shortUrl,
				urlKey,
			});
			await findUrl.save();
			return res.status(201).json(findUrl);
		}
		return res.status(200).json(findUrl);
	} catch (err) {
		console.log(err);
		return res
			.status(500)
			.json("An Error Occurred, Please Contact the System Admin");
	}
};

export default shortenUrl;
