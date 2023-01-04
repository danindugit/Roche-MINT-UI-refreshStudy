//Deletes study
Cypress.Commands.add('deleteStudy', (studyId, apiKey) => {
    const studyIdUrlKey = encodeURIComponent(studyId);

    cy.request({
        url: `${Cypress.env('saffron_url')}/metadata/${studyIdUrlKey}/0`,
        method: 'GET',
        headers: {
            APIKEY: `${apiKey}`,
        },
        failOnStatusCode: false,
    }).then(response => {
        if (response.status === 404) {
            return 
        }else{
            const versionId = response.body.version;
            cy.request({
                url: `${Cypress.env(
                    'saffron_url',
                )}/lock/${studyIdUrlKey}/0?user_name=${Cypress.env('username')}&time=30&version=${versionId}&action=true`,
                method: 'PUT',
                headers: {
                    APIKEY: `${apiKey}`,
                },
            }).then(() => {
                cy.request({
                    url: `${Cypress.env(
                        'saffron_url',
                    )}/study/${studyIdUrlKey}/0?user_name=${Cypress.env('username')}`,
                    method: 'DELETE',
                    headers: {
                        APIKEY: `${apiKey}`,
                    },
                })})
        }
    })
});

// Delete and create test study
Cypress.Commands.add('refreshStudy', (studyId, analysisNumber, apiKey) => {
    const studyIdUrlKey = encodeURIComponent(studyId);

    cy.request({
        url: `${Cypress.env('saffron_url')}/metadata/${studyIdUrlKey}/${analysisNumber}`,
        method: 'GET',
        headers: {
            APIKEY: `${apiKey}`,
        },
        failOnStatusCode: false,
    }).then(response => {
        if (response.status === 404) {
            // study doesn't exist, so create it
            cy.createStudy(
                studyId,
                analysisNumber,
                testAnalysis.studyConfiguration.gdsrVersion.value,
                testAnalysis.studyConfiguration.crf.versionId,
                testAnalysis.studyConfiguration.crf.value,
                testAnalysis.studyConfiguration.indicationStandards.value,
                apiKey,
            );
        } else {
            // extract metadata
            const versionId = response.body.version;
            cy.request({
                url: `${Cypress.env(
                    'saffron_url',
                )}/lock/${studyIdUrlKey}/${analysisNumber}?user_name=${Cypress.env('username')}&time=30&version=${versionId}&action=true`,
                method: 'PUT',
                headers: {
                    APIKEY: `${apiKey}`,
                },
            }).then(() => {
                cy.request({
                    url: `${Cypress.env(
                        'saffron_url',
                    )}/study/${studyIdUrlKey}/${analysisNumber}?user_name=${Cypress.env('username')}`,
                    method: 'DELETE',
                    headers: {
                        APIKEY: `${apiKey}`,
                    },
                }).then(() => {
                    cy.createStudy(
                        studyId,
                        analysisNumber,
                        testAnalysis.studyConfiguration.gdsrVersion.value,
                        testAnalysis.studyConfiguration.crf.versionId,
                        testAnalysis.studyConfiguration.crf.value,
                        testAnalysis.studyConfiguration.indicationStandards.value,
                        apiKey,
                    );
                });
            });
        }
    });
});
