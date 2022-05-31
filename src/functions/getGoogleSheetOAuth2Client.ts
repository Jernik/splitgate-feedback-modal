import * as fs from "fs";
import * as readline from "readline";
import { google } from "googleapis";

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = "token.json";
// Load client secrets from a local file.
//todo should this create a new oauth2 client and 
const getGoogleSheetsOAuth2Client = async () => {
	return await fs.promises.readFile("./credentials.json").then((content) => {
		return authorize(JSON.parse(content.toString()));
	})
	.catch(err=>console.log("error reading credentials.json", err));
}

export {getGoogleSheetsOAuth2Client};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 */
async function authorize(credentials: any) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(
		client_id,
		client_secret,
		redirect_uris[0]
	);

	// Check if we have previously stored a token.
	await fs.promises.readFile(TOKEN_PATH).then((token) => {
		oAuth2Client.setCredentials(JSON.parse(token.toString()));
	}).catch(()=>{
		getNewToken(oAuth2Client);
	});
	return oAuth2Client;
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 */
function getNewToken(oAuth2Client: any) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	});
	console.log("Authorize this app by visiting this url:", authUrl);
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question("Enter the code from that page here: ", (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err: any, token: any) => {
			if (err)
				return console.error(
					"Error while trying to retrieve access token",
					err
				);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log("Token stored to", TOKEN_PATH);
			});
            return oAuth2Client;
		});
	});
}
