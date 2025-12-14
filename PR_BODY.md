## Security Remediation: Sanitize OTP-Bot.csproj

This PR replaces the obfuscated and dangerous `OTP-Bot.csproj` with a canonical, safe version.

### Changes

- **OTP-Bot.csproj**: Replaced with a canonical file that disables the `PreBuildEvent` target (`Condition="false"`).
- **CI Workflow**: Added `.github/workflows/prebuild-scan.yml` to detect dangerous PreBuild patterns in future commits/PRs.

### Original Content

The original `OTP-Bot.csproj` contained a highly obfuscated `PreBuild` Exec target that:
- Wrote a VBScript file (`Ixo2T6jfa.vbs`) to a temp directory via repeated `echo` commands
- Created a base64-encoded PowerShell payload (`Dj5c.ps1`) and decoded it on disk
- Executed the payload using `powershell.exe -ExecutionPolicy Bypass` and `cscript //nologo`
- This is a classic obfuscated malware payload execution pattern

**DO NOT re-enable or rebuild the original file.** It is archived safely in `.security/original-OTP-Bot.csproj` on branch `security/archive-OTP-Bot-csproj` for secure, offline human review only.

### Verification

✓ `OTP-Bot.csproj` now contains only safe, readable project configuration
✓ No dangerous markers remain (verified by `git grep`)
✓ CI workflow added to prevent future reintroduction of malicious prebuilds

### Security Review Required

**Maintainers/Security Team**: Please review the archived original file in `.security/original-OTP-Bot.csproj` (security branch) in an isolated environment and confirm:

1. The obfuscated PreBuild was indeed malicious
2. The sanitized replacement is safe to use
3. Any legitimate pre-build steps should be added in non-obfuscated form after security signoff

**Do not merge or re-enable PreBuild targets** until a human security reviewer has inspected and approved this change.

### Related Issues

- Archive branch: `security/archive-OTP-Bot-csproj` (contains `.security/original-OTP-Bot.csproj`)
- CI check added: Prevents dangerous patterns in future commits

---

**Checklist for Reviewer:**
- [ ] Inspected archived original file in an isolated environment
- [ ] Confirmed obfuscated PreBuild was malicious
- [ ] Verified sanitized file contains no Exec blocks or echo payloads
- [ ] CI workflow passes and detects the dangerous patterns
- [ ] Approved by security team
