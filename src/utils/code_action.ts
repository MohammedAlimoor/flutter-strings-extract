import { TextEncoder } from "util";
import * as vscode from "vscode";
const fs = require("fs");
// const path = require("path");

export class CodeActionProvider implements vscode.CodeActionProvider {
	public provideCodeActions(): vscode.Command[] {
		const editorX = vscode.window.activeTextEditor;

		if (!editorX) {
			return [];
		}
		// const pickedText = editorX.document.getText(selected(editorX));
		// var verText = editorX.document.getText(editorX.selection).length;



		const codeActions = [];
		if (canShowAction()) {
			codeActions.push({
				command: "flutter-strings-extract.constant",
				title: "Extract Constant String"
			});
			codeActions.push({
				command: "flutter-strings-extract.getx",
				title: "Extract Getx Localization"
			});
		}
		return codeActions;
	}
}



export function insertSnippet(getx = false) {
	const textEditor = vscode.window.activeTextEditor;
	if (!textEditor) {
		return;  // No open text editor
	}


	const folderPath = vscode.workspace.workspaceFolders![0].uri
		.toString()[1];
	var _path = folderPath + "/lib/";
	console.log(_path);

	var firstLine = textEditor.document.lineAt(textEditor.selection.start.line);
	var textRange = new vscode.Range(textEditor.selection.start.line,
		firstLine.range.start.character,
		textEditor.selection.start.line,
		firstLine.range.end.character);

	//     // const selectedText = selected(editorX);
	const selectedText = textEditor.document.getText(textRange);
	var m;
	let fullText = selectedText;

	const regex = /"(.*)"/g; // 'g' flag is for global search & 'm' flag is for multiline.

	let contant = selectedText.match(regex)![0];

	var varTitle = frendlyText(contant);

	var textReplace = "";//fullText.replace(regex, "Strings." + varTitle);

	if (getx) {
		textReplace = fullText.replace(regex,  `\"${varTitle}\".tr`);

	} else {
		textReplace = fullText.replace(regex, "Strings." + varTitle);

	}

	//Creating a new range with startLine, startCharacter & endLine, endCharacter.

	// To ensure that above range is completely contained in this document.
	let validFullRange = textEditor.document.validateRange(textRange);

	while ((m = regex.exec(fullText)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regex.lastIndex) {
			regex.lastIndex++;
		}

		textEditor.edit(editBuilder => {
			editBuilder.replace(validFullRange, textReplace);
		});


	}


	if (getx) {
		createStringsFileGetx(varTitle, selectedText);

	} else {
		createStringsFile(varTitle, contant);
	}



}


const regexReplace = /(})[^}]*$/g;// 

function createStringsFile(varTitle: String, varValue: String) {
	// const regex = /(})[^}]*$/g; // 'g' flag is for global search & 'm' flag is for multiline.

	var newPath2 = getMainPath() + "/resource/" + "strings.dart";
	if (!fs.existsSync(newPath2)) {
		vscode.workspace.fs.writeFile(vscode.Uri.file(newPath2), new TextEncoder().encode("class Strings{ \n " + "" + "}")).then((d) => {


			fs.readFile(newPath2, 'utf8', (err: any, data: any) => {

				var data2 = data.replace(regexReplace, "\n  static String " + varTitle + "=" + varValue + ";\n}" );
				vscode.workspace.fs.writeFile(vscode.Uri.file(newPath2), new TextEncoder().encode(data2));

			});
		});
	} else {


		fs.readFile(newPath2, 'utf8', (err: any, data: any) => {
			var data2 = data.replace(regexReplace, "\n  static String " + varTitle + "=" + varValue + ";\n }" );
			vscode.workspace.fs.writeFile(vscode.Uri.file(newPath2), new TextEncoder().encode(data2));

		});
	}

}

function createStringsFileGetx(varTitle: String, varValue: String) {



	var newPath2 = getMainPath() + "/localization/lang/" + "en_us.dart";
	if (!fs.existsSync(newPath2)) {
		vscode.workspace.fs.writeFile(vscode.Uri.file(newPath2), new TextEncoder().encode("const Map<String, String> enUS = { \n "  +""+ "};")).then((d) => {



			fs.readFile(newPath2, 'utf8', (err: any, data: any) => {

				var data2 = data.replace(regexReplace, "\n   \"" + varTitle + "\": " + varValue.trim() + " \n};" );
				vscode.workspace.fs.writeFile(vscode.Uri.file(newPath2), new TextEncoder().encode(data2));

			});
		});
	} else {


		fs.readFile(newPath2, 'utf8', (err: any, data: any) => {
			var data2 = data.replace(regexReplace, "\n   \"" + varTitle + "\": " + varValue.trim() + " \n};" );
			vscode.workspace.fs.writeFile(vscode.Uri.file(newPath2), new TextEncoder().encode(data2));

		});
	}

}
// const footerText = "\n/*Please do not delete or update this line or the lines below it*/\n";
function frendlyText(text: String) {
	var tiltle = text.replace("\"", ''); // Remove " "

	tiltle = toTitleCase(tiltle); // Capitalize the first letter of each word.
	tiltle = replaceAll(tiltle, " ", "");// tiltle.replace(" ", ''); // Remove spaces.
	tiltle = tiltle.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');// Remove special characters.

	if (tiltle.length > 101) {
		tiltle = tiltle.substr(0, 100); // Remove the first 100 characters.
	}
	return tiltle;
}
function replaceAll(string: string, search: string, replace: string) {
	return string.split(search).join(replace);
}


function getMainPath() {
	const textEditor = vscode.window.activeTextEditor;
	// var path = lookupParentDirectory(textEditor!.document!.uri);


	const regex = /(.*)lib/g; // 'g' flag is for global search & 'm' flag is for multiline.

	let mainPath = textEditor!.document!.uri.fsPath.match(regex)![0];
	return mainPath;
}

function canShowAction() {
	const textEditor = vscode.window.activeTextEditor;
	if (!textEditor) {
		return false;  // No open text editor
	}
	var firstLine = textEditor.document.lineAt(textEditor.selection.start.line);

	var textRange = new vscode.Range(textEditor.selection.start.line,
		firstLine.range.start.character,
		textEditor.selection.start.line,
		firstLine.range.end.character);
	const selectedText = textEditor.document.getText(textRange);

	const regex = /"(.*)"/g; // 'g' flag is for global search & 'm' flag is for multiline.

	if (selectedText.match(regex) !== null && selectedText.match(regex)!.length > 0) {
		return true;
	}
	return false;

}


const toTitleCase = (phrase: string) => {
	return phrase
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};
