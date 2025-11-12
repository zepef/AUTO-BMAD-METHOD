const chalk = require('chalk');
const path = require('node:path');
const fs = require('fs-extra');
const { Installer } = require('../installers/lib/core/installer');
const { getProjectRoot } = require('../lib/project-root');

const installer = new Installer();

/**
 * Health check command - validates installation integrity
 */
module.exports = {
  command: 'doctor',
  description: 'Run health checks on BMad installation',
  options: [['-d, --directory <path>', 'Installation directory', '.'], ['--verbose', 'Show detailed output']],
  action: async (options) => {
    console.log(chalk.cyan('\n🏥 BMad Installation Health Check\n'));

    const checks = [];
    let totalChecks = 0;
    let passedChecks = 0;

    try {
      const projectRoot = await getProjectRoot(options.directory);

      // Check 1: Installation exists
      totalChecks++;
      const status = await installer.getStatus(options.directory);
      if (status.installed) {
        passedChecks++;
        checks.push({ name: 'Installation exists', status: 'pass', message: `Found at ${status.path}` });
      } else {
        checks.push({ name: 'Installation exists', status: 'fail', message: 'No BMad installation found' });
      }

      if (!status.installed) {
        printResults(checks, totalChecks, passedChecks);
        console.log(chalk.yellow('\n💡 Run "bmad install" to set up BMad Method\n'));
        process.exit(1);
      }

      const bmadPath = status.path;

      // Check 2: Core manifest
      totalChecks++;
      const manifestPath = path.join(bmadPath, '_cfg', 'manifest.yaml');
      if (await fs.pathExists(manifestPath)) {
        passedChecks++;
        checks.push({ name: 'Core manifest', status: 'pass', message: 'manifest.yaml exists' });
      } else {
        checks.push({ name: 'Core manifest', status: 'fail', message: 'manifest.yaml missing' });
      }

      // Check 3: Core configuration
      totalChecks++;
      const coreConfigPath = path.join(bmadPath, 'core', 'config.yaml');
      if (await fs.pathExists(coreConfigPath)) {
        passedChecks++;
        checks.push({ name: 'Core configuration', status: 'pass', message: 'config.yaml exists' });

        // Validate config content
        try {
          const yaml = require('js-yaml');
          const configContent = await fs.readFile(coreConfigPath, 'utf8');
          const config = yaml.load(configContent);

          // Check required fields
          const requiredFields = ['bmad_folder', 'user_name', 'communication_language', 'output_folder'];
          const missingFields = requiredFields.filter((field) => !config[field]);

          if (missingFields.length === 0) {
            if (options.verbose) {
              checks.push({
                name: 'Core config validation',
                status: 'pass',
                message: 'All required fields present',
              });
            }
          } else {
            checks.push({
              name: 'Core config validation',
              status: 'warn',
              message: `Missing fields: ${missingFields.join(', ')}`,
            });
          }
        } catch (error) {
          checks.push({ name: 'Core config validation', status: 'warn', message: `Parse error: ${error.message}` });
        }
      } else {
        checks.push({ name: 'Core configuration', status: 'fail', message: 'config.yaml missing' });
      }

      // Check 4: Module configurations
      totalChecks++;
      let allModuleConfigsExist = true;
      const moduleConfigIssues = [];

      for (const mod of status.modules) {
        const modConfigPath = path.join(bmadPath, mod.id, 'config.yaml');
        if (!(await fs.pathExists(modConfigPath))) {
          allModuleConfigsExist = false;
          moduleConfigIssues.push(`${mod.id}/config.yaml missing`);
        }
      }

      if (allModuleConfigsExist && status.modules.length > 0) {
        passedChecks++;
        checks.push({
          name: 'Module configurations',
          status: 'pass',
          message: `All ${status.modules.length} module configs exist`,
        });
      } else if (status.modules.length === 0) {
        checks.push({ name: 'Module configurations', status: 'warn', message: 'No modules installed' });
      } else {
        checks.push({
          name: 'Module configurations',
          status: 'fail',
          message: moduleConfigIssues.join(', '),
        });
      }

      // Check 5: Agent compilation
      totalChecks++;
      let agentIssues = [];

      for (const mod of status.modules) {
        const agentsPath = path.join(bmadPath, mod.id, 'agents');
        if (await fs.pathExists(agentsPath)) {
          const agentFiles = await fs.readdir(agentsPath);
          const mdFiles = agentFiles.filter((f) => f.endsWith('.md'));

          if (mdFiles.length === 0) {
            agentIssues.push(`${mod.id}: no agent files found`);
          }
        } else {
          agentIssues.push(`${mod.id}/agents directory missing`);
        }
      }

      if (agentIssues.length === 0 && status.modules.length > 0) {
        passedChecks++;
        checks.push({ name: 'Agent compilation', status: 'pass', message: 'All agents compiled' });
      } else if (status.modules.length === 0) {
        checks.push({ name: 'Agent compilation', status: 'warn', message: 'No modules to check' });
      } else {
        checks.push({ name: 'Agent compilation', status: 'fail', message: agentIssues.join('; ') });
      }

      // Check 6: Workflow files
      totalChecks++;
      let workflowIssues = [];

      for (const mod of status.modules) {
        const workflowsPath = path.join(bmadPath, mod.id, 'workflows');
        if (await fs.pathExists(workflowsPath)) {
          const workflowDirs = await fs.readdir(workflowsPath, { withFileTypes: true });
          const workflows = workflowDirs.filter((d) => d.isDirectory());

          if (workflows.length === 0) {
            workflowIssues.push(`${mod.id}: no workflows found`);
          }
        } else {
          workflowIssues.push(`${mod.id}/workflows directory missing`);
        }
      }

      if (workflowIssues.length === 0 && status.modules.length > 0) {
        passedChecks++;
        checks.push({ name: 'Workflow files', status: 'pass', message: 'All workflows present' });
      } else if (status.modules.length === 0) {
        checks.push({ name: 'Workflow files', status: 'warn', message: 'No modules to check' });
      } else {
        checks.push({ name: 'Workflow files', status: 'fail', message: workflowIssues.join('; ') });
      }

      // Check 7: Manifest generation
      totalChecks++;
      const manifestFiles = ['agent-manifest.csv', 'workflow-manifest.csv', 'task-manifest.csv'];
      const missingManifests = [];

      for (const file of manifestFiles) {
        const filePath = path.join(bmadPath, '_cfg', file);
        if (!(await fs.pathExists(filePath))) {
          missingManifests.push(file);
        }
      }

      if (missingManifests.length === 0) {
        passedChecks++;
        checks.push({ name: 'Manifest files', status: 'pass', message: 'All manifests generated' });
      } else {
        checks.push({
          name: 'Manifest files',
          status: 'fail',
          message: `Missing: ${missingManifests.join(', ')}`,
        });
      }

      // Check 8: IDE configuration
      totalChecks++;
      if (status.ides && status.ides.length > 0) {
        passedChecks++;
        checks.push({
          name: 'IDE configuration',
          status: 'pass',
          message: `${status.ides.length} IDE(s) configured`,
        });
      } else {
        checks.push({
          name: 'IDE configuration',
          status: 'warn',
          message: 'No IDEs configured (optional)',
        });
      }

      // Check 9: File permissions
      totalChecks++;
      try {
        // Test write access to bmad folder
        const testFile = path.join(bmadPath, '.health-check-test');
        await fs.writeFile(testFile, 'test');
        await fs.remove(testFile);
        passedChecks++;
        checks.push({ name: 'File permissions', status: 'pass', message: 'Write access verified' });
      } catch (error) {
        checks.push({ name: 'File permissions', status: 'fail', message: 'Cannot write to installation directory' });
      }

      // Check 10: Node.js version
      totalChecks++;
      const nodeVersion = process.version;
      const majorVersion = Number.parseInt(nodeVersion.slice(1).split('.')[0]);

      if (majorVersion >= 20) {
        passedChecks++;
        checks.push({ name: 'Node.js version', status: 'pass', message: `v${nodeVersion} (>= 20 required)` });
      } else {
        checks.push({
          name: 'Node.js version',
          status: 'fail',
          message: `v${nodeVersion} (>= 20 required, upgrade needed)`,
        });
      }

      // Print results
      printResults(checks, totalChecks, passedChecks, options.verbose);

      // Summary and recommendations
      const failedChecks = checks.filter((c) => c.status === 'fail');
      const warnChecks = checks.filter((c) => c.status === 'warn');

      if (failedChecks.length === 0 && warnChecks.length === 0) {
        console.log(chalk.green('\n✅ All checks passed! Installation is healthy.\n'));
        process.exit(0);
      } else if (failedChecks.length === 0) {
        console.log(chalk.yellow('\n⚠️  Installation is functional but has warnings.\n'));
        process.exit(0);
      } else {
        console.log(chalk.red('\n❌ Installation has issues that need attention.\n'));
        console.log(chalk.bold('Recommended actions:'));
        console.log('  1. Try reinstalling: bmad install --force');
        console.log('  2. Check file permissions in the installation directory');
        console.log('  3. Verify Node.js version: node --version');
        console.log('  4. Join Discord for help: https://discord.gg/gk8jAdXWmj\n');
        process.exit(1);
      }
    } catch (error) {
      console.error(chalk.red('Error running health check:'), error.message);
      if (options.verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  },
};

/**
 * Print check results in a formatted table
 */
function printResults(checks, totalChecks, passedChecks, verbose = false) {
  console.log('');

  for (const check of checks) {
    // Skip verbose checks unless verbose flag is set
    if (!verbose && check.name.includes('validation') && check.status === 'pass') {
      continue;
    }

    let icon, color;
    switch (check.status) {
      case 'pass': {
        icon = '✓';
        color = chalk.green;
        break;
      }
      case 'fail': {
        icon = '✗';
        color = chalk.red;
        break;
      }
      case 'warn': {
        icon = '⚠';
        color = chalk.yellow;
        break;
      }
      default: {
        icon = '?';
        color = chalk.dim;
      }
    }

    console.log(`${color(icon)} ${chalk.bold(check.name)}: ${color(check.message)}`);
  }

  console.log('');
  console.log(chalk.bold(`Summary: ${passedChecks}/${totalChecks} checks passed`));
}
