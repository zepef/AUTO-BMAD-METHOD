# Example: Quick Flow Bug Fix

Complete walkthrough of fixing a bug using BMad Method's Quick Flow track.

---

## Scenario

You're working on a Node.js application that formats dates for display. Users report that dates are showing in the wrong timezone, displaying UTC instead of the user's local timezone.

**Bug Report:**

```
Title: Dates display in wrong timezone
Description: When viewing appointment times, they show in UTC instead of local time
Expected: "2:00 PM PST"
Actual: "10:00 PM UTC"
Severity: High - affects user experience
```

---

## Learning Objectives

By completing this example, you'll learn:

1. How to use the Quick Flow planning track
2. Creating a tech-spec for simple changes
3. Story-centric development workflow
4. Integration with existing codebases
5. Testing and validation practices

**Estimated time:** 15-30 minutes

---

## Prerequisites

- BMad Method installed (`npx bmad-method@alpha install`)
- BMM module selected during installation
- Your IDE configured (see [docs/ide-info/](../../docs/ide-info/))
- Basic understanding of Node.js and JavaScript

---

## Step-by-Step Walkthrough

### Step 1: Initial Setup (2 minutes)

1. **Create project directory**

   ```bash
   mkdir timezone-bug-fix
   cd timezone-bug-fix
   ```

2. **Create sample codebase**

   Create `src/dateFormatter.js`:

   ```javascript
   // Current implementation (buggy)
   function formatAppointmentTime(isoDate) {
     const date = new Date(isoDate);
     return date.toUTCString(); // BUG: Uses UTC instead of local
   }

   module.exports = { formatAppointmentTime };
   ```

   Create `src/appointments.js`:

   ```javascript
   const { formatAppointmentTime } = require('./dateFormatter');

   function displayAppointment(appointment) {
     console.log(`Appointment: ${appointment.title}`);
     console.log(`Time: ${formatAppointmentTime(appointment.dateTime)}`);
   }

   module.exports = { displayAppointment };
   ```

   Create `test/dateFormatter.test.js`:

   ```javascript
   const { formatAppointmentTime } = require('../src/dateFormatter');

   describe('formatAppointmentTime', () => {
     it('should format date in local timezone', () => {
       const isoDate = '2025-01-15T14:00:00Z'; // 2 PM UTC
       const result = formatAppointmentTime(isoDate);

       // Should NOT contain 'UTC' or 'GMT'
       expect(result).not.toContain('UTC');
       expect(result).not.toContain('GMT');

       // Should contain local time zone info
       // (exact format depends on user's locale)
     });
   });
   ```

3. **Initialize BMad Method**
   ```bash
   npx bmad-method@alpha install
   # Select BMM module
   # Choose Quick Flow when prompted (or run workflow-init later)
   ```

---

### Step 2: Run workflow-init (2 minutes)

1. **Load Developer agent**
   - Open `.bmad/bmm/agents/dev.md` in your IDE
   - Start a fresh chat

2. **Initialize workflow**

   ```
   *workflow-init
   ```

3. **Answer prompts:**
   - **Project goal:** "Fix timezone bug in date formatter"
   - **Project type:** "Existing codebase (brownfield)"
   - **Scope:** "Single bug fix"

4. **Expected outcome:**
   - BMad recommends **Quick Flow Track**
   - Creates `.bmad-ephemeral/workflow-path.yaml`
   - Suggests starting with tech-spec workflow

---

### Step 3: Create Tech-Spec (5-10 minutes)

1. **Start fresh chat** with Developer agent

2. **Run tech-spec workflow**

   ```
   *tech-spec
   ```

