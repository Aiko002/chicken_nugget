// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

const vscode = require('vscode');

// Pre-built theme definitions
const preBuiltThemes = {
    "Chicken Nugget Dark": {
        "editor.background": "#1E1E1E",
        "editor.foreground": "#D4D4D4",
        "statusBar.background": "#705697",
        "activityBar.background": "#333333",
        "titleBar.activeBackground": "#444444",
        "sideBar.background": "#252526",
        "activityBar.foreground": "#FFFFFF",
        "tab.activeBackground": "#1E1E1E",
        "tab.inactiveBackground": "#2D2D2D"
    },
    "Golden Nugget Crunch": { 
        "editor.background": "#5A3921", 
        "editor.foreground": "#FFF0D1", 
        "statusBar.background": "#D4A256", 
        "activityBar.background": "#8B5A2B", 
        "titleBar.activeBackground": "#BC8C4E", 
        "sideBar.background": "#704625", 
        "activityBar.foreground": "#FFECB3", 
        "tab.activeBackground": "#5A3921", 
        "tab.inactiveBackground": "#7E512E" 
    },
   "Crispy Nugget Light": { 
    "editor.background": "#FFF2D6", 
    "editor.foreground": "#5A3921", 
    "statusBar.background": "#E8B668", 
    "activityBar.background": "#F5D6A7", 
    "titleBar.activeBackground": "#F9C969", 
    "sideBar.background": "#FFEFD4", 
    "activityBar.foreground": "#8B5A2B", 
    "tab.activeBackground": "#FFF2D6", 
    "tab.inactiveBackground": "#F8DFB1" 
    }
};

// Pre-built syntax highlighting themes
const preBuiltSyntaxThemes = {
    "Chicken Nugget Syntax Dark": [
        { scope: "comment", settings: { foreground: "#6A9955" } },
        { scope: "variable", settings: { foreground: "#9CDCFE" } },
        { scope: "string", settings: { foreground: "#CE9178" } },
        { scope: "keyword", settings: { foreground: "#569CD6" } },
        { scope: "entity.name.function", settings: { foreground: "#DCDCAA" } },
        { scope: "entity.name.class", settings: { foreground: "#4EC9B0" } },
        { scope: "constant.numeric", settings: { foreground: "#B5CEA8" } }
    ],
    "Chicken Nugget Syntax Light": [
        { scope: "comment", settings: { foreground: "#008000" } },
        { scope: "variable", settings: { foreground: "#0070C1" } },
        { scope: "string", settings: { foreground: "#A31515" } },
        { scope: "keyword", settings: { foreground: "#0000FF" } },
        { scope: "entity.name.function", settings: { foreground: "#795E26" } },
        { scope: "entity.name.class", settings: { foreground: "#267f99" } },
        { scope: "constant.numeric", settings: { foreground: "#098658" } }
    ],
    "Chicken Nugget Syntax Warm": [
        { scope: "comment", settings: { foreground: "#93A1A1" } },
        { scope: "variable", settings: { foreground: "#268BD2" } },
        { scope: "string", settings: { foreground: "#2AA198" } },
        { scope: "keyword", settings: { foreground: "#859900" } },
        { scope: "entity.name.function", settings: { foreground: "#B58900" } },
        { scope: "entity.name.class", settings: { foreground: "#CB4B16" } },
        { scope: "constant.numeric", settings: { foreground: "#D33682" } }
    ]
};

// Theme element mapping - used for better UI organization
const themeElementCategories = [
    {
        category: "Editor",
        elements: [
            { label: "Editor Background", setting: "editor.background", icon: "$(edit)" },
            { label: "Editor Foreground", setting: "editor.foreground", icon: "$(edit)" }
        ]
    },
    {
        category: "Workspace",
        elements: [
            { label: "Status Bar Background", setting: "statusBar.background", icon: "$(server)" },
            { label: "Activity Bar Background", setting: "activityBar.background", icon: "$(layout)" },
            { label: "Title Bar Background", setting: "titleBar.activeBackground", icon: "$(browser)" },
            { label: "Side Bar Background", setting: "sideBar.background", icon: "$(list-tree)" },
            { label: "Activity Bar Icon Foreground", setting: "activityBar.foreground", icon: "$(symbol-color)" }
        ]
    },
    {
        category: "Tabs",
        elements: [
            { label: "Tab Active Background", setting: "tab.activeBackground", icon: "$(preview)" },
            { label: "Tab Inactive Background", setting: "tab.inactiveBackground", icon: "$(preview)" }
        ]
    }
];

