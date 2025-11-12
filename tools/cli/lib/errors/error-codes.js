/**
 * Standardized error codes for BMad Method
 * Format: CATEGORY_XXX where XXX is a 3-digit number
 */

const ErrorCodes = {
  // Installation Errors (INSTALL_001-099)
  INSTALL_001: {
    code: 'INSTALL_001',
    message: 'Failed to detect existing installation',
    resolution: 'Verify directory exists and contains valid BMad installation',
  },
  INSTALL_002: {
    code: 'INSTALL_002',
    message: 'Module dependency resolution failed',
    resolution: 'Check module dependencies in _module-installer/dependencies.yaml',
  },
  INSTALL_003: {
    code: 'INSTALL_003',
    message: 'Failed to copy installation files',
    resolution: 'Check disk space and file permissions',
  },
  INSTALL_004: {
    code: 'INSTALL_004',
    message: 'Agent compilation failed',
    resolution: 'Verify agent YAML syntax and schema validity',
  },
  INSTALL_005: {
    code: 'INSTALL_005',
    message: 'Manifest generation failed',
    resolution: 'Ensure all modules installed correctly',
  },
  INSTALL_006: {
    code: 'INSTALL_006',
    message: 'IDE configuration failed',
    resolution: 'Check IDE adapter exists for selected IDE',
  },
  INSTALL_007: {
    code: 'INSTALL_007',
    message: 'Installation directory already exists',
    resolution: 'Use --force to overwrite or choose different directory',
  },
  INSTALL_008: {
    code: 'INSTALL_008',
    message: 'Node.js version incompatible',
    resolution: 'Upgrade to Node.js v20 or higher',
  },
  INSTALL_009: {
    code: 'INSTALL_009',
    message: 'npm package not found or unreachable',
    resolution: 'Check network connection and npm registry access',
  },
  INSTALL_010: {
    code: 'INSTALL_010',
    message: 'Insufficient disk space',
    resolution: 'Free up disk space (at least 100MB required)',
  },

  // Configuration Errors (CONFIG_001-099)
  CONFIG_001: {
    code: 'CONFIG_001',
    message: 'Invalid configuration value',
    resolution: 'Check configuration syntax and data types',
  },
  CONFIG_002: {
    code: 'CONFIG_002',
    message: 'Required configuration field missing',
    resolution: 'Provide all required fields or run install --reset-config',
  },
  CONFIG_003: {
    code: 'CONFIG_003',
    message: 'YAML parsing error in configuration',
    resolution: 'Validate YAML syntax (check indentation, colons, quotes)',
  },
  CONFIG_004: {
    code: 'CONFIG_004',
    message: 'Configuration file not found',
    resolution: 'Reinstall or restore from backup',
  },
  CONFIG_005: {
    code: 'CONFIG_005',
    message: 'Variable resolution failed',
    resolution: 'Check variable names and config inheritance chain',
  },
  CONFIG_006: {
    code: 'CONFIG_006',
    message: 'Circular dependency in configuration',
    resolution: 'Remove circular references in config variables',
  },
  CONFIG_007: {
    code: 'CONFIG_007',
    message: 'External config file not found',
    resolution: 'Check config_source path in workflow.yaml',
  },

  // Module Errors (MODULE_001-099)
  MODULE_001: {
    code: 'MODULE_001',
    message: 'Module not found',
    resolution: 'Install module with: bmad install --modules=<module-name>',
  },
  MODULE_002: {
    code: 'MODULE_002',
    message: 'Module version incompatible',
    resolution: 'Update module or BMad core to compatible versions',
  },
  MODULE_003: {
    code: 'MODULE_003',
    message: 'Module installer script failed',
    resolution: 'Check module installer.js for errors',
  },
  MODULE_004: {
    code: 'MODULE_004',
    message: 'Module manifest invalid or corrupted',
    resolution: 'Reinstall module with --force flag',
  },

  // Workflow Errors (WORKFLOW_001-099)
  WORKFLOW_001: {
    code: 'WORKFLOW_001',
    message: 'Workflow not found',
    resolution: 'Check workflow name spelling or install missing module',
  },
  WORKFLOW_002: {
    code: 'WORKFLOW_002',
    message: 'Workflow marked as not implemented (todo)',
    resolution: 'Workflow not yet available - check module documentation',
  },
  WORKFLOW_003: {
    code: 'WORKFLOW_003',
    message: 'Workflow configuration invalid',
    resolution: 'Check workflow.yaml syntax and required fields',
  },
  WORKFLOW_004: {
    code: 'WORKFLOW_004',
    message: 'Workflow prerequisite not met',
    resolution: 'Complete prerequisite workflows first (run workflow-status)',
  },
  WORKFLOW_005: {
    code: 'WORKFLOW_005',
    message: 'Workflow input file not found',
    resolution: 'Ensure required input files exist (check workflow docs)',
  },

  // Agent Errors (AGENT_001-099)
  AGENT_001: {
    code: 'AGENT_001',
    message: 'Agent file not found',
    resolution: 'Verify agent exists in .bmad/<module>/agents/',
  },
  AGENT_002: {
    code: 'AGENT_002',
    message: 'Agent schema validation failed',
    resolution: 'Check agent YAML matches schema requirements',
  },
  AGENT_003: {
    code: 'AGENT_003',
    message: 'Agent compilation failed',
    resolution: 'Check agent YAML syntax and variable references',
  },
  AGENT_004: {
    code: 'AGENT_004',
    message: 'Agent customization invalid',
    resolution: 'Check _cfg/agents/<agent>.yaml syntax',
  },

  // File System Errors (FS_001-099)
  FS_001: {
    code: 'FS_001',
    message: 'Permission denied',
    resolution: 'Check file/directory permissions or run with appropriate access',
  },
  FS_002: {
    code: 'FS_002',
    message: 'File or directory not found',
    resolution: 'Verify path exists and is accessible',
  },
  FS_003: {
    code: 'FS_003',
    message: 'File already exists',
    resolution: 'Use different filename or --force to overwrite',
  },
  FS_004: {
    code: 'FS_004',
    message: 'Read/write operation failed',
    resolution: 'Check disk space, permissions, and file locks',
  },

  // IDE Integration Errors (IDE_001-099)
  IDE_001: {
    code: 'IDE_001',
    message: 'IDE type not recognized',
    resolution: 'Use supported IDE or check spelling (see docs/ide-info/)',
  },
  IDE_002: {
    code: 'IDE_002',
    message: 'IDE configuration file creation failed',
    resolution: 'Check permissions in IDE config directory',
  },
  IDE_003: {
    code: 'IDE_003',
    message: 'IDE adapter not found',
    resolution: 'IDE may not be supported - check available adapters',
  },

  // Validation Errors (VALID_001-099)
  VALID_001: {
    code: 'VALID_001',
    message: 'Schema validation failed',
    resolution: 'Check data matches expected schema',
  },
  VALID_002: {
    code: 'VALID_002',
    message: 'Required field missing',
    resolution: 'Provide all required fields',
  },
  VALID_003: {
    code: 'VALID_003',
    message: 'Invalid data type',
    resolution: 'Check data types match schema expectations',
  },
  VALID_004: {
    code: 'VALID_004',
    message: 'Value out of valid range',
    resolution: 'Provide value within allowed range',
  },

  // Network Errors (NETWORK_001-099)
  NETWORK_001: {
    code: 'NETWORK_001',
    message: 'Network request failed',
    resolution: 'Check internet connection and try again',
  },
  NETWORK_002: {
    code: 'NETWORK_002',
    message: 'npm registry unreachable',
    resolution: 'Check network connection and npm configuration',
  },
  NETWORK_003: {
    code: 'NETWORK_003',
    message: 'Request timeout',
    resolution: 'Check network speed and try again',
  },

  // General Errors (GENERAL_001-099)
  GENERAL_001: {
    code: 'GENERAL_001',
    message: 'Unknown error occurred',
    resolution: 'Check logs and report issue if persistent',
  },
  GENERAL_002: {
    code: 'GENERAL_002',
    message: 'Operation cancelled by user',
    resolution: 'Operation was cancelled - no action needed',
  },
  GENERAL_003: {
    code: 'GENERAL_003',
    message: 'Invalid command or option',
    resolution: 'Check command syntax (run bmad --help)',
  },
};

/**
 * Get error details by code
 * @param {string} code - Error code (e.g., 'INSTALL_001')
 * @returns {Object} Error details or generic error if code not found
 */
function getErrorDetails(code) {
  return (
    ErrorCodes[code] || {
      code: code || 'UNKNOWN',
      message: 'Unknown error',
      resolution: 'Check documentation or contact support',
    }
  );
}

/**
 * Get all errors in a category
 * @param {string} category - Error category (e.g., 'INSTALL', 'CONFIG')
 * @returns {Array} Array of error objects in category
 */
function getErrorsByCategory(category) {
  return Object.values(ErrorCodes).filter((err) => err.code.startsWith(category));
}

/**
 * Search errors by keyword
 * @param {string} keyword - Keyword to search for
 * @returns {Array} Array of matching error objects
 */
function searchErrors(keyword) {
  const lowerKeyword = keyword.toLowerCase();
  return Object.values(ErrorCodes).filter(
    (err) => err.message.toLowerCase().includes(lowerKeyword) || err.resolution.toLowerCase().includes(lowerKeyword),
  );
}

module.exports = {
  ErrorCodes,
  getErrorDetails,
  getErrorsByCategory,
  searchErrors,
};