3. **Provide information when prompted:**

   **Problem Description:**

   ```
   Users report that appointment times display in UTC instead of local timezone.
   The formatAppointmentTime function in src/dateFormatter.js uses toUTCString()
   which always returns UTC time. This causes confusion for users in different
   timezones who see incorrect appointment times.

   Impact: High - affects all appointment displays
   Affected users: All users outside UTC timezone
   ```

   **Current Behavior:**

   ```
   Input: "2025-01-15T14:00:00Z" (2 PM UTC)
   Output: "Tue, 15 Jan 2025 14:00:00 GMT"

   Problem: Always shows GMT/UTC regardless of user's timezone
   ```

   **Desired Behavior:**

   ```
   Input: "2025-01-15T14:00:00Z" (2 PM UTC)
   Output (for PST user): "1/15/2025, 6:00:00 AM"
   Output (for EST user): "1/15/2025, 9:00:00 AM"

   Should display in user's local timezone with appropriate format
   ```

   **Solution Approach:**

   ```
   1. Replace toUTCString() with toLocaleString()
   2. Add locale parameter support for internationalization
   3. Update tests to validate local timezone display
   4. Ensure backward compatibility with existing callers
   ```

   **Files Affected:**

   ```
   - src/dateFormatter.js (implementation change)
   - test/dateFormatter.test.js (update test expectations)
   - docs/API.md (if exists - update documentation)
   ```

   **Testing Strategy:**

   ```
   1. Unit tests: Verify toLocaleString() is called
   2. Integration tests: Test with different timezone inputs
   3. Manual testing: Verify in browser with different locales
   4. Regression testing: Ensure existing functionality intact
   ```

   **Risks:**

   ```
   - Different browsers may format dates differently
   - Need to consider i18n requirements
   - May need polyfill for older browsers

   Mitigation:
   - Use standard toLocaleString() with explicit locale
   - Document expected formats
   - Add browser compatibility testing
   ```

4. **Review generated tech-spec**
   - Should be saved to `docs/tech-specs/timezone-bug-fix-tech-spec.md`
   - Review for completeness
   - Agent provides checklist validation

---

### Step 4: Create Story (3 minutes)

1. **Start fresh chat** with Developer agent

2. **Run create-story workflow**

   ```
   *story
   ```

3. **Provide story details:**

   **Story Title:**

   ```
   Fix: Display appointment times in user's local timezone
   ```

   **User Story:**

   ```
   As a user scheduling appointments
   I want to see times in my local timezone
   So that I don't get confused about when my appointments are
   ```

   **Acceptance Criteria:**

   ```
   - Dates display in user's browser timezone
   - Format is locale-appropriate (respects user's region settings)
   - Existing appointment displays still work
   - Tests pass with new implementation
   - Documentation updated if applicable
   ```

   **Tasks:**

   ```
   1. Update formatAppointmentTime to use toLocaleString()
   2. Add locale parameter with default fallback
   3. Update unit tests for new behavior
   4. Add integration test for timezone handling
   5. Manual test in different timezones
   6. Update API documentation if exists
   ```

   **Technical Notes:**

   ```
   - Use toLocaleString('en-US', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone })
   - Maintain backward compatibility
   - Consider making format configurable in future
   ```

4. **Review generated story**
   - Saved to `.bmad-ephemeral/stories/timezone-fix-001.md`
   - Story is marked as IN_PROGRESS

---

### Step 5: Implement Fix (10 minutes)

1. **Start fresh chat** with Developer agent

2. **Run dev-story workflow**

   ```
   *dev
   ```

3. **Agent guides through implementation:**

   **Step 1: Update dateFormatter.js**

   ```javascript
   // Fixed implementation
   function formatAppointmentTime(isoDate, locale = 'en-US') {
     const date = new Date(isoDate);

     // Get user's timezone
     const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

     // Format in local timezone with locale support
     return date.toLocaleString(locale, {
       timeZone,
       year: 'numeric',
       month: 'numeric',
       day: 'numeric',
       hour: 'numeric',
       minute: 'numeric',
       second: 'numeric',
       hour12: true,
     });
   }

   module.exports = { formatAppointmentTime };
   ```

   **Step 2: Update tests**

   ```javascript
   const { formatAppointmentTime } = require('../src/dateFormatter');

   describe('formatAppointmentTime', () => {
     it('should format date in local timezone', () => {
       const isoDate = '2025-01-15T14:00:00Z';
       const result = formatAppointmentTime(isoDate);

       // Should NOT contain UTC or GMT
       expect(result).not.toContain('UTC');
       expect(result).not.toContain('GMT');

       // Should be a valid formatted string
       expect(result).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
     });

     it('should support different locales', () => {
       const isoDate = '2025-01-15T14:00:00Z';

       const enUS = formatAppointmentTime(isoDate, 'en-US');
       const enGB = formatAppointmentTime(isoDate, 'en-GB');

       // Both should be valid but may differ in format
       expect(enUS).toBeTruthy();
       expect(enGB).toBeTruthy();
     });
   });
   ```

   **Step 3: Run tests**

   ```bash
   npm test
   # Verify all tests pass
   ```

   **Step 4: Manual verification**

   ```bash
   node -e "const { formatAppointmentTime } = require('./src/dateFormatter'); console.log(formatAppointmentTime('2025-01-15T14:00:00Z'));"
   # Should show time in YOUR local timezone
   ```

