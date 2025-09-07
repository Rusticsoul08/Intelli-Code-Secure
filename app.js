// Intelli-Code Secure Application JavaScript

// Application data
const appData = {
    sampleCode: {
        python: `def process_data(data):
    result = []
    for item in data:
        if item > 0:
            result.append(item * 2)
    return result

# SQL query example (vulnerability)
def get_user(user_input):
    query = "SELECT * FROM users WHERE name = '" + user_input + "'"
    return execute_query(query)`,
        javascript: `function calculateTotal(items) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
}

// Potential XSS vulnerability
function displayMessage(message) {
    document.getElementById('output').innerHTML = message;
}`,
        java: `public class DataProcessor {
    public List<Integer> processData(List<Integer> data) {
        List<Integer> result = new ArrayList<>();
        for (Integer item : data) {
            if (item > 0) {
                result.add(item * 2);
            }
        }
        return result;
    }
}`,
        cpp: `#include <vector>
#include <iostream>

class DataProcessor {
public:
    std::vector<int> processData(const std::vector<int>& data) {
        std::vector<int> result;
        for (int item : data) {
            if (item > 0) {
                result.push_back(item * 2);
            }
        }
        return result;
    }
};`,
        typescript: `interface Item {
    price: number;
    name: string;
}

function calculateTotal(items: Item[]): number {
    let total: number = 0;
    for (let i = 0; i < items.length; i++) {
        total += items[i].price;
    }
    return total;
}`,
        go: `package main

import "fmt"

func processData(data []int) []int {
    var result []int
    for _, item := range data {
        if item > 0 {
            result = append(result, item*2)
        }
    }
    return result
}`,
        rust: `fn process_data(data: Vec<i32>) -> Vec<i32> {
    let mut result = Vec::new();
    for item in data {
        if item > 0 {
            result.push(item * 2);
        }
    }
    result
}`
    }
};

// Application state
let currentAnalysis = null;
let analysisHistory = [];
let appSettings = {
    strictMode: false,
    autoSave: true,
    showLineNumbers: true,
    emailNotifications: false,
    securityAlerts: true,
    exportFormat: 'pdf'
};

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

function initializeApp() {
    // Load saved data from localStorage
    loadSavedData();

    // Set initial theme
    initializeTheme();

    // Show home section by default
    showSection('home');

    // Setup all event listeners
    setupAllEventListeners();

    // Initialize dashboard
    updateDashboard();

    console.log('App initialized successfully');
}

function loadSavedData() {
    try {
        const savedHistory = localStorage.getItem('analysisHistory');
        const savedSettings = localStorage.getItem('appSettings');

        if (savedHistory) {
            analysisHistory = JSON.parse(savedHistory);
        }

        if (savedSettings) {
            appSettings = { ...appSettings, ...JSON.parse(savedSettings) };
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

function saveData() {
    try {
        localStorage.setItem('analysisHistory', JSON.stringify(analysisHistory));
        localStorage.setItem('appSettings', JSON.stringify(appSettings));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeToggle').textContent = '☀️';
    }
}

function setupAllEventListeners() {
    // Navigation
    setupNavigationListeners();

    // Theme toggle
    setupThemeToggle();

    // Analyzer
    setupAnalyzerListeners();

    // Settings
    setupSettingsListeners();

    // General
    setupGeneralListeners();
}

function setupNavigationListeners() {
    document.querySelectorAll('.nav-link, .cta-button').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            if (section) {
                showSection(section);
                updateActiveNavLink(section);
            }
        });
    });
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

