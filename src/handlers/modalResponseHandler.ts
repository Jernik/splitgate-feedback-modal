import { CacheType, GuildMember, MessageComponentInteraction, ModalSubmitInteraction } from "discord.js";
import {google} from "googleapis";
import { getGoogleSheetsOAuth2Client } from "../functions/getGoogleSheetOAuth2Client";

const FEEDBACK_BUG_REPORT_SHEET_ID ="1W6_eg7P-FJT7PIsaz8WtlSpmcAlPl6biUZaU-xif174";
const CREATOR_APPLICATION_SHEET_ID = "1CqtO66Rp2s-u8xXRIUc0aA3VbGr3GFrSlh1qtaEykB0";

const appendToGoogleSheet = async (values:string[][], sheetName:string, spreadsheetId:string) => {
  //todo should we cache this auth?
  const auth = await getGoogleSheetsOAuth2Client();
  if(!auth)
    return;
  const sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.append(
		{
			spreadsheetId,
			range: sheetName,
			valueInputOption: "RAW",
			insertDataOption: "INSERT_ROWS",
			requestBody: {
				majorDimension: "ROWS",
				values,
			},
		},
		(err, res) => {
			if (err) return console.log("The API returned an error: " + err);
			// const rows = res?.data.values;
			// if (rows?.length) {
			// 	console.log("Name, Major:");
			// 	// Print columns A and E, which correspond to indices 0 and 4.
			// 	rows.map((row) => {
			// 		console.log(`${row[0]}, ${row[1]}`);
			// 	});
			// } else {
			// 	console.log("No data found.");
			// }
		}
	);
}

let modalResponseHandler = async (interaction: ModalSubmitInteraction) => {
	console.log(interaction.customId);
	//determine button type
	let modalType = interaction.customId;
	if (modalType === "bugReportModal") {
		await handleBugReportModalSubmission(interaction);
	} else if (modalType === "feedbackModal") {
		await handleFeedbackModalSubmission(interaction);
	} else if (modalType === "creatorApplicationModal"){
		await handleCreatorApplicationModal(interaction);
	}
};

export {modalResponseHandler}

async function handleBugReportModalSubmission(interaction: ModalSubmitInteraction) {
  let discordUserId = interaction.user.id;
  let member: GuildMember;
	if (interaction.member instanceof GuildMember) {
		member = interaction.member;
	} else {
		const found = interaction.guild?.members?.resolve(discordUserId);
		if (found) member = found;
	}
  let email = interaction.fields.getTextInputValue('emailInput');
  let platform = interaction.fields.getTextInputValue('platformInput');
  let username = interaction.fields.getTextInputValue('usernameInput');
  let description = interaction.fields.getTextInputValue('descriptionInput');
  let proof = interaction.fields.getTextInputValue('proofInput');
  await appendToGoogleSheet(
		[
			[
				member!?.user.tag ?? "Not Found",
				discordUserId,
				email,
				platform,
				username,
				description,
				proof,
			],
		],
		"Bug Report",
		FEEDBACK_BUG_REPORT_SHEET_ID
	);
  interaction.reply({content:"Thank you for your bug report!", ephemeral: true});
}

async function handleFeedbackModalSubmission(interaction:ModalSubmitInteraction){
  let discordUserId = interaction.user.id;
  let member: GuildMember;
	if (interaction.member instanceof GuildMember) {
		member = interaction.member;
	} else {
		const found = interaction.guild?.members?.resolve(discordUserId);
		if (found) member = found;
	}
  let email = interaction.fields.getTextInputValue('emailInput');
  let feedback = interaction.fields.getTextInputValue('feedbackInput');
  let link = interaction.fields.getTextInputValue('linkInput');
  await appendToGoogleSheet(
		[[member!?.user.tag ?? "Not Found", discordUserId, email, feedback, link]],
		"Feedback",
		FEEDBACK_BUG_REPORT_SHEET_ID
	);
  interaction.reply({content:"Thank you for your feedback!", ephemeral: true});
}
async function handleCreatorApplicationModal(interaction: ModalSubmitInteraction) {
	 let discordUserId = interaction.user.id;
		let member: GuildMember;
		if (interaction.member instanceof GuildMember) {
			member = interaction.member;
		} else {
			const found = interaction.guild?.members?.resolve(discordUserId);
			if (found) member = found;
		}
		let friendCode = interaction.fields.getTextInputValue("friendCodeInput");
		let platform = interaction.fields.getTextInputValue("platformInput");
		let splitgateName = interaction.fields.getTextInputValue("splitgateNameInput");
		let channelLink = interaction.fields.getTextInputValue("channelLinkInput");
		await appendToGoogleSheet(
			[
				[
					member!?.user.tag ?? "Not Found",
					discordUserId,
					friendCode,
					splitgateName,
					platform,
					channelLink,
				],
			],
			"Applications",
			CREATOR_APPLICATION_SHEET_ID
		);
		interaction.reply({
			content: "Thank you for your application!",
			ephemeral: true,
		});
}