4. **Agent validates implementation against acceptance criteria**

---

### Step 6: Complete Story (2 minutes)

1. **Start fresh chat** with Scrum Master agent
   - Load `.bmad/bmm/agents/sm.md`

2. **Mark story done**

   ```
   *story-done
   ```

3. **Agent updates:**
   - Story moved to DONE in sprint status
   - Confirms all acceptance criteria met
   - Updates workflow tracking

---

## Expected Outputs

After completing this walkthrough, you should have:

### Files Created:

```
docs/
└── tech-specs/
    └── timezone-bug-fix-tech-spec.md

.bmad-ephemeral/
├── workflow-path.yaml
├── sprint-status.yaml
└── stories/
    └── timezone-fix-001.md

src/
└── dateFormatter.js (modified)

test/
└── dateFormatter.test.js (modified)
```

### Tech-Spec Contents:

- Problem description
- Current vs. desired behavior
- Solution approach
- Files affected
- Testing strategy
- Risk assessment

### Story Contents:

- User story format
- Acceptance criteria (testable)
- Task breakdown
- Technical notes
- Status: DONE

---

## Key Takeaways

### Quick Flow Track Features:

✅ **Lightweight**: Only tech-spec required, no PRD/Architecture
✅ **Fast**: 15-30 minute complete workflow
✅ **Focused**: Single issue, clear scope
✅ **Story-centric**: Immediate implementation guidance

### When to Use Quick Flow:

- ✅ Bug fixes (like this example)
- ✅ Small features (2-3 related changes)
- ✅ Clear, well-defined scope
- ✅ No architecture changes needed

### When NOT to Use Quick Flow:

- ❌ New features with unclear requirements
- ❌ Changes affecting multiple systems
- ❌ Need UX design or architecture decisions
- ❌ Complex multi-story epics

---

## Next Steps

### Practice More:

1. Try fixing another bug in your own codebase
2. Add a small feature using Quick Flow
3. Experiment with different story formats

### Level Up:

1. Try the [Web App Example](../bmm-track-web-app/) for full BMad Method track
2. Explore [document sharding](../../docs/document-sharding-guide.md) for larger projects
3. Customize agents for your team's workflow

### Troubleshooting:

- Stuck on a step? See [Troubleshooting Guide](../../docs/TROUBLESHOOTING.md)
- Questions? Check [FAQ](../../docs/FAQ.md)
- Need help? Join [Discord](https://discord.gg/gk8jAdXWmj)

---

## Variations to Try

Once comfortable with the basic flow:

### Variation 1: Multiple Related Fixes

- Fix timezone bug + add timezone selector UI
- Practice managing 2-3 stories in a mini-sprint

### Variation 2: Feature Enhancement

- Add customizable date format preferences
- Practice tech-spec for enhancement vs. bug fix

### Variation 3: Test-Driven Approach

- Write tests first using tech-spec
- Implement fix to make tests pass

---

## Feedback

- 💬 How was this example? Share in [Discord](https://discord.gg/gk8jAdXWmj)
- 🐛 Found an issue? [Report it](https://github.com/bmad-code-org/BMAD-METHOD/issues)
- ⭐ Helpful? [Star the repo](https://github.com/bmad-code-org/BMAD-METHOD)

---

_Example for BMad Method v6.0.0-alpha.8_