function setupAnalyzerListeners() {
    // Language select change
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.addEventListener('change', () => {
        const selectedLanguage = languageSelect.value;
        updateCodeEditorForLanguage(selectedLanguage);
    });

    // Load sample code
    const loadSampleBtn = document.getElementById('loadSampleBtn');
    loadSampleBtn.addEventListener('click', () => {
        const selectedLanguage = languageSelect.value;
        const sampleCode = appData.sampleCode[selectedLanguage] || '';
        document.getElementById('codeInput').value = sampleCode;
    });

    // Clear code
    const clearCodeBtn = document.getElementById('clearCodeBtn');
    clearCodeBtn.addEventListener('click', () => {
        document.getElementById('codeInput').value = '';
    });

    // Analyze code
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.addEventListener('click', () => {
        const code = document.getElementById('codeInput').value;
        const language = languageSelect.value;

        if (!code.trim()) {
            alert('Please enter some code to analyze.');
            return;
        }

        analyzeCode(code, language);
    });

    // File upload
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('codeInput').value = e.target.result;
                // Try to determine language from file extension
                const ext = file.name.split('.').pop().toLowerCase();
                const langMap = {
                    'py': 'python',
                    'js': 'javascript',
                    'java': 'java',
                    'cpp': 'cpp',
                    'c': 'cpp',
                    'ts': 'typescript',
                    'go': 'go',
                    'rs': 'rust'
                };
                if (langMap[ext]) {
                    languageSelect.value = langMap[ext];
                }
            };
            reader.readAsText(file);
        }
    });

    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.getAttribute('data-tab');
            switchTab(tabName);
        });
    });

    // Export and save buttons
    const exportBtn = document.getElementById('exportBtn');
    const saveAnalysisBtn = document.getElementById('saveAnalysisBtn');

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            if (currentAnalysis) {
                exportAnalysis(currentAnalysis);
            }
        });
    }

    if (saveAnalysisBtn) {
        saveAnalysisBtn.addEventListener('click', () => {
            if (currentAnalysis) {
                saveAnalysis(currentAnalysis);
            }
        });
    }
}

function setupSettingsListeners() {
    // Save settings
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }

    // Reset settings
    const resetSettingsBtn = document.getElementById('resetSettingsBtn');
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', resetSettings);
    }

    // Clear data
    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearAllData);
    }

    // Load current settings
    loadCurrentSettings();
}

function setupGeneralListeners() {
    // Handle clicks outside modals or dropdowns
    document.addEventListener('click', (e) => {
        // Add any global click handlers here
    });
}

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function updateActiveNavLink(activeSection) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === activeSection) {
            link.classList.add('active');
        }
    });
}

function updateCodeEditorForLanguage(language) {
    // This could be enhanced with syntax highlighting in the future
    const codeInput = document.getElementById('codeInput');
    codeInput.placeholder = `Enter your ${language} code here for analysis...`;
}

function analyzeCode(code, language) {
    // Show loading overlay
    showLoadingOverlay();

    // Simulate analysis with progress
    simulateAnalysisProgress().then(() => {
        // Generate mock analysis results
        const analysisResult = generateMockAnalysis(code, language);

        // Display results
        displayAnalysisResults(analysisResult);

        // Store current analysis
        currentAnalysis = analysisResult;

        // Auto-save if enabled
        if (appSettings.autoSave) {
            saveAnalysis(analysisResult);
        }

        // Hide loading overlay
        hideLoadingOverlay();
    });
}

function simulateAnalysisProgress() {
    return new Promise((resolve) => {
        const progressFill = document.getElementById('progressFill');
        let progress = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(resolve, 500);
            }
            progressFill.style.width = progress + '%';
        }, 200);
    });
}