// Syntax element categories
const syntaxElementCategories = [
    {
        category: "Code Elements",
        elements: [
            { label: "Variables", scope: "variable", icon: "$(symbol-variable)" },
            { label: "Strings", scope: "string", icon: "$(symbol-string)" },
            { label: "Numbers", scope: "constant.numeric", icon: "$(symbol-numeric)" }
        ]
    },
    {
        category: "Code Structure",
        elements: [
            { label: "Keywords", scope: "keyword", icon: "$(symbol-keyword)" },
            { label: "Functions", scope: "entity.name.function", icon: "$(symbol-method)" },
            { label: "Classes", scope: "entity.name.class", icon: "$(symbol-class)" },
            { label: "Comments", scope: "comment", icon: "$(comment)" }
        ]
    }
];

// Last used settings storage
let lastUsedElements = {
    theme: [],
    syntax: []
};
const MAX_RECENT_ITEMS = 5;

function activate(context) {
    console.log('Chicken Nugget extension is now active!');

    // --- Search Functionality --- 
    let searchCommand = vscode.commands.registerCommand('extension.chickenNugget', function () {
        vscode.window.showInputBox({ prompt: 'Enter keyword to search' }).then(keyword => {
            if (keyword) {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    vscode.window.showErrorMessage('No active editor found');
                    return;
                }

                const document = editor.document;
                const text = document.getText();
                const regex = new RegExp(keyword, 'gi');
                const decorationsArray = [];
                let match;

                while ((match = regex.exec(text)) !== null) {
                    const startPos = document.positionAt(match.index);
                    const endPos = document.positionAt(match.index + match[0].length);
                    const decoration = { range: new vscode.Range(startPos, endPos) };
                    decorationsArray.push(decoration);
                }

                if (decorationsArray.length > 0) {
                    const decorationType = vscode.window.createTextEditorDecorationType({
                        backgroundColor: 'rgba(255, 255, 0, 0.3)',
                        border: '1px solid yellow',
                        borderRadius: '2px'
                    });
                    editor.setDecorations(decorationType, decorationsArray);
                    editor.revealRange(decorationsArray[0].range);

                    context.subscriptions.push({ dispose: () => decorationType.dispose() });
                    vscode.window.showInformationMessage(`Found ${decorationsArray.length} matches for "${keyword}"`);
                } else {
                    vscode.window.showInformationMessage(`No matches found for "${keyword}"`);
                }
            }
        });
    });
    context.subscriptions.push(searchCommand);

    // --- Theme Management ---
    let themeCommand = vscode.commands.registerCommand('extension.applyCustomTheme', async function () {
        // Main theme options
        const themeOptions = [
            { label: "$(history) Recently Used Elements", id: "recent", description: "Quickly access recently modified elements" },
            { label: "$(paintcan) Built-in VS Code Themes", id: "builtin", description: "Select from installed themes" },
            { label: "$(color-mode) Chicken Nugget Pre-built Themes", id: "prebuilt", description: "Select one of our custom themes" },
            { label: "$(symbol-color) Customize Theme Elements", id: "customize", description: "Modify specific UI elements" },
            { label: "$(debugRestart) Reset All Customizations", id: "reset", description: "Remove all custom theming" }
        ];

        const selectedOption = await vscode.window.showQuickPick(themeOptions, {
            placeHolder: 'Select a theme option'
        });

        if (!selectedOption) return;

        // Handle different theme options
        switch (selectedOption.id) {
            case "recent":
                await handleRecentElements('theme');
                break;
            case "builtin":
                await handleBuiltInThemes();
                break;
            case "prebuilt":
                await handlePreBuiltThemes();
                break;
            case "customize":
                await handleCustomizeThemeNew();
                break;
            case "reset":
                await resetAllCustomizations();
                break;
        }
    });
    context.subscriptions.push(themeCommand);

    // --- Syntax Highlighting Management ---
    let syntaxCommand = vscode.commands.registerCommand('extension.applyCustomColors', async function () {
        const syntaxOptions = [
            { label: "$(history) Recently Used Elements", id: "recent", description: "Quickly access recently modified elements" },
            { label: "$(edit) Customize Syntax Elements", id: "customize", description: "Change colors for specific syntax elements" },
            { label: "$(color-mode) Chicken Nugget Pre-built Syntax Themes", id: "prebuilt", description: "Select one of our custom syntax themes" },
            { label: "$(debugRestart) Reset All Syntax Highlighting", id: "reset", description: "Remove all custom syntax coloring" }
        ];

        const selectedOption = await vscode.window.showQuickPick(syntaxOptions, {
            placeHolder: 'Select a syntax highlighting option'
        });

        if (!selectedOption) return;

        // Handle different syntax options
        switch (selectedOption.id) {
            case "recent":
                await handleRecentElements('syntax');
                break;
            case "customize":
                await handleCustomizeSyntaxNew();
                break;
            case "prebuilt":
                await handlePreBuiltSyntax();
                break;
            case "reset":
                await resetSyntaxHighlighting();
                break;
        }
    });
    context.subscriptions.push(syntaxCommand);

    // --- Handle recently used elements ---
    async function handleRecentElements(type) {
        const recentItems = lastUsedElements[type];
        
        if (recentItems.length === 0) {
            vscode.window.showInformationMessage(`No recently used ${type} elements.`);
            if (type === 'theme') {
                await handleCustomizeThemeNew();
            } else {
                await handleCustomizeSyntaxNew();
            }
            return;
        }
        
        const recentPicks = recentItems.map(item => ({
            label: item.label,
            detail: `Last modified: ${item.lastUsed}`,
            item: item
        }));
        
        const selected = await vscode.window.showQuickPick(recentPicks, {
            placeHolder: `Select a recently used ${type} element`
        });
        
        if (selected) {
            if (type === 'theme') {
                await customizeThemeElement(selected);
            } else {
                await customizeSyntaxElement(selected);
            }
        }
    }

    // --- Functions for Theme Management ---

    // Handle built-in VS Code themes
    async function handleBuiltInThemes() {
        const extensions = vscode.extensions.all;
        const themes = [];

        extensions.forEach(ext => {
            const extThemes = ext.packageJSON?.contributes?.themes || [];
            extThemes.forEach(theme => {
                themes.push({
                    label: theme.label || theme.id,
                    id: theme.id,
                    description: `From: ${ext.packageJSON.displayName || ext.id}`
                });
            });
        });

        const selectedTheme = await vscode.window.showQuickPick(themes, {
            placeHolder: 'Select a built-in theme'
        });

        if (selectedTheme) {
            // Remove all custom theming first
            await resetAllCustomizations();
            
            // Then apply the selected theme
            await vscode.workspace.getConfiguration('workbench').update(
                'colorTheme',
                selectedTheme.id,
                vscode.ConfigurationTarget.Global
            );

            vscode.window.showInformationMessage(`Applied theme: ${selectedTheme.label} with no custom modifications`);
        }
    }

    // Handle pre-built Chicken Nugget themes
    async function handlePreBuiltThemes() {
        const preBuiltOptions = Object.keys(preBuiltThemes).map(themeName => ({
            label: themeName,
            id: themeName
        }));

        const selectedPreBuilt = await vscode.window.showQuickPick(preBuiltOptions, {
            placeHolder: 'Select a Chicken Nugget theme'
        });

        if (selectedPreBuilt) {
            const themeColors = preBuiltThemes[selectedPreBuilt.id];
            
            // Update color customizations
            await vscode.workspace.getConfiguration('workbench').update(
                'colorCustomizations',
                themeColors,
                vscode.ConfigurationTarget.Global
            );

            vscode.window.showInformationMessage(`Applied Chicken Nugget theme: ${selectedPreBuilt.id}`);
        }
    }

    // Theme customization with categorized UI
    async function handleCustomizeThemeNew() {
        // First level: Show categories
        const categories = themeElementCategories.map(cat => ({
            label: `$(folder) ${cat.category}`,
            category: cat.category,
            description: `${cat.elements.length} elements`
        }));
        
        // Add option to show all elements
        categories.unshift({
            label: "$(list-flat) All UI Elements",
            category: "all",
            description: "View all customizable elements in a flat list"
        });
        
        const selectedCategory = await vscode.window.showQuickPick(categories, {
            placeHolder: 'Select category or view all elements'
        });
        
        if (!selectedCategory) return;
        
        // Second level: Show elements in the selected category
        let elementsToShow = [];
        
        if (selectedCategory.category === "all") {
            // Flatten all categories into one list
            themeElementCategories.forEach(cat => {
                elementsToShow = elementsToShow.concat(cat.elements);
            });
        } else {
            // Find the selected category and get its elements
            const category = themeElementCategories.find(cat => cat.category === selectedCategory.category);
            if (category) {
                elementsToShow = category.elements;
            }
        }
        
        const elementOptions = elementsToShow.map(element => ({
            label: `${element.icon} ${element.label}`,
            element: element
        }));
        
        const selectedElement = await vscode.window.showQuickPick(elementOptions, {
            placeHolder: 'Select an element to customize'
        });
        
        if (selectedElement) {
            await customizeThemeElement(selectedElement.element);
        }
    }
    
    // Handle the color selection for a specific theme element
    async function customizeThemeElement(element) {
        // Get current color (if any)
        const colorCustomizations = vscode.workspace.getConfiguration('workbench').get('colorCustomizations') || {};
        const currentColor = colorCustomizations[element.setting] || "#FFFFFF";
        
        // Show color picker with current color
        const color = await vscode.window.showInputBox({
            prompt: `Enter a color for ${element.label} (hex format: #RRGGBB)`,
            placeHolder: currentColor,
            value: currentColor
        });
        
        if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
            // Update color customizations
            colorCustomizations[element.setting] = color;
            
            await vscode.workspace.getConfiguration('workbench').update(
                'colorCustomizations',
                colorCustomizations,
                vscode.ConfigurationTarget.Global
            );
            
            // Add to recently used list
            updateRecentlyUsed('theme', {
                label: element.label,
                setting: element.setting,
                icon: element.icon,
                lastUsed: new Date().toLocaleString()
            });
            
            // Show success message with options for next steps
            const nextAction = await vscode.window.showInformationMessage(
                `Applied custom color to ${element.label}`,
                'Customize Another Element',
                'Done'
            );
            
            if (nextAction === 'Customize Another Element') {
                await handleCustomizeThemeNew();
            }
        } else if (color) {
            vscode.window.showErrorMessage('Invalid color format. Please use #RRGGBB format.');
        }
    }

    // Reset all customizations
    async function resetAllCustomizations() {
        // Reset workbench color customizations
        await vscode.workspace.getConfiguration('workbench').update(
            'colorCustomizations',
            undefined,
            vscode.ConfigurationTarget.Global
        );

        // Reset token color customizations
        await vscode.workspace.getConfiguration('editor').update(
            'tokenColorCustomizations',
            undefined,
            vscode.ConfigurationTarget.Global
        );

        vscode.window.showInformationMessage('All Chicken Nugget customizations have been removed');
    }

    // --- Functions for Syntax Highlighting Management ---

    // Syntax customization with categorized UI
    async function handleCustomizeSyntaxNew() {
        // First level: Show categories
        const categories = syntaxElementCategories.map(cat => ({
            label: `$(folder) ${cat.category}`,
            category: cat.category,
            description: `${cat.elements.length} elements`
        }));
        
        // Add option to show all elements
        categories.unshift({
            label: "$(list-flat) All Syntax Elements",
            category: "all",
            description: "View all customizable syntax elements in a flat list"
        });
        
        const selectedCategory = await vscode.window.showQuickPick(categories, {
            placeHolder: 'Select category or view all elements'
        });
        
        if (!selectedCategory) return;
        
        // Second level: Show elements in the selected category
        let elementsToShow = [];
        
        if (selectedCategory.category === "all") {
            // Flatten all categories into one list
            syntaxElementCategories.forEach(cat => {
                elementsToShow = elementsToShow.concat(cat.elements);
            });
        } else {
            // Find the selected category and get its elements
            const category = syntaxElementCategories.find(cat => cat.category === selectedCategory.category);
            if (category) {
                elementsToShow = category.elements;
            }
        }
        
        const elementOptions = elementsToShow.map(element => ({
            label: `${element.icon} ${element.label}`,
            element: element
        }));
        
        const selectedElement = await vscode.window.showQuickPick(elementOptions, {
            placeHolder: 'Select a syntax element to customize'
        });
        
        if (selectedElement) {
            await customizeSyntaxElement(selectedElement.element);
        }
    }
    
    // Handle the color selection for a specific syntax element
    async function customizeSyntaxElement(element) {
        // Get current token color customizations
        const configuration = vscode.workspace.getConfiguration('editor');
        let tokenColorCustomizations = configuration.get('tokenColorCustomizations') || {};
        
        if (!tokenColorCustomizations.textMateRules) {
            tokenColorCustomizations.textMateRules = [];
        }
        
        // Find current color for this scope if it exists
        let currentColor = "#FFFFFF";
        const existingRule = tokenColorCustomizations.textMateRules.find(
            rule => rule.scope === element.scope
        );
        
        if (existingRule && existingRule.settings.foreground) {
            currentColor = existingRule.settings.foreground;
        }
        
        // Show color picker with current color
        const color = await vscode.window.showInputBox({
            prompt: `Enter a color for ${element.label} (hex format: #RRGGBB)`,
            placeHolder: currentColor,
            value: currentColor
        });
        
        if (color && /^#[0-9A-Fa-f]{6}$/.test(color)) {
            // Remove existing rule for this scope if it exists
            tokenColorCustomizations.textMateRules = tokenColorCustomizations.textMateRules.filter(
                rule => rule.scope !== element.scope
            );
            
            // Add the new rule
            tokenColorCustomizations.textMateRules.push({
                scope: element.scope,
                settings: {
                    foreground: color
                }
            });
            
            await configuration.update(
                'tokenColorCustomizations',
                tokenColorCustomizations,
                vscode.ConfigurationTarget.Global
            );
            
            // Add to recently used list
            updateRecentlyUsed('syntax', {
                label: element.label,
                scope: element.scope,
                icon: element.icon,
                lastUsed: new Date().toLocaleString()
            });
            
            // Show success message with options for next steps
            const nextAction = await vscode.window.showInformationMessage(
                `Applied custom color to ${element.label}`,
                'Customize Another Element',
                'Done'
            );
            
            if (nextAction === 'Customize Another Element') {
                await handleCustomizeSyntaxNew();
            }
        } else if (color) {
            vscode.window.showErrorMessage('Invalid color format. Please use #RRGGBB format.');
        }
    }

    // Handle pre-built syntax themes
    async function handlePreBuiltSyntax() {
        const preBuiltOptions = Object.keys(preBuiltSyntaxThemes).map(themeName => ({
            label: themeName,
            id: themeName
        }));

        const selectedPreBuilt = await vscode.window.showQuickPick(preBuiltOptions, {
            placeHolder: 'Select a Chicken Nugget syntax theme'
        });

        if (selectedPreBuilt) {
            const syntaxRules = preBuiltSyntaxThemes[selectedPreBuilt.id];
            
            // Update token color customizations
            await vscode.workspace.getConfiguration('editor').update(
                'tokenColorCustomizations',
                { textMateRules: syntaxRules },
                vscode.ConfigurationTarget.Global
            );

            vscode.window.showInformationMessage(`Applied syntax theme: ${selectedPreBuilt.id}`);
        }
    }

    // Reset syntax highlighting
    async function resetSyntaxHighlighting() {
        await vscode.workspace.getConfiguration('editor').update(
            'tokenColorCustomizations',
            undefined,
            vscode.ConfigurationTarget.Global
        );

        vscode.window.showInformationMessage('All syntax highlighting customizations have been removed');
    }
    
    // Helper function to update recently used elements
    function updateRecentlyUsed(type, item) {
        // Check if item is already in the list
        const existingIndex = lastUsedElements[type].findIndex(
            existing => (type === 'theme' ? 
                existing.setting === item.setting : 
                existing.scope === item.scope)
        );
        
        // Remove if exists
        if (existingIndex !== -1) {
            lastUsedElements[type].splice(existingIndex, 1);
        }
        
        // Add to the beginning
        lastUsedElements[type].unshift(item);
        
        // Trim to max size
        if (lastUsedElements[type].length > MAX_RECENT_ITEMS) {
            lastUsedElements[type] = lastUsedElements[type].slice(0, MAX_RECENT_ITEMS);
        }
    }
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};