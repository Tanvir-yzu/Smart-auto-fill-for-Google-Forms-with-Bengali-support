# AutoFill Pro - Google Forms

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](https://chrome.google.com/webstore)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green.svg)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Version](https://img.shields.io/badge/Version-2.0.0-orange.svg)](manifest.json)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A smart Chrome extension that automatically fills Google Forms with intelligent data recognition and Bengali language support. Streamline your form-filling experience with advanced pattern matching and customizable autofill rules.

## 🌟 Features

- **Smart AutoFill**: Automatically detects and fills form fields with intelligent pattern recognition
- **Bengali Language Support**: Full support for Bengali text input and form handling
- **Google Forms Integration**: Seamlessly works with Google Forms across all domains
- **Context Menu Integration**: Right-click context menu for quick access
- **Customizable Rules**: Configure autofill patterns and preferences
- **Secure Storage**: Local storage for your autofill data and preferences
- **Modern Manifest V3**: Built with the latest Chrome extension standards

## 📋 Prerequisites

- Google Chrome browser (version 88 or later)
- Active internet connection for Google Forms access
- Basic understanding of Chrome extension installation

## 🚀 Installation

### Method 1: Chrome Web Store (Recommended)
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore)
2. Search for "AutoFill Pro - Google Forms"
3. Click "Add to Chrome"
4. Confirm the installation when prompted

### Method 2: Developer Mode (For Development)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the extension directory
6. The extension will appear in your extensions list

### Method 3: Manual Installation
1. Download the latest release from the [releases page](../../releases)
2. Extract the ZIP file to a folder
3. Follow steps 2-6 from Method 2 above

## 🔧 Configuration

### Setting Up AutoFill Rules

1. Click the extension icon in your Chrome toolbar
2. Select "Options" or "Settings"
3. Configure your autofill preferences:
   - **Name Patterns**: Set up name recognition rules
   - **Email Formats**: Define email patterns
   - **Custom Fields**: Add specific field mappings
   - **Language Preferences**: Set Bengali/English preferences

### Context Menu Configuration

The extension automatically adds context menu options when you right-click on form fields:
- "AutoFill This Form"
- "Save Field Pattern"
- "Manage AutoFill Rules"

## 📖 Usage Examples

### Basic Usage

```javascript
// The extension automatically detects Google Forms
// No manual intervention required for basic autofill
```

### Advanced Configuration

```javascript
// Example: Custom field mapping
{
  "field_patterns": {
    "name": ["full_name", "your_name", "applicant_name"],
    "email": ["email_address", "contact_email", "user_email"],
    "phone": ["mobile", "contact_number", "phone_number"]
  }
}
```

### Bengali Text Support

```javascript
// The extension automatically handles Bengali Unicode text
// Example patterns for Bengali forms:
{
  "নাম": "name",
  "ইমেইল": "email",
  "ফোন": "phone",
  "ঠিকানা": "address"
}
```

## 🛠️ API Documentation

### Extension Permissions

The extension requires the following permissions:

| Permission | Purpose |
|------------|---------|
| `activeTab` | Access to the current tab for form detection |
| `storage` | Store user preferences and autofill data |
| `scripting` | Inject scripts into Google Forms pages |
| `contextMenus` | Add right-click menu options |
| `https://docs.google.com/forms/*` | Access to Google Forms domains |
| `<all_urls>` | Universal access for comprehensive form detection |

### Content Script Injection

```javascript
// Content script runs on Google Forms pages
{
  "matches": ["https://docs.google.com/forms/*"],
  "js": ["content.js"],
  "run_at": "document_end",
  "all_frames": true
}
```

### Background Service Worker

```javascript
// Background script handles:
// - Context menu creation
// - Storage management
// - Cross-tab communication
```

## 🐛 Troubleshooting

### Common Issues

#### Extension Not Working
- **Check Chrome Version**: Ensure you're using Chrome 88 or later
- **Verify Permissions**: Check that all required permissions are granted
- **Refresh Page**: Reload the Google Forms page after installation

#### AutoFill Not Triggering
- **Form Detection**: Some custom forms may not be detected automatically
- **Field Mapping**: Check if field names match configured patterns
- **Language Settings**: Verify Bengali support is enabled if needed

#### Context Menu Missing
- **Extension Enabled**: Ensure the extension is enabled in Chrome
- **Page Refresh**: Refresh the page to reload context menu items
- **Permission Issues**: Check browser console for permission errors

### Debug Mode

Enable debug mode to see detailed logs:
1. Right-click the extension icon
2. Select "Inspect popup"
3. Check the console for error messages

### Getting Help

If you encounter issues:
1. Check the [troubleshooting guide](../../wiki/Troubleshooting)
2. Search existing [issues](../../issues)
3. Create a new issue with detailed information

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/Tanvir-yzu/Smart-auto-fill-for-Google-Forms-with-Bengali-support.git
   cd autofill-extension
   ```

3. Load the extension in developer mode (see Installation Method 2)

### Code Style

- Follow Chrome Extension development best practices
- Use meaningful variable names
- Add comments for complex logic
- Test on multiple Google Forms variants

### Submitting Changes

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and test thoroughly

3. Commit with descriptive messages:
   ```bash
   git commit -m "Add: Bengali language support for address fields"
   ```

4. Push to your fork and create a Pull Request

### Pull Request Guidelines

- Include a clear description of changes
- Reference any related issues
- Add screenshots for UI changes
- Ensure all functionality works as expected
- Update documentation if needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Chrome Extension team for Manifest V3 documentation
- Bengali language contributors
- Open source community for inspiration and support

## 📚 Additional Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Google Forms API](https://developers.google.com/forms/api)
- [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)

## 📞 Support

- 💬 [Discussions](../../discussions) - Community support and questions
- 🐛 [Issues](../../issues) - Bug reports and feature requests
- 📧 [Email Support](mailto:support@autofillpro.com) - Direct email support
- 📖 [Wiki](../../wiki) - Detailed documentation and guides

---

**Made with ❤️ for the Chrome Extension Community**