function generateMockAnalysis(code, language) {
    const codeLines = code.split('\n').length;
    const baseQualityScore = Math.floor(Math.random() * 30) + 70; // 70-99
    const baseSecurityScore = Math.floor(Math.random() * 25) + 75; // 75-99

    const issues = [];
    const suggestions = [];
    const performanceTips = [];

    // Generate quality issues
    if (code.includes('for') && code.includes('append')) {
        issues.push({
            type: 'quality',
            severity: 'medium',
            line: Math.floor(Math.random() * codeLines) + 1,
            message: 'Consider using list comprehension for better readability and performance',
            suggestion: 'Replace loop with list comprehension: result = [x*2 for x in data if x > 0]'
        });
    }

    if (code.includes('++') || code.includes('i < length')) {
        issues.push({
            type: 'quality',
            severity: 'low',
            line: Math.floor(Math.random() * codeLines) + 1,
            message: 'Consider using enhanced for loop or iterator',
            suggestion: 'Use for-each loop for better readability: for (Item item : items)'
        });
    }

    // Generate security issues
    if (code.includes('SELECT') && code.includes('+')) {
        issues.push({
            type: 'security',
            severity: 'high',
            line: Math.floor(Math.random() * codeLines) + 1,
            message: 'Potential SQL injection vulnerability detected',
            suggestion: 'Use parameterized queries: query = "SELECT * FROM users WHERE name = ?"'
        });
    }

    if (code.includes('innerHTML')) {
        issues.push({
            type: 'security',
            severity: 'high',
            line: Math.floor(Math.random() * codeLines) + 1,
            message: 'Potential XSS vulnerability with innerHTML',
            suggestion: 'Use textContent or sanitize input: element.textContent = safeContent'
        });
    }

    // Generate refactoring suggestions
    suggestions.push({
        title: 'Extract Method',
        description: 'Consider extracting repeated code into a separate method',
        impact: 'Improves code maintainability and reduces duplication',
        example: 'Create a helper method for data validation'
    });

    if (language === 'python') {
        suggestions.push({
            title: 'Use Type Hints',
            description: 'Add type annotations for better code documentation',
            impact: 'Improves code readability and helps with IDE support',
            example: 'def process_data(data: List[int]) -> List[int]:'
        });
    }

    // Generate performance tips
    performanceTips.push({
        title: 'Algorithm Optimization',
        description: 'Current time complexity can be improved',
        recommendation: 'Consider using more efficient data structures or algorithms',
        impact: '15-30% performance improvement expected'
    });

    performanceTips.push({
        title: 'Memory Usage',
        description: 'Optimize memory allocation patterns',
        recommendation: 'Reuse objects where possible and avoid unnecessary copying',
        impact: '10-20% memory usage reduction'
    });

    return {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        language: language,
        code: code,
        qualityScore: baseQualityScore,
        securityScore: baseSecurityScore,
        issues: issues,
        suggestions: suggestions,
        performanceTips: performanceTips,
        linesOfCode: codeLines
    };
}

function displayAnalysisResults(analysis) {
    // Show results section
    const resultsSection = document.getElementById('analysisResults');
    resultsSection.style.display = 'block';

    // Update scores
    document.getElementById('qualityScore').textContent = analysis.qualityScore;
    document.getElementById('securityScore').textContent = analysis.securityScore;

    // Display issues
    displayIssues('qualityIssues', analysis.issues.filter(issue => issue.type === 'quality'));
    displayIssues('securityIssues', analysis.issues.filter(issue => issue.type === 'security'));

    // Display suggestions
    displaySuggestions(analysis.suggestions);

    // Display performance tips
    displayPerformanceTips(analysis.performanceTips);

    // Switch to quality tab by default
    switchTab('quality');
}

function displayIssues(containerId, issues) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (issues.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No issues found! Great work! 🎉</p></div>';
        return;
    }

    container.innerHTML = issues.map(issue => `
        <div class="issue-item ${issue.severity}">
            <div class="issue-header">
                <span class="issue-title">${issue.message}</span>
                <span class="issue-line">Line ${issue.line}</span>
            </div>
            <div class="issue-suggestion">${issue.suggestion}</div>
        </div>
    `).join('');
}

