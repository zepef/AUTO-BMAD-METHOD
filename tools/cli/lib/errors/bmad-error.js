const { getErrorDetails } = require('./error-codes');

/**
 * Custom error class for BMad Method
 * Provides structured error information with codes and resolutions
 */
class BmadError extends Error {
  /**
   * Create a BMad error
   * @param {string} code - Error code from ErrorCodes
   * @param {Object} options - Additional error options
   * @param {string} options.details - Additional error details
   * @param {Error} options.cause - Original error that caused this
   * @param {Object} options.context - Additional context data
   */
  constructor(code, options = {}) {
    const errorInfo = getErrorDetails(code);

    // Build message
    let message = `[${errorInfo.code}] ${errorInfo.message}`;
    if (options.details) {
      message += `\n  Details: ${options.details}`;
    }
    message += `\n  Resolution: ${errorInfo.resolution}`;

    super(message);

    this.name = 'BmadError';
    this.code = errorInfo.code;
    this.errorMessage = errorInfo.message;
    this.resolution = errorInfo.resolution;
    this.details = options.details;
    this.context = options.context || {};

    // Preserve original error if provided
    if (options.cause) {
      this.cause = options.cause;
      this.stack = `${this.stack}\nCaused by: ${options.cause.stack}`;
    }
  }

  /**
   * Format error for display to user
   * @param {boolean} verbose - Include stack trace and context
   * @returns {string} Formatted error message
   */
  format(verbose = false) {
    const chalk = require('chalk');

    let output = chalk.red(`\n❌ Error ${this.code}: ${this.errorMessage}\n`);

    if (this.details) {
      output += chalk.yellow(`\n📋 Details:\n${this.details}\n`);
    }

    output += chalk.cyan(`\n💡 Resolution:\n${this.resolution}\n`);

    if (verbose) {
      if (Object.keys(this.context).length > 0) {
        output += chalk.dim(`\n🔍 Context:\n${JSON.stringify(this.context, null, 2)}\n`);
      }

      if (this.cause) {
        output += chalk.dim(`\n⚠️  Caused by:\n${this.cause.message}\n`);
      }

      output += chalk.dim(`\n📍 Stack trace:\n${this.stack}\n`);
    }

    output += chalk.gray('\n💬 Need help? https://discord.gg/gk8jAdXWmj\n');

    return output;
  }

  /**
   * Convert to JSON for logging
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.errorMessage,
      details: this.details,
      resolution: this.resolution,
      context: this.context,
      cause: this.cause ? this.cause.message : undefined,
      stack: this.stack,
    };
  }

  /**
   * Create error from unknown error object
   * @param {Error} error - Original error
   * @param {string} code - BMad error code to use
   * @returns {BmadError} Wrapped error
   */
  static from(error, code = 'GENERAL_001') {
    if (error instanceof BmadError) {
      return error;
    }

    return new BmadError(code, {
      details: error.message,
      cause: error,
    });
  }

  /**
   * Throw installation error
   * @param {string} code - Installation error code
   * @param {string} details - Error details
   * @param {Object} context - Additional context
   */
  static installError(code, details, context) {
    throw new BmadError(code, { details, context });
  }

  /**
   * Throw configuration error
   * @param {string} code - Configuration error code
   * @param {string} details - Error details
   * @param {Object} context - Additional context
   */
  static configError(code, details, context) {
    throw new BmadError(code, { details, context });
  }

  /**
   * Throw module error
   * @param {string} code - Module error code
   * @param {string} details - Error details
   * @param {Object} context - Additional context
   */
  static moduleError(code, details, context) {
    throw new BmadError(code, { details, context });
  }

  /**
   * Throw workflow error
   * @param {string} code - Workflow error code
   * @param {string} details - Error details
   * @param {Object} context - Additional context
   */
  static workflowError(code, details, context) {
    throw new BmadError(code, { details, context });
  }

  /**
   * Throw file system error
   * @param {string} code - File system error code
   * @param {string} details - Error details
   * @param {Object} context - Additional context
   */
  static fsError(code, details, context) {
    throw new BmadError(code, { details, context });
  }
}

module.exports = { BmadError };
