// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { BroilerplateItemType } from "./types";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "broilerplate" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('broilerplate.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from BroilerPlate!');
	});


	context.subscriptions.push(disposable);

  context.subscriptions.push(vscode.commands.registerCommand('broilerplate.createFolderWithFiles', async () => {
  // Get the folder name from the user
  const folderName = await vscode.window.showInputBox({
    placeHolder: "Enter the folder name"
  });

  // Call the createFolder function with the folder name
  if (folderName) {
    createFolder(folderName);
  }
}));
}



async function createFolder (folderName: string) {
  // Create the folder in the workspace

  const config =  vscode.workspace.getConfiguration();
  const options: Array<BroilerplateItemType> = config["[broilerplate]"];


  const selectedFolders = await vscode.window.showOpenDialog({
    canSelectFiles: false,
    canSelectFolders: true,
    canSelectMany: false
  });

  if (!selectedFolders || selectedFolders.length === 0) {
    return undefined;
  }

  const selectedFolderUri = selectedFolders[0];
  const selectedFolderPath = selectedFolderUri.fsPath;
  const folderPath = path.join(selectedFolderPath, folderName);

  await fs.promises.mkdir(folderPath, { recursive: true });


  // Create the files in the folder
  options.forEach(async ({fileName, snippetName, snippetLang}) => {

    // If the fileName has the variable {folderName}, it will be replaced to the name of the current folder
    const filePath = path.join(folderPath, fileName.replace("{folderName}", folderName));


    // const commander = await vscode.commands.executeCommand('editor.action.insertSnippet',  { name: snippetName, langId: snippetLang, } );
    const body = ""; // Suppose to be created by snippet

    await fs.promises.writeFile(filePath, body);
  });
};



// This method is called when your extension is deactivated
export function deactivate() {}
