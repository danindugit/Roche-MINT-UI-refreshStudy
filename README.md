# Roche-MINT-UI-refreshStudy
This repository contains a cypress command that I developed for a JavaScript web app during my internship at Roche Canada. The purpose of this command is to achieve deterministic testing by refreshing the program's environment before each test is run.

## Execution
The refreshStudy command is executed in the beforeEach() section of the codebase as follows:
```
cy.refreshStudy(testAnalysis.study.id.value, analysisNumber, password);
```
