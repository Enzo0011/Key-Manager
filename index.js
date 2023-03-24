import {
	start,
	options,
	seedFile,
	getHelp,
	decrypt,
	encrypt,
} from "./functions.js";
import * as readline from "node:readline";
import * as fs from "node:fs";
import * as cp from "node:child_process";

const rl = readline.createInterface(process.stdin, process.stdout);

/**
 * Configure a new Seed with its name.
 *
 * @param {string} name The name of your seed
 * @param {string} seed The seed that will be encrypted
 * @param {string} pass The password that will be encrypt
 * @param {string} pass2 Optional if the first password was wrong
 *
 */
const setSeed = () => {
	rl.question("Name: ", (name) => {
		rl.question("Seed: ", (seed) => {
			rl.stdoutMuted = true;
			rl.question("Password: ", (pass) => {
				let add = `${name} : ${seed}\n`;
				try {
					fs.writeFileSync(
						seedFile,
						encrypt(
							decrypt(fs.readFileSync(seedFile), pass) + add,
							pass
						)
					);
					rl.close();
					cp.fork("index.js", [
						"message=The seed was successfully set !",
					]);
				} catch (e) {
					if (e.reason === "bad decrypt")
						console.log("\n\x1b[31mWrong Password\x1b[0m");
					rl.question("Password: ", (pass2) => {
						try {
							fs.writeFileSync(
								seedFile,
								encrypt(
									decrypt(fs.readFileSync(seedFile), pass2) +
										add,
									pass2
								)
							);
							rl.close();
							cp.fork("index.js", [
								"message=The seed was successfully set !",
							]);
						} catch (e2) {
							if (e2.reason === "bad decrypt") {
								console.log(
									"\n\x1b[31mWrong Password, please retry later.\x1b[0m"
								);
								process.exit();
							}
						}
					});
				}
			});
		});
	});
};

/**
 * Get a Seed with its name.
 *
 * @param {string} name The name of your seed
 * @param {string} pass The password that will be encrypt
 * @param {string} pass2 Optional if the first password was wrong
 *
 */
const getSeed = () => {
	rl.question("Name: ", (name) => {
		rl.stdoutMuted = true;
		rl.question("Password: ", (pass) => {
			try {
				console.log(
					"\n" +
						decrypt(fs.readFileSync(seedFile), pass)
							.split("\n")
							.filter((seed) => seed.split(" : ")[0] == name)
							.join("\n")
				);
				rl.stdoutMuted = false;
				rl.pressEnter = true;
				rl.question("Press Enter to exit", () => {
					rl.close();
					cp.fork("index.js");
				});
			} catch (e) {
				if (e.reason === "bad decrypt")
					console.log("\n\x1b[31mWrong Password\x1b[0m");
				rl.question("Password: ", (pass2) => {
					try {
						console.log(
							"\n" +
								decrypt(fs.readFileSync(seedFile), pass2)
									.split("\n")
									.filter(
										(seed) => seed.split(" : ")[0] == name
									)
									.join("\n")
						);
						rl.stdoutMuted = false;
						rl.pressEnter = true;
						rl.question("Press Enter to exit", () => {
							rl.close();
							cp.fork("index.js");
						});
					} catch (e2) {
						if (e2.reason === "bad decrypt") {
							console.log(
								"\n\x1b[31mWrong Password, please retry later.\x1b[0m"
							);
							process.exit();
						}
					}
				});
			}
		});
	});
};

/**
 * Get all Seed.
 *
 * @param {string} pass The password that will be encrypt
 * @param {string} pass2 Optional if the first password was wrong
 *
 */
const getAllSeed = () => {
	rl.stdoutMuted = true;
	rl.question("Password: ", (pass) => {
		try {
			console.log("\n" + decrypt(fs.readFileSync(seedFile), pass));
			rl.stdoutMuted = false;
			rl.pressEnter = true;
			rl.question("\nPress Enter to exit", () => {
				rl.close();
				cp.fork("index.js");
			});
		} catch (e) {
			if (e.reason === "bad decrypt")
				console.log("\n\x1b[31mWrong Password\x1b[0m");
			rl.question("Password: ", (pass2) => {
				try {
					console.log(
						"\n" + decrypt(fs.readFileSync(seedFile), pass2)
					);
					rl.stdoutMuted = false;
					rl.pressEnter = true;
					rl.question("\nPress Enter to exit", () => {
						rl.close();
						cp.fork("index.js");
					});
				} catch (e2) {
					if (e2.reason === "bad decrypt") {
						console.log(
							"\n\x1b[31mWrong Password, please retry later.\x1b[0m"
						);
						process.exit();
					}
				}
			});
		}
	});
};

/**
 * Extract the encrypted file in plaintext.
 *
 * @param {string} continu Yes or No choice
 * @param {string} pass The password that will be encrypt
 * @param {string} pass2 Optional if the first password was wrong
 *
 */
