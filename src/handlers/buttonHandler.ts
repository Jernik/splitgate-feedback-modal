import { Message } from "discord.js";
import {
	GuildMember,
	MessageActionRow,
	MessageButton,
	MessageComponentInteraction,
	Modal,
	TextInputComponent,
	ModalActionRowComponent,
} from "discord.js";
import { config } from "../config";
import { safelySendDm } from "../functions/messaging";

let buttonHandler = async (
	interaction: MessageComponentInteraction
) => {
	console.log(interaction.customId);
	//determine button type
	let buttonType = interaction.customId;
	if (buttonType === "bug-report") {
		await showBugReportModal(interaction);
	} else if (buttonType === "in-game-feedback") {
		await showInGameFeedbackModal(interaction);
	} else if(buttonType === "discord-feedback") {
		await showDiscordFeedbackModal(interaction);
	}
};

async function showBugReportModal(interaction: MessageComponentInteraction) {
	let user: GuildMember;
	if (interaction.member instanceof GuildMember) {
		user = interaction.member;
	} else {
		const found = interaction.guild?.members?.resolve(this.interaction.user?.id);
		if (found) user = found;
	}
	if (user!) {
		// Create the modal
		const modal = new Modal().setCustomId("myModal").setTitle("My Modal");
		// Add components to modal
		// Create the text input components
		const inputs = [];
		inputs.push(new TextInputComponent()
			.setCustomId("emailInput")
			// The label is the prompt the user sees for this input
			.setLabel("What is your email?")
			.setRequired(true)
			// Short means only a single line of text
			.setStyle("SHORT"));
		inputs.push( new TextInputComponent()
			.setCustomId("platformInput")
			.setLabel("What platform are you on?")
			.setRequired(true)
			.setPlaceholder("Steam, Playstation, Xbox")
			// Paragraph means multiple lines of text.
			.setStyle("SHORT"));
		inputs.push(new TextInputComponent()
			.setCustomId("usernameInput")
			.setLabel("What is your username?")
			.setRequired(true)
			.setStyle("SHORT"));
		inputs.push(new TextInputComponent()
			.setCustomId("descriptionInput")
			.setLabel("What's the bug?")
			.setRequired(true)
			.setPlaceholder("Please describe the bug")
			.setStyle("PARAGRAPH"));
		inputs.push(new TextInputComponent()
			.setCustomId("proofInput")
			.setLabel("Link to the proof, if possible")
			.setRequired(false)
			.setStyle("SHORT"));
		// An action row only holds one text input,
		// so you need one action row per text input.
		const actionComponents = inputs.map(input => new MessageActionRow<ModalActionRowComponent>().addComponents(input));
		
		// Add inputs to the modal
		modal.addComponents(...actionComponents);
		// Show the modal to the user
		await interaction.showModal(modal);
	} else {
		interaction.reply({
			content: `Error processing command. (Error 1002)`,
		});
		console.log(
			`unable to locate member object for id ${interaction?.user?.id}`
		);
	}
}

async function showInGameFeedbackModal(
	interaction: MessageComponentInteraction
) {
	let user: GuildMember;
	if (interaction.member instanceof GuildMember) {
		user = interaction.member;
	} else {
		const found = interaction.guild?.members?.resolve(
			this.interaction.user?.id
		);
		if (found) user = found;
	}
	if (user!) {
		// Create the modal
		const modal = new Modal().setCustomId("myModal").setTitle("My Modal");
		// Add components to modal
		// Create the text input components
		const inputs = [];
		inputs.push(
			new TextInputComponent()
				.setCustomId("emailInput")
				// The label is the prompt the user sees for this input
				.setLabel("What is your email?")
				.setPlaceholder("Only if you wish to be contacted about this")
				.setRequired(false)
				// Short means only a single line of text
				.setStyle("SHORT")
		);
		inputs.push(
			new TextInputComponent()
				.setCustomId("feedbackInput")
				.setLabel("What is your feedback?")
				.setRequired(true)
				.setPlaceholder("Describe it in as much detail as possible")
				// Paragraph means multiple lines of text.
				.setStyle("PARAGRAPH")
		);
		inputs.push(
			new TextInputComponent()
				.setCustomId("linkInput")
				.setLabel("Provide any supporting evidence with links")
				.setRequired(false)
				.setStyle("SHORT")
		);
		// An action row only holds one text input,
		// so you need one action row per text input.
		const actionComponents = inputs.map((input) =>
			new MessageActionRow<ModalActionRowComponent>().addComponents(input)
		);

		// Add inputs to the modal
		modal.addComponents(...actionComponents);
		// Show the modal to the user
		await interaction.showModal(modal);
	} else {
		interaction.reply({
			content: `Error processing command. (Error 1002)`,
		});
		console.log(
			`unable to locate member object for id ${interaction?.user?.id}`
		);
	}
}

async function showDiscordFeedbackModal(
	interaction: MessageComponentInteraction
) {
	let user: GuildMember;
	if (interaction.member instanceof GuildMember) {
		user = interaction.member;
	} else {
		const found = interaction.guild?.members?.resolve(
			this.interaction.user?.id
		);
		if (found) user = found;
	}
	if (user!) {
		// Create the modal
		const modal = new Modal().setCustomId("myModal").setTitle("My Modal");
		// Add components to modal
		// Create the text input components
		const inputs = [];
		inputs.push(
			new TextInputComponent()
				.setCustomId("emailInput")
				// The label is the prompt the user sees for this input
				.setLabel("What is your email?")
				.setRequired(true)
				// Short means only a single line of text
				.setStyle("SHORT")
		);
		inputs.push(
			new TextInputComponent()
				.setCustomId("platformInput")
				.setLabel("What platform are you on?")
				.setRequired(true)
				.setPlaceholder("Steam, Playstation, Xbox")
				// Paragraph means multiple lines of text.
				.setStyle("SHORT")
		);
		inputs.push(
			new TextInputComponent()
				.setCustomId("usernameInput")
				.setLabel("What is your username?")
				.setRequired(true)
				.setStyle("SHORT")
		);
		inputs.push(
			new TextInputComponent()
				.setCustomId("descriptionInput")
				.setLabel("What's the bug?")
				.setRequired(true)
				.setPlaceholder("Please describe the bug")
				.setStyle("PARAGRAPH")
		);
		inputs.push(
			new TextInputComponent()
				.setCustomId("proofInput")
				.setLabel("Link to the proof, if possible")
				.setRequired(false)
				.setStyle("SHORT")
		);
		// An action row only holds one text input,
		// so you need one action row per text input.
		const actionComponents = inputs.map((input) =>
			new MessageActionRow<ModalActionRowComponent>().addComponents(input)
		);

		// Add inputs to the modal
		modal.addComponents(...actionComponents);
		// Show the modal to the user
		await interaction.showModal(modal);
	} else {
		interaction.reply({
			content: `Error processing command. (Error 1002)`,
		});
		console.log(
			`unable to locate member object for id ${interaction?.user?.id}`
		);
	}
}


export { buttonHandler };