function displaySuggestions(suggestions) {
    const container = document.getElementById('refactoringSuggestions');
    if (!container) return;

    if (suggestions.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No refactoring suggestions at this time.</p></div>';
        return;
    }

    container.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-item">
            <h4>${suggestion.title}</h4>
            <p class="issue-message">${suggestion.description}</p>
            <div class="issue-suggestion">${suggestion.example}</div>
            <p><strong>Impact:</strong> ${suggestion.impact}</p>
        </div>
    `).join('');
}

function displayPerformanceTips(tips) {
    const container = document.getElementById('performanceTips');
    if (!container) return;

    if (tips.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No performance optimizations suggested.</p></div>';
        return;
    }

    container.innerHTML = tips.map(tip => `
        <div class="tip-item">
            <h4>${tip.title}</h4>
            <p class="issue-message">${tip.description}</p>
            <p><strong>Recommendation:</strong> ${tip.recommendation}</p>
            <p><strong>Expected Impact:</strong> ${tip.impact}</p>
        </div>
    `).join('');
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabName) {
            btn.classList.add('active');
        }
    });

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    const activePane = document.getElementById(tabName);
    if (activePane) {
        activePane.classList.add('active');
    }
}

function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
        // Reset progress
        document.getElementById('progressFill').style.width = '0%';
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function saveAnalysis(analysis) {
    // Add to history
    analysisHistory.unshift(analysis);

    // Limit history to 50 entries
    if (analysisHistory.length > 50) {
        analysisHistory = analysisHistory.slice(0, 50);
    }

    // Save to localStorage
    saveData();

    // Update dashboard
    updateDashboard();

    // Show success message
    showNotification('Analysis saved successfully!', 'success');
}

function exportAnalysis(analysis) {
    const format = appSettings.exportFormat || 'pdf';

    if (format === 'json') {
        downloadJSON(analysis);
    } else if (format === 'csv') {
        downloadCSV(analysis);
    } else {
        // Default to PDF-like report
        downloadReport(analysis);
    }

    showNotification(`Analysis exported as ${format.toUpperCase()}`, 'success');
}

function downloadJSON(analysis) {
    const dataStr = JSON.stringify(analysis, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `analysis_${analysis.id}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function downloadCSV(analysis) {
    const csvContent = [
        ['Metric', 'Value'],
        ['Language', analysis.language],
        ['Quality Score', analysis.qualityScore],
        ['Security Score', analysis.securityScore],
        ['Lines of Code', analysis.linesOfCode],
        ['Issues Found', analysis.issues.length],
        ['Timestamp', new Date(analysis.timestamp).toLocaleString()]
    ].map(row => row.join(',')).join('\n');

    const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
    const exportFileDefaultName = `analysis_${analysis.id}.csv`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function downloadReport(analysis) {
    const reportContent = `
INTELLI-CODE SECURE - ANALYSIS REPORT
====================================

Date: ${new Date(analysis.timestamp).toLocaleString()}
Language: ${analysis.language}
Lines of Code: ${analysis.linesOfCode}

SCORES
------
Quality Score: ${analysis.qualityScore}/100
Security Score: ${analysis.securityScore}/100

ISSUES FOUND
-----------
${analysis.issues.map(issue => `
• ${issue.message} (Line ${issue.line}) - ${issue.severity}
  Suggestion: ${issue.suggestion}
`).join('')}

REFACTORING SUGGESTIONS
----------------------
${analysis.suggestions.map(suggestion => `
• ${suggestion.title}
  ${suggestion.description}
  Impact: ${suggestion.impact}
`).join('')}

PERFORMANCE TIPS
---------------
${analysis.performanceTips.map(tip => `
• ${tip.title}
  ${tip.description}
  Recommendation: ${tip.recommendation}
  Expected Impact: ${tip.impact}
`).join('')}

Generated by Intelli-Code Secure
    `;

    const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(reportContent);
    const exportFileDefaultName = `analysis_report_${analysis.id}.txt`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

function updateDashboard() {
    // Update statistics
    const totalAnalyses = analysisHistory.length;
    const totalIssues = analysisHistory.reduce((sum, analysis) => sum + analysis.issues.length, 0);
    const avgScore = totalAnalyses > 0 ? 
        Math.round(analysisHistory.reduce((sum, analysis) => sum + analysis.qualityScore, 0) / totalAnalyses) : 0;

    // Update DOM elements
    const totalAnalysesEl = document.getElementById('totalAnalyses');
    const issuesFoundEl = document.getElementById('issuesFound');
    const issuesFixedEl = document.getElementById('issuesFixed');
    const avgScoreEl = document.getElementById('avgScore');

    if (totalAnalysesEl) totalAnalysesEl.textContent = totalAnalyses;
    if (issuesFoundEl) issuesFoundEl.textContent = totalIssues;
    if (issuesFixedEl) issuesFixedEl.textContent = Math.floor(totalIssues * 0.7); // Assume 70% fixed
    if (avgScoreEl) avgScoreEl.textContent = avgScore || '--';

    // Update history list
    updateHistoryList();
}

function updateHistoryList() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    if (analysisHistory.length === 0) {
        historyList.innerHTML = '<div class="empty-state"><p>No analyses yet. Start by analyzing some code!</p></div>';
        return;
    }

    historyList.innerHTML = analysisHistory.slice(0, 10).map(analysis => `
        <div class="history-item">
            <div class="history-info">
                <h4>${analysis.language} Analysis</h4>
                <p>${new Date(analysis.timestamp).toLocaleString()} • ${analysis.linesOfCode} lines</p>
            </div>
            <div class="history-scores">
                <div class="history-score">
                    <div class="history-score-value">${analysis.qualityScore}</div>
                    <div class="history-score-label">Quality</div>
                </div>
                <div class="history-score">
                    <div class="history-score-value">${analysis.securityScore}</div>
                    <div class="history-score-label">Security</div>
                </div>
            </div>
        </div>
    `).join('');
}

function loadCurrentSettings() {
    // Load settings into form elements
    const elements = {
        'strictMode': document.getElementById('strictMode'),
        'autoSave': document.getElementById('autoSave'),
        'showLineNumbers': document.getElementById('showLineNumbers'),
        'emailNotifications': document.getElementById('emailNotifications'),
        'securityAlerts': document.getElementById('securityAlerts'),
        'exportFormat': document.getElementById('exportFormat')
    };

    Object.keys(elements).forEach(key => {
        const element = elements[key];
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = appSettings[key];
            } else {
                element.value = appSettings[key];
            }
        }
    });
}

