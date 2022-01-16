// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CodeActionProvider, insertSnippet, } from "./utils/code_action";
const fs = require("fs");
const path = require("path");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {



	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider(
			{ pattern: "**/*.{dart}", scheme: "file" },
			new CodeActionProvider()
		)
	);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "flutter-strings-extract" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('flutter-strings-extract.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from flutter-strings-extract!');
	});

	let disposableConstant = vscode.commands.registerCommand('flutter-strings-extract.constant', () => {

		insertSnippet();



	});
	
	let disposableGetx = vscode.commands.registerCommand('flutter-strings-extract.getx', () => {
	
		insertSnippet(true);

		// Display a message box to the user


	});
	context.subscriptions.push(disposable);
	context.subscriptions.push(disposableConstant);
	context.subscriptions.push(disposableGetx);


}

// this method is called when your extension is deactivated
export function deactivate() { }