const extractSeed = () => {
	console.log("This action is risky.");
	rl.question(
		"If you continue, your Seeds will no longer be safe, \x1b[31mYes\x1b[0m or \x1b[32mNo\x1b[0m: ",
		(continu) => {
			if (
				continu.toLowerCase() == "yes" ||
				continu.toLowerCase() == "y"
			) {
				rl.question("Output File: ", (file) => {
					rl.stdoutMuted = true;
					rl.question("Password: ", (pass) => {
						try {
							fs.writeFileSync(
								file,
								decrypt(fs.readFileSync(seedFile), pass)
							);
							rl.close();
							cp.fork("index.js", [
								"message=The file was successfully extracted in <" +
									file +
									"> !",
							]);
						} catch (e) {
							if (e.reason === "bad decrypt")
								console.log("\n\x1b[31mWrong Password\x1b[0m");
							rl.question("Password: ", (pass2) => {
								try {
									fs.writeFileSync(
										file,
										decrypt(
											fs.readFileSync(seedFile),
											pass2
										)
									);
									rl.close();
									cp.fork("index.js", [
										"message=The file was successfully extracted in <" +
											file +
											"> !",
									]);
								} catch (e2) {
									if (e2.reason === "bad decrypt") {
										console.log(
											"\n\x1b[31mWrong Password, please retry later.\x1b[0m"
										);
										process.exit();
									}
								}
							});
						}
					});
				});
			} else {
				rl.close();
				cp.fork("index.js");
			}
		}
	);
};

/**
 * Show help.
 *
 */
const getHelpFunc = () => {
	console.log("\n" + getHelp + "\n");
	rl.pressEnter = true;
	rl.question("Press Enter to exit", () => {
		rl.close();
		cp.fork("index.js");
	});
};

/**
 * Exit process.
 *
 *
 */
const exit = () => {
	console.log("See you soon ;)");
	process.exit();
};

/**
 * @constant
 * @type {Array}
 */
const fc = [setSeed, getSeed, getAllSeed, extractSeed, getHelpFunc, exit];

/**
 * Show Menu.
 *
 * @param {number} choice Between 1 and 6
 *
 */
const menu = () => {
	if (process.argv[2] && process.argv[2].startsWith("message=")) {
		console.log("\x1b[32m" + process.argv[2].split("=")[1] + "\x1b[0m");
	}
	rl.question(options, (choice) => {
		fc[choice - 1]();
	});
};

// Check if arguments are "--help" or "-h"
if (process.argv[2] == "--help" || process.argv[2] == "-h") {
	console.log("\n" + getHelp + "\n");
	process.exit();
}

// Check if arguments are "--config" or "-c" of if file exist
if (
	process.argv[2] == "-c" ||
	process.argv[2] == "--config" ||
	!fs.existsSync(seedFile)
) {
	if (!fs.existsSync(seedFile)) {
		rl.stdoutMutedConf = true;
		rl.question("Set Password for all you'r Seed: ", (pass) => {
			rl.stdoutMutedConf = false;
			rl.stdoutMutedConf2 = true;
			rl.question("Repeat: ", (pass2) => {
				if (pass === pass2 && pass.length > 8) {
					let rdm = encrypt("Key Manager\n", pass);
					fs.writeFileSync(seedFile, rdm);
					rl.close();
					cp.fork("index.js", ["message=Setup completed!"]);
				} else {
					console.log(
						"\n\x1b[31mPassword too short or different.\x1b[0m"
					);
					process.exit();
				}
			});
		});
	} else {
		console.log("You have already made a configuration.");
		rl.question(
			"If you continue, your Seeds will be deleted, \x1b[31mYes\x1b[0m or \x1b[32mNo\x1b[0m: ",
			(continu) => {
				if (
					continu.toLowerCase() == "yes" ||
					continu.toLowerCase() == "y"
				) {
					rl.question(
						"Sur ? \x1b[31mYes\x1b[0m or \x1b[32mNo\x1b[0m: ",
						(continu2) => {
							if (
								continu2.toLowerCase() == "yes" ||
								continu2.toLowerCase() == "y"
							) {
								fs.unlinkSync(seedFile);
								rl.close();
								cp.fork("index.js", ["--config"]);
							} else {
								rl.close();
								cp.fork("index.js");
							}
						}
					);
				} else {
					rl.close();
					cp.fork("index.js");
				}
			}
		);
	}
}

/**
 *
 * @param {boolean} def
 */
rl._writeToOutput = (def) => {
	if (rl.stdoutMuted) {
		rl.output.write(
			"\x1B[2K\x1B[200DPassword: " + "*".repeat(rl.line.length)
		);
	} else if (rl.stdoutMutedConf) {
		rl.output.write(
			"\x1B[2K\x1B[200DSet Password for all you'r Seed: " +
				"*".repeat(rl.line.length)
		);
	} else if (rl.stdoutMutedConf2) {
		rl.output.write(
			"\x1B[2K\x1B[200DRepeat: " + "*".repeat(rl.line.length)
		);
	} else if (rl.pressEntere) {
		rl.output.write("\x1B[2K\x1B[200DPress enter to exit");
	} else {
		rl.output.write(def);
	}
};

start();
menu();