function saveSettings() {
    // Get values from form elements
    const elements = {
        'strictMode': document.getElementById('strictMode'),
        'autoSave': document.getElementById('autoSave'),
        'showLineNumbers': document.getElementById('showLineNumbers'),
        'emailNotifications': document.getElementById('emailNotifications'),
        'securityAlerts': document.getElementById('securityAlerts'),
        'exportFormat': document.getElementById('exportFormat')
    };

    Object.keys(elements).forEach(key => {
        const element = elements[key];
        if (element) {
            if (element.type === 'checkbox') {
                appSettings[key] = element.checked;
            } else {
                appSettings[key] = element.value;
            }
        }
    });

    // Save to localStorage
    saveData();

    showNotification('Settings saved successfully!', 'success');
}

function resetSettings() {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        appSettings = {
            strictMode: false,
            autoSave: true,
            showLineNumbers: true,
            emailNotifications: false,
            securityAlerts: true,
            exportFormat: 'pdf'
        };

        loadCurrentSettings();
        saveData();

        showNotification('Settings reset to default!', 'info');
    }
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all analysis data? This cannot be undone.')) {
        analysisHistory = [];
        currentAnalysis = null;

        // Clear localStorage
        localStorage.removeItem('analysisHistory');

        // Update dashboard
        updateDashboard();

        // Clear results
        const resultsSection = document.getElementById('analysisResults');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }

        showNotification('All data cleared successfully!', 'info');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--surface-color);
        color: var(--text-color);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 20px var(--shadow-color);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;

    // Add type-specific styling
    if (type === 'success') {
        notification.style.borderLeftColor = 'var(--success-color)';
    } else if (type === 'error') {
        notification.style.borderLeftColor = 'var(--danger-color)';
    } else if (type === 'warning') {
        notification.style.borderLeftColor = 'var(--warning-color)';
    }

    // Add to DOM
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Utility functions
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getLanguageIcon(language) {
    const icons = {
        'python': '🐍',
        'javascript': '📜',
        'java': '☕',
        'cpp': '⚙️',
        'typescript': '📘',
        'go': '🔷',
        'rust': '🦀'
    };
    return icons[language] || '📄';
}

// Initialize error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    showNotification('An error occurred. Please try again.', 'error');
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('An error occurred. Please try again.', 'error');
});
