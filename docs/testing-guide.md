# Testing Guide

## Login Bypass Feature

A temporary testing bypass has been implemented to facilitate testing and development. This feature is strictly controlled and must be used responsibly.

### Important Security Notes

- The bypass only works in development environments
- Has a hard expiration date of April 30, 2024
- All bypass attempts are logged
- Must be completely removed before deployment
- Requires security team approval
- Does not interfere with normal authentication

### Usage

1. The bypass is only available in development mode
2. A warning banner will appear on the login page
3. Enter the bypass code provided by your team lead
4. The bypass will automatically expire after April 30, 2024

### Security Measures

- Environment-based activation
- Expiration date enforcement
- Detailed logging of all attempts
- Separate validation logic
- Clear visual indicators

### Pre-Deployment Checklist

- [ ] Remove all bypass-related code
- [ ] Verify removal in all environments
- [ ] Security team sign-off
- [ ] Update documentation
- [ ] Final testing without bypass