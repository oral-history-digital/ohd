## Testing

See above for basic dependencies, then prepare the environment for
testing:

- `npm install --legacy-peer-deps`
- foreman start

Foreman also starts the development servers as they can be shared with the test
environment. With that out of the way, run all tests:

    bundle exec rails test -v test/
    bundle exec rails test -v test/system

Additional features of the test suite can be controlled with environment
variables:

- set COVERAGE=true to generate a coverage report to `tmp/coverage/index.html`
- set RETRY=true to rerun failed tests up to 3 times
- set HEADLESS=true to run the e2e tests in a headless browser

There is also a script to run all tests in an unattended fashion (with RETRY
and HEADLESS):

    bin/test

### Viewing System Tests in Browser

When running system tests in the dev container, you can view the browser in real-time via noVNC:

1. Start VNC services: `bin/vnc start`
2. Run tests with visible browser: `HEADLESS=false bundle exec rails test test/system`
3. Open http://localhost:6080/vnc.html in your host browser to watch the tests

Use `bin/vnc status` to check service status, or `bin/vnc stop` to stop the services when done